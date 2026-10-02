"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import {
  useGLTF,
  CameraControls,
  CameraControlsImpl,
  Environment,
  ContactShadows,
  Html,
} from "@react-three/drei";
import * as THREE from "three";
import manifestData from "./gallery_manifest.json";

export interface GarmentManifestItem {
  id: string;
  meshName: string;
  backdropName: string;
  title: string;
  era: string;
  tourOrder: number;
  rotatable: boolean;
  studio360Enabled: boolean;
  highlightFront: string;
  highlightBack: string;
  pedestalOrigin: [number, number, number];
  cameraPosition: [number, number, number];
  targetPosition: [number, number, number];
}

interface GalleryManifest {
  overview: {
    cameraPosition: [number, number, number];
    targetPosition: [number, number, number];
  };
  garments: GarmentManifestItem[];
}

const manifest = manifestData as unknown as GalleryManifest;

const STUDIO_THEMES = {
  warm: "#EAE4DC",
  dark: "#161412",
} as const;

const CORRIDOR_BG = "#1A120E";

function computeOverviewArc(yaw: number, isPortrait: boolean) {
  const baseZ = isPortrait ? 6.85 : 7.3;
  const camY = isPortrait ? 1.85 : 2.05;

  const camX = Math.sin(yaw) * 0.3;
  const camZ = baseZ + (1 - Math.cos(yaw)) * 0.2;

  const lookRadius = 8.5;
  const targetX = Math.sin(yaw) * lookRadius;
  const targetY = isPortrait ? 1.15 : 1.2;
  const targetZ = camZ - Math.cos(yaw) * lookRadius;

  return { camX, camY, camZ, targetX, targetY, targetZ };
}

/**
 * Tìm chính xác Node gốc chứa Mesh của bộ trang phục trong Scene
 * (An toàn ngay cả khi Blender đổi tên hậu tố _V2, .001 hoặc tách Mesh con).
 */
function findGarmentRoot(
  root: THREE.Object3D,
  g: GarmentManifestItem,
): THREE.Object3D | null {
  const exact = root.getObjectByName(g.meshName);
  if (exact) {
    let hasMesh = false;
    exact.traverse((c) => {
      if (c instanceof THREE.Mesh) hasMesh = true;
    });
    if (hasMesh) return exact;
  }

  let matched: THREE.Object3D | null = null;
  const prefix = g.meshName.toLowerCase();
  root.traverse((obj) => {
    if (matched) return;
    const nameLower = obj.name.toLowerCase();
    const isIdMatch = obj.userData?.garment_id === g.id;
    const isPrefixMatch =
      nameLower === prefix ||
      nameLower.startsWith(prefix + "_") ||
      nameLower.startsWith(prefix + ".");

    if (isIdMatch || isPrefixMatch) {
      let hasMesh = false;
      obj.traverse((c) => {
        if (c instanceof THREE.Mesh) hasMesh = true;
      });
      if (hasMesh) {
        matched = obj;
      }
    }
  });

  return matched;
}

/**
 * Chuẩn hóa Tâm xoay (Pivot) của Object về đúng tâm đáy bục gỗ (pedestalPos)
 * và tính góc bù để Mặt Trước luôn tự động xoay thẳng vào Camera cá nhân.
 */
function normalizePivotAndComputeFrontYaw(obj: THREE.Object3D): {
  pedestalPos: THREE.Vector3;
  frontAlignYaw: number;
} {
  obj.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(obj);
  const center = new THREE.Vector3();
  box.getCenter(center);

  const pedPos = new THREE.Vector3(center.x, Math.max(0, box.min.y), center.z);

  const objWorldPos = new THREE.Vector3();
  obj.getWorldPosition(objWorldPos);
  if (Math.hypot(objWorldPos.x - pedPos.x, objWorldPos.z - pedPos.z) > 0.05) {
    const localTarget = obj.worldToLocal(pedPos.clone());
    obj.traverse((child) => {
      if (child instanceof THREE.Mesh && child.geometry) {
        child.geometry = child.geometry.clone();
        child.geometry.translate(
          -localTarget.x,
          -localTarget.y,
          -localTarget.z,
        );
      }
    });
    if (obj.parent) {
      obj.position.copy(obj.parent.worldToLocal(pedPos.clone()));
    } else {
      obj.position.copy(pedPos);
    }
    obj.updateWorldMatrix(true, true);
  }

  // Chỉ lấy các đỉnh ở 2 đầu ống tay áo (bán kính > 0.26m, tức dx^2 + dz^2 > 0.068)
  // để không bị nhiễu bởi các hạt khuy đồng trên ngực Áo Ngũ Thân
  let sXX = 0;
  let sZZ = 0;
  let sXZ = 0;
  let count = 0;
  const vWorld = new THREE.Vector3();
  const minY = box.min.y;

  obj.traverse((child) => {
    if (child instanceof THREE.Mesh && child.geometry) {
      const posAttr = child.geometry.attributes.position;
      if (!posAttr) return;
      for (let i = 0; i < posAttr.count; i++) {
        vWorld.fromBufferAttribute(posAttr, i).applyMatrix4(child.matrixWorld);
        const relY = vWorld.y - minY;
        if (relY >= 0.88 && relY <= 1.48) {
          const dx = vWorld.x - pedPos.x;
          const dz = vWorld.z - pedPos.z;
          if (dx * dx + dz * dz > 0.068) {
            sXX += dx * dx;
            sZZ += dz * dz;
            sXZ += dx * dz;
            count++;
          }
        }
      }
    }
  });

  if (count < 6) {
    return { pedestalPos: pedPos, frontAlignYaw: 0 };
  }

  const shoulderAngle = 0.5 * Math.atan2(2 * sXZ, sXX - sZZ);
  const normalAngle = shoulderAngle + Math.PI * 0.5;
  const nx = Math.cos(normalAngle);
  const nz = Math.sin(normalAngle);

  const toCamX = pedPos.x < -0.5 ? 1.0 : pedPos.x > 0.5 ? -1.0 : 0.0;
  const toCamZ = Math.abs(pedPos.x) <= 0.5 ? 1.0 : 0.0;

  const currentFrontAzimuth = Math.atan2(nx, nz);
  const desiredCamAzimuth = Math.atan2(toCamX, toCamZ);

  let deltaYaw = desiredCamAzimuth - currentFrontAzimuth;

  // KHÓA CHỐNG LẬT 180°: Đưa góc bù về miền góc nhọn [-PI/2, +PI/2]
  // Vì ở hành lang mặt trước đã hướng sẵn ra lối đi (chỉ xoay nghiêng < 35°),
  // phép rút gọn modulo PI này đảm bảo 100% không bộ nào bị quay lưng 180°!
  while (deltaYaw > Math.PI * 0.5) deltaYaw -= Math.PI;
  while (deltaYaw < -Math.PI * 0.5) deltaYaw += Math.PI;

  return { pedestalPos: pedPos, frontAlignYaw: deltaYaw };
}

/**
 * Căn khung hình lấy trọn vẹn > 4/5 chiều cao trang phục (từ đỉnh mũ/nón xuống hết tà váy & bục)
 * kết hợp Bố cục 2/3 - 1/3 trên Desktop và Chính tâm 50/50 ở Studio 360 / Mobile.
 */
function computeGarmentFraming(
  pedestalPos: THREE.Vector3,
  isPortrait: boolean,
  isInfoOpen: boolean,
  inStudio: boolean,
) {
  // Đặt tâm nhìn ở độ cao 0.98m (ngang thắt lưng) để cân bằng phần đầu/mũ và chân váy
  const targetY = pedestalPos.y + 0.98;
  const camY = pedestalPos.y + 1.08;

  // Với FOV = 48°, khoảng cách 2.15m mở ra khung dọc 1.91m -> lấy trọn vẹn mẫu cao 1.80m
  const dist = isPortrait
    ? isInfoOpen && !inStudio
      ? 2.45
      : 2.1
    : inStudio
      ? 2.1
      : 2.15;

  const baseTarget = new THREE.Vector3(pedestalPos.x, targetY, pedestalPos.z);
  const baseCam = new THREE.Vector3();

  if (pedestalPos.x < -0.5) {
    baseCam.set(pedestalPos.x + dist, camY, pedestalPos.z);
  } else if (pedestalPos.x > 0.5) {
    baseCam.set(pedestalPos.x - dist, camY, pedestalPos.z);
  } else {
    baseCam.set(pedestalPos.x, camY + 0.04, pedestalPos.z + dist * 1.06);
  }

  const forward = new THREE.Vector3()
    .subVectors(baseTarget, baseCam)
    .normalize();
  const up = new THREE.Vector3(0, 1, 0);
  const rightVec = new THREE.Vector3().crossVectors(forward, up).normalize();

  // Ở Hành lang trên PC (khi mở bảng thông tin): Dịch khung nhìn 0.28m tạo bố cục 2/3 - 1/3
  // Ở Studio 360 hoặc trên Mobile hoặc khi Thu gọn bảng: Đặt chính tâm 50/50 (0.0m)
  const desktopThirdsShift =
    !isPortrait && isInfoOpen && !inStudio ? 0.28 : 0.0;

  baseCam.addScaledVector(rightVec, desktopThirdsShift);
  baseTarget.addScaledVector(rightVec, desktopThirdsShift);

  // Trên Mobile dọc: Khi mở thẻ thông tin ở dưới, dịch nhẹ tâm nhìn để đẩy mẫu lên nửa trên
  if (isPortrait && !inStudio) {
    baseTarget.y += isInfoOpen ? -0.32 : -0.02;
  }

  return {
    cam: [baseCam.x, baseCam.y, baseCam.z] as [number, number, number],
    target: [baseTarget.x, baseTarget.y, baseTarget.z] as [
      number,
      number,
      number,
    ],
  };
}

function SceneContent({
  activeId,
  isStudio360,
  isInfoOpen,
  studioTheme,
  targetYawRef,
  overviewYawRef,
  dragDistanceRef,
  onSelectGarment,
}: {
  activeId: string;
  isStudio360: boolean;
  isInfoOpen: boolean;
  studioTheme: "warm" | "dark";
  targetYawRef: React.MutableRefObject<number>;
  overviewYawRef: React.MutableRefObject<number>;
  dragDistanceRef: React.MutableRefObject<number>;
  onSelectGarment: (id: string) => void;
}) {
  const { scene: gltfScene } = useGLTF("/models/viet_phuc_gallery.glb");
  const { size } = useThree();
  const controlsRef = useRef<CameraControls>(null);
  const appliedOverviewYawRef = useRef<number>(0);
  const hasInitializedRef = useRef<boolean>(false);

  const isPortrait = size.width < size.height;
  const activeGarment = useMemo(
    () => manifest.garments.find((g) => g.id === activeId) || null,
    [activeId],
  );

  const inStudio = isStudio360 && activeGarment !== null;
  const bgColor = inStudio ? STUDIO_THEMES[studioTheme] : CORRIDOR_BG;

  const garmentRootsRef = useRef<Record<string, THREE.Object3D>>({});
  const initialRotations = useRef<Record<string, number>>({});
  const frontAlignOffsets = useRef<Record<string, number>>({});
  const truePedestalPositions = useRef<Record<string, THREE.Vector3>>({});

  // Chuẩn hóa Pivot & tính góc xoay Mặt Trước cho cả 5 bộ ngay khi tải xong Scene
  const ensureGarmentMetrics = (g: GarmentManifestItem) => {
    if (!truePedestalPositions.current[g.meshName]) {
      const rootObj = findGarmentRoot(gltfScene, g);
      if (rootObj) {
        garmentRootsRef.current[g.meshName] = rootObj;
        initialRotations.current[g.meshName] = rootObj.rotation.y;
        const { pedestalPos, frontAlignYaw } =
          normalizePivotAndComputeFrontYaw(rootObj);
        truePedestalPositions.current[g.meshName] = pedestalPos;
        frontAlignOffsets.current[g.meshName] = frontAlignYaw;
      }
    }
    return (
      truePedestalPositions.current[g.meshName] ||
      new THREE.Vector3(...g.pedestalOrigin)
    );
  };

  useEffect(() => {
    gltfScene.updateMatrixWorld(true);
    manifest.garments.forEach((g) => {
      ensureGarmentMetrics(g);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gltfScene]);

  // 1. SỬA TRIỆT ĐỂ LỖI MẤT HÌNH STUDIO 360°:
  // Giữ hiển thị toàn bộ cây Cha - Con (Mesh, Group, Primitive) của bộ trang phục đang chọn
  useEffect(() => {
    if (!inStudio || !activeGarment) {
      gltfScene.traverse((obj) => {
        obj.visible = true;
      });
      return;
    }

    const targetRoot =
      garmentRootsRef.current[activeGarment.meshName] ||
      findGarmentRoot(gltfScene, activeGarment);

    if (!targetRoot) return;

    const visibleSet = new Set<THREE.Object3D>();
    // Giữ tất cả các Mesh con bên trong bộ trang phục
    targetRoot.traverse((child) => {
      visibleSet.add(child);
    });
    // Giữ tất cả các Group/Scene cha dẫn tới bộ trang phục
    let parent: THREE.Object3D | null = targetRoot.parent;
    while (parent) {
      visibleSet.add(parent);
      parent = parent.parent;
    }

    // Ẩn toàn bộ Hành lang (ENV_*) và 4 bộ trang phục còn lại
    gltfScene.traverse((obj) => {
      obj.visible = visibleSet.has(obj);
    });
  }, [inStudio, activeGarment, gltfScene]);

  // 2. Điều khiển Camera bay tới đúng tâm thực tế của trang phục (cả ở Hành lang & Studio 360°)
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    void controls.zoomTo(1, true);

    if (activeId === "overview" || !activeGarment) {
      overviewYawRef.current = 0;
      appliedOverviewYawRef.current = 0;
      const { camX, camY, camZ, targetX, targetY, targetZ } =
        computeOverviewArc(0, isPortrait);
      const shouldTransition = hasInitializedRef.current;
      hasInitializedRef.current = true;
      void controls.setLookAt(
        camX,
        camY,
        camZ,
        targetX,
        targetY,
        targetZ,
        shouldTransition,
      );
      targetYawRef.current = 0;
    } else {
      hasInitializedRef.current = true;
      const realPos = ensureGarmentMetrics(activeGarment);
      const { cam, target } = computeGarmentFraming(
        realPos,
        isPortrait,
        isInfoOpen,
        inStudio,
      );

      void controls.setLookAt(
        cam[0],
        cam[1],
        cam[2],
        target[0],
        target[1],
        target[2],
        true,
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    activeId,
    activeGarment,
    inStudio,
    isPortrait,
    isInfoOpen,
    gltfScene,
    targetYawRef,
    overviewYawRef,
  ]);

  // 3. Nội suy mượt góc nhìn Toàn cảnh & Tự động quay Mặt Trước (0°) của trang phục về phía Camera
  useFrame((_, delta) => {
    if (activeId === "overview" && !inStudio && controlsRef.current) {
      const diff = overviewYawRef.current - appliedOverviewYawRef.current;
      if (Math.abs(diff) > 0.0001) {
        appliedOverviewYawRef.current = THREE.MathUtils.damp(
          appliedOverviewYawRef.current,
          overviewYawRef.current,
          8,
          delta,
        );
        const { camX, camY, camZ, targetX, targetY, targetZ } =
          computeOverviewArc(appliedOverviewYawRef.current, isPortrait);
        void controlsRef.current.setLookAt(
          camX,
          camY,
          camZ,
          targetX,
          targetY,
          targetZ,
          false,
        );
      }
    }

    manifest.garments.forEach((g) => {
      const obj =
        garmentRootsRef.current[g.meshName] || findGarmentRoot(gltfScene, g);
      if (!obj) return;

      const baseRot = initialRotations.current[g.meshName] ?? obj.rotation.y;
      const alignOffset = frontAlignOffsets.current[g.meshName] ?? 0;

      // Khi chọn xem 1 bộ trang phục: Tự động xoay mặt trước nhìn thẳng vào Camera (baseRot + alignOffset)
      // Khi ở Toàn cảnh: Trả về góc đứng nghiêng đón khách tự nhiên ban đầu (baseRot)
      const desiredRot =
        g.id === activeId
          ? baseRot + alignOffset + (isStudio360 ? 0 : targetYawRef.current)
          : baseRot;

      obj.rotation.y = THREE.MathUtils.damp(
        obj.rotation.y,
        desiredRot,
        6.5,
        delta,
      );
    });
  });

  // 4. Click vào Mannequin trong hành lang để bay tới
  const handleSceneClick = (e: ThreeEvent<MouseEvent>) => {
    if (isStudio360 || dragDistanceRef.current > 8) return;
    e.stopPropagation();

    let curr: THREE.Object3D | null = e.object;
    while (curr) {
      if (typeof curr.userData?.garment_id === "string") {
        onSelectGarment(curr.userData.garment_id);
        return;
      }
      const nameLower = curr.name.toLowerCase();
      const matched = manifest.garments.find((g) => {
        const prefix = g.meshName.toLowerCase();
        return (
          nameLower === prefix ||
          nameLower.startsWith(prefix + "_") ||
          nameLower.startsWith(prefix + ".")
        );
      });
      if (matched) {
        onSelectGarment(matched.id);
        return;
      }
      curr = curr.parent;
    }
  };

  const activeRealPos = activeGarment
    ? truePedestalPositions.current[activeGarment.meshName] ||
      new THREE.Vector3(...activeGarment.pedestalOrigin)
    : null;

  return (
    <>
      <color attach="background" args={[bgColor]} />
      {!inStudio && <fogExp2 attach="fog" args={[CORRIDOR_BG, 0.045]} />}

      <CameraControls
        ref={controlsRef}
        smoothTime={0.55}
        mouseButtons={{
          left: inStudio
            ? CameraControlsImpl.ACTION.ROTATE
            : CameraControlsImpl.ACTION.NONE,
          middle: CameraControlsImpl.ACTION.ZOOM,
          right: CameraControlsImpl.ACTION.NONE,
          wheel: CameraControlsImpl.ACTION.ZOOM,
        }}
        touches={{
          one: inStudio
            ? CameraControlsImpl.ACTION.TOUCH_ROTATE
            : CameraControlsImpl.ACTION.NONE,
          two: CameraControlsImpl.ACTION.TOUCH_ZOOM,
          three: CameraControlsImpl.ACTION.NONE,
        }}
        minZoom={0.8}
        maxZoom={2.4}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.55}
      />

      <Environment
        preset={inStudio ? "studio" : "apartment"}
        environmentIntensity={inStudio ? 0.9 : 0.55}
      />
      <ambientLight intensity={inStudio ? 0.55 : 0.38} />

      {activeRealPos && (
        <spotLight
          position={[
            activeRealPos.x + (activeRealPos.x < 0 ? 1.5 : -1.5),
            activeRealPos.y + 2.4,
            activeRealPos.z + 1.1,
          ]}
          intensity={inStudio ? 2.6 : 3.2}
          color={inStudio ? "#FFFDF8" : "#FFE0B2"}
          angle={0.65}
          penumbra={0.85}
        />
      )}

      {/* Đặt bóng đổ Studio ngay dưới đúng tọa độ bục gỗ của bộ trang phục đang chọn */}
      {inStudio && activeRealPos && (
        <ContactShadows
          position={[activeRealPos.x, activeRealPos.y + 0.005, activeRealPos.z]}
          opacity={0.42}
          scale={4.5}
          blur={2.2}
          frames={1}
        />
      )}

      <primitive object={gltfScene} onClick={handleSceneClick} />
    </>
  );
}

export default function VietPhucGallery({
  embedded = false,
}: {
  embedded?: boolean;
}) {
  const [activeId, setActiveId] = useState<string>("overview");
  const [isStudio360, setIsStudio360] = useState<boolean>(false);
  const [isInfoOpen, setIsInfoOpen] = useState<boolean>(true);
  const [studioTheme, setStudioTheme] = useState<"warm" | "dark">("warm");
  const [viewingSide, setViewingSide] = useState<"front" | "back">("front");
  const [isMobile, setIsMobile] = useState<boolean>(false);

  const targetYawRef = useRef<number>(0);
  const overviewYawRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const prevXRef = useRef<number>(0);
  const dragDistanceRef = useRef<number>(0);

  useEffect(() => {
    const checkViewport = () => setIsMobile(window.innerWidth < 768);
    checkViewport();
    window.addEventListener("resize", checkViewport);
    return () => window.removeEventListener("resize", checkViewport);
  }, []);

  const sortedGarments = useMemo(
    () => [...manifest.garments].sort((a, b) => a.tourOrder - b.tourOrder),
    [],
  );
  const currentIndex = sortedGarments.findIndex((g) => g.id === activeId);
  const currentGarment =
    currentIndex >= 0 ? sortedGarments[currentIndex] : null;

  const selectGarment = (id: string) => {
    setActiveId(id);
    setViewingSide("front");
    targetYawRef.current = 0;
    if (id === "overview") setIsStudio360(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (isStudio360) return;
    isDraggingRef.current = true;
    prevXRef.current = e.clientX;
    dragDistanceRef.current = 0;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || isStudio360) return;
    const deltaX = e.clientX - prevXRef.current;
    prevXRef.current = e.clientX;
    dragDistanceRef.current += Math.abs(deltaX);

    if (activeId === "overview") {
      const maxArc = isMobile ? 0.46 : 0.28;
      overviewYawRef.current = THREE.MathUtils.clamp(
        overviewYawRef.current - deltaX * 0.0035,
        -maxArc,
        maxArc,
      );
    } else {
      targetYawRef.current += deltaX * 0.012;
      const norm = Math.abs(targetYawRef.current % (Math.PI * 2));
      setViewingSide(
        norm > Math.PI * 0.5 && norm < Math.PI * 1.5 ? "back" : "front",
      );
    }
  };

  const handlePointerUp = () => {
    isDraggingRef.current = false;
  };

  const rotateToSide = (side: "front" | "back") => {
    setViewingSide(side);
    targetYawRef.current = side === "front" ? 0 : Math.PI;
  };

  const goStep = (dir: -1 | 1) => {
    if (currentIndex === -1) {
      selectGarment(sortedGarments[0].id);
      return;
    }
    const nextIdx =
      (currentIndex + dir + sortedGarments.length) % sortedGarments.length;
    selectGarment(sortedGarments[nextIdx].id);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: embedded ? "relative" : "fixed",
        inset: embedded ? undefined : 0,
        width: "100%",
        height: embedded ? "640px" : "100dvh",
        background: "#1A120E",
        overflow: "hidden",
        userSelect: "none",
        touchAction: "none",
        cursor: activeId === "overview" ? "grab" : "default",
        zIndex: embedded ? 1 : 50,
      }}
    >
      <Canvas camera={{ fov: 48, position: [0, 2.05, 7.3] }} dpr={[1, 1.5]}>
        <Suspense
          fallback={
            <Html center>
              <div
                style={{
                  padding: "12px 20px",
                  borderRadius: "12px",
                  background: "rgba(26, 18, 14, 0.92)",
                  color: "#F5EFE6",
                  fontSize: "14px",
                  border: "1px solid rgba(224, 159, 62, 0.4)",
                  whiteSpace: "nowrap",
                }}
              >
                Đang tải mô hình 3D Việt phục...
              </div>
            </Html>
          }
        >
          <SceneContent
            activeId={activeId}
            isStudio360={isStudio360}
            isInfoOpen={isInfoOpen}
            studioTheme={studioTheme}
            targetYawRef={targetYawRef}
            overviewYawRef={overviewYawRef}
            dragDistanceRef={dragDistanceRef}
            onSelectGarment={selectGarment}
          />
        </Suspense>
      </Canvas>

      {!embedded && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: isMobile ? "12px" : "20px",
            left: isMobile ? "12px" : "20px",
            zIndex: 20,
          }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "6px",
              padding: isMobile ? "8px 14px" : "10px 18px",
              borderRadius: "999px",
              background: "rgba(26, 18, 14, 0.85)",
              backdropFilter: "blur(8px)",
              color: "#F5EFE6",
              textDecoration: "none",
              fontSize: isMobile ? "12px" : "13px",
              fontWeight: 600,
              border: "1px solid rgba(213, 203, 183, 0.3)",
            }}
          >
            ← Về trang chủ
          </Link>
        </div>
      )}

      {activeId === "overview" && (
        <div
          style={{
            position: "absolute",
            bottom: isMobile ? "68px" : "76px",
            left: "50%",
            transform: "translateX(-50%)",
            padding: "6px 14px",
            borderRadius: "999px",
            background: "rgba(26, 18, 14, 0.72)",
            backdropFilter: "blur(6px)",
            color: "#EAE4DC",
            fontSize: "11px",
            whiteSpace: "nowrap",
            pointerEvents: "none",
            border: "1px solid rgba(224, 159, 62, 0.25)",
            zIndex: 15,
          }}
        >
          ↔ Vuốt ngang để ngắm quanh hành lang · Chạm vào trang phục để khám phá
        </div>
      )}

      {currentGarment && isInfoOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: isMobile ? "auto" : "20px",
            bottom: isMobile ? "68px" : "auto",
            right: isMobile ? "12px" : "20px",
            left: isMobile ? "12px" : "auto",
            width: isMobile ? "auto" : "360px",
            background: "rgba(26, 18, 14, 0.92)",
            backdropFilter: "blur(12px)",
            padding: isMobile ? "14px" : "20px",
            borderRadius: isMobile ? "16px" : "20px",
            border: "1px solid rgba(224, 159, 62, 0.35)",
            color: "#F5EFE6",
            zIndex: 20,
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "10px",
              fontSize: "11px",
            }}
          >
            <span
              style={{
                color: "#E09F3E",
                fontWeight: 700,
                textTransform: "uppercase",
              }}
            >
              {currentGarment.era}
            </span>
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: "8px",
                flexShrink: 0,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ opacity: 0.7 }}>
                Điểm dừng {currentGarment.tourOrder}/{sortedGarments.length}
              </span>
              <button
                type="button"
                onClick={() => setIsInfoOpen(false)}
                style={{
                  padding: "3px 9px",
                  borderRadius: "999px",
                  border: "1px solid rgba(224, 159, 62, 0.4)",
                  background: "rgba(255, 255, 255, 0.08)",
                  color: "#F5EFE6",
                  fontSize: "11px",
                  fontWeight: 600,
                  cursor: "pointer",
                }}
              >
                Thu gọn ▾
              </button>
            </div>
          </div>

          <h3
            style={{
              margin: isMobile ? "4px 0 8px" : "6px 0 12px",
              fontSize: isMobile ? "17px" : "20px",
              fontWeight: 700,
            }}
          >
            {currentGarment.title}
          </h3>

          <div
            style={{
              padding: isMobile ? "9px 11px" : "12px",
              borderRadius: "10px",
              background: "rgba(255, 255, 255, 0.06)",
              fontSize: isMobile ? "12px" : "13px",
              lineHeight: 1.45,
            }}
          >
            <strong
              style={{
                color: "#F4A261",
                display: "block",
                marginBottom: "2px",
              }}
            >
              {viewingSide === "front"
                ? "Đặc trưng Mặt trước:"
                : "Đặc trưng Mặt sau:"}
            </strong>
            {viewingSide === "front"
              ? currentGarment.highlightFront
              : currentGarment.highlightBack}
          </div>

          {!isStudio360 ? (
            <div style={{ marginTop: isMobile ? "8px" : "12px" }}>
              <div
                style={{
                  fontSize: "11px",
                  opacity: 0.75,
                  marginBottom: "5px",
                }}
              >
                Vuốt ngang trên mẫu để xoay hoặc chọn góc nhanh:
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => rotateToSide("front")}
                  style={{
                    flex: 1,
                    padding: "7px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    background:
                      viewingSide === "front"
                        ? "#AE443A"
                        : "rgba(255,255,255,0.1)",
                    color: "#FFF",
                  }}
                >
                  Mặt trước (0°)
                </button>
                <button
                  type="button"
                  onClick={() => rotateToSide("back")}
                  style={{
                    flex: 1,
                    padding: "7px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    background:
                      viewingSide === "back"
                        ? "#AE443A"
                        : "rgba(255,255,255,0.1)",
                    color: "#FFF",
                  }}
                >
                  Mặt sau (180°)
                </button>
              </div>
            </div>
          ) : (
            <div
              style={{
                marginTop: "10px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                fontSize: "12px",
              }}
            >
              <span>Phông nền Studio:</span>
              <div style={{ display: "flex", gap: "6px" }}>
                <button
                  type="button"
                  onClick={() => setStudioTheme("warm")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    background:
                      studioTheme === "warm"
                        ? "#EAE4DC"
                        : "rgba(255,255,255,0.15)",
                    color: studioTheme === "warm" ? "#1A120E" : "#FFF",
                  }}
                >
                  Sáng ấm
                </button>
                <button
                  type="button"
                  onClick={() => setStudioTheme("dark")}
                  style={{
                    padding: "5px 10px",
                    borderRadius: "6px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    background:
                      studioTheme === "dark"
                        ? "#E09F3E"
                        : "rgba(255,255,255,0.15)",
                    color: "#FFF",
                  }}
                >
                  Tối trầm
                </button>
              </div>
            </div>
          )}

          <div
            style={{
              marginTop: isMobile ? "10px" : "14px",
              display: "flex",
              gap: "8px",
            }}
          >
            <button
              type="button"
              onClick={() => setIsStudio360((prev) => !prev)}
              style={{
                flex: 1,
                padding: isMobile ? "8px" : "10px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 700,
                background: "#E09F3E",
                color: "#1A120E",
              }}
            >
              {isStudio360
                ? "← Trở lại Hành lang"
                : "Soi chi tiết 360° (Cô lập)"}
            </button>
            <button
              type="button"
              onClick={() => goStep(-1)}
              style={{
                padding: isMobile ? "8px 12px" : "10px 14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: "rgba(255,255,255,0.12)",
                color: "#FFF",
              }}
            >
              ‹
            </button>
            <button
              type="button"
              onClick={() => goStep(1)}
              style={{
                padding: isMobile ? "8px 12px" : "10px 14px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                background: "rgba(255,255,255,0.12)",
                color: "#FFF",
              }}
            >
              ›
            </button>
          </div>
        </div>
      )}

      {currentGarment && !isInfoOpen && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: isMobile ? "auto" : "20px",
            bottom: isMobile ? "68px" : "auto",
            right: isMobile ? "12px" : "20px",
            left: isMobile ? "12px" : "auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "8px",
            background: "rgba(26, 18, 14, 0.88)",
            backdropFilter: "blur(10px)",
            padding: "8px 12px",
            borderRadius: "999px",
            border: "1px solid rgba(224, 159, 62, 0.35)",
            color: "#F5EFE6",
            zIndex: 20,
          }}
        >
          <span
            style={{
              fontSize: "13px",
              fontWeight: 700,
              whiteSpace: "nowrap",
              overflow: "hidden",
              textOverflow: "ellipsis",
              paddingLeft: "4px",
            }}
          >
            {currentGarment.title}
          </span>

          <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
            <button
              type="button"
              onClick={() => setIsStudio360((prev) => !prev)}
              style={{
                padding: "6px 10px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 700,
                background: "#E09F3E",
                color: "#1A120E",
                whiteSpace: "nowrap",
              }}
            >
              {isStudio360 ? "← Hành lang" : "360°"}
            </button>
            <button
              type="button"
              onClick={() => setIsInfoOpen(true)}
              style={{
                padding: "6px 12px",
                borderRadius: "999px",
                border: "1px solid rgba(224, 159, 62, 0.45)",
                cursor: "pointer",
                fontSize: "11px",
                fontWeight: 600,
                background: "rgba(255, 255, 255, 0.1)",
                color: "#F5EFE6",
                whiteSpace: "nowrap",
              }}
            >
              Thuyết minh ▴
            </button>
          </div>
        </div>
      )}

      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: isMobile ? "12px" : "20px",
          left: "12px",
          right: "12px",
          display: "flex",
          justifyContent: isMobile ? "flex-start" : "center",
          pointerEvents: "none",
          zIndex: 20,
        }}
      >
        <div
          style={{
            pointerEvents: "auto",
            maxWidth: "100%",
            overflowX: "auto",
            display: "flex",
            gap: "6px",
            padding: "6px",
            borderRadius: "999px",
            background: "rgba(26, 18, 14, 0.9)",
            backdropFilter: "blur(10px)",
            border: "1px solid rgba(224, 159, 62, 0.35)",
          }}
        >
          <button
            type="button"
            onClick={() => selectGarment("overview")}
            style={{
              padding: "7px 13px",
              borderRadius: "999px",
              border: "none",
              cursor: "pointer",
              fontSize: "12px",
              fontWeight: 600,
              whiteSpace: "nowrap",
              background: activeId === "overview" ? "#AE443A" : "transparent",
              color: "#F5EFE6",
            }}
          >
            Toàn cảnh
          </button>
          {sortedGarments.map((g) => (
            <button
              key={g.id}
              type="button"
              onClick={() => selectGarment(g.id)}
              style={{
                padding: "7px 13px",
                borderRadius: "999px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 600,
                whiteSpace: "nowrap",
                background: activeId === g.id ? "#AE443A" : "transparent",
                color: "#F5EFE6",
              }}
            >
              {g.tourOrder}.{" "}
              {g.title.replace(" Truyền Thống", "").replace(" Cung Đình", "")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

useGLTF.preload("/models/viet_phuc_gallery.glb");
