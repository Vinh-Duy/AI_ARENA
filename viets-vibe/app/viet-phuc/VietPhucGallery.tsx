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

// Khóa chuẩn Góc Điện Ảnh (Ảnh 1) cho cả lúc mới tải trang lẫn lúc vuốt ngang
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

function SceneContent({
  activeId,
  isStudio360,
  studioTheme,
  targetYawRef,
  overviewYawRef,
  dragDistanceRef,
  onSelectGarment,
}: {
  activeId: string;
  isStudio360: boolean;
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

  const initialRotations = useRef<Record<string, number>>({});
  useEffect(() => {
    manifest.garments.forEach((g) => {
      const obj = gltfScene.getObjectByName(g.meshName);
      if (obj && initialRotations.current[g.meshName] === undefined) {
        initialRotations.current[g.meshName] = obj.rotation.y;
      }
    });
  }, [gltfScene]);

  // 1. Ẩn/Hiện bối cảnh Hành lang <-> Studio 360°
  useEffect(() => {
    gltfScene.traverse((obj) => {
      if (obj.name.startsWith("ENV_")) {
        obj.visible = !inStudio;
      } else if (obj.name.startsWith("GARMENT_")) {
        obj.visible = inStudio ? obj.name === activeGarment?.meshName : true;
      }
    });
  }, [inStudio, activeGarment, gltfScene]);

  // 2. Chuyển góc nhìn mượt khi chọn trang phục hoặc quay về Toàn cảnh
  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    void controls.zoomTo(1, true);

    if (activeId === "overview" || !activeGarment) {
      overviewYawRef.current = 0;
      appliedOverviewYawRef.current = 0;
      const { camX, camY, camZ, targetX, targetY, targetZ } =
        computeOverviewArc(0, isPortrait);
      // Lần đầu tiên mở trang: đặt thẳng vào Góc 1 (false) để không bị chúi xuống sàn
      // Các lần bấm nút "Toàn cảnh" sau đó: bay mượt về Góc 1 (true)
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
      const [cx, cy, cz] = activeGarment.cameraPosition;
      const [tx, ty, tz] = activeGarment.targetPosition;

      const dir = new THREE.Vector3(cx - tx, cy - ty, cz - tz);
      const scaleDist = isPortrait ? 1.25 : 1.0;
      const mobileTargetOffsetY = isPortrait && !inStudio ? -0.26 : 0;

      void controls.setLookAt(
        tx + dir.x * scaleDist,
        ty + dir.y * scaleDist,
        tz + dir.z * scaleDist,
        tx,
        ty + mobileTargetOffsetY,
        tz,
        true,
      );
      targetYawRef.current = 0;
    }
  }, [
    activeId,
    activeGarment,
    inStudio,
    isPortrait,
    targetYawRef,
    overviewYawRef,
  ]);

  // 3. Nội suy mượt khi người dùng vuốt ngang hoặc xoay bục
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
      const obj = gltfScene.getObjectByName(g.meshName);
      if (!obj) return;

      const baseRot = initialRotations.current[g.meshName] ?? 0;
      const desiredRot =
        g.id === activeId && !isStudio360
          ? baseRot + targetYawRef.current
          : baseRot;

      obj.rotation.y = THREE.MathUtils.damp(
        obj.rotation.y,
        desiredRot,
        6.5,
        delta,
      );
    });
  });

  // 4. Click vào Mannequin để bay tới
  const handleSceneClick = (e: ThreeEvent<MouseEvent>) => {
    if (isStudio360 || dragDistanceRef.current > 8) return;
    e.stopPropagation();

    let curr: THREE.Object3D | null = e.object;
    while (curr) {
      if (typeof curr.userData?.garment_id === "string") {
        onSelectGarment(curr.userData.garment_id);
        return;
      }
      const matched = manifest.garments.find((g) => g.meshName === curr?.name);
      if (matched) {
        onSelectGarment(matched.id);
        return;
      }
      curr = curr.parent;
    }
  };

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
        minZoom={0.85}
        maxZoom={2.4}
        minPolarAngle={Math.PI * 0.22}
        maxPolarAngle={Math.PI * 0.52}
      />

      <Environment
        preset={inStudio ? "studio" : "apartment"}
        environmentIntensity={inStudio ? 0.9 : 0.55}
      />
      <ambientLight intensity={inStudio ? 0.5 : 0.35} />

      {activeGarment && (
        <spotLight
          position={[
            activeGarment.targetPosition[0] + 1.2,
            activeGarment.targetPosition[1] + 2.2,
            activeGarment.targetPosition[2] + 1.2,
          ]}
          intensity={inStudio ? 2.5 : 3.2}
          color={inStudio ? "#FFFDF8" : "#FFE0B2"}
          angle={0.6}
          penumbra={0.85}
        />
      )}

      {inStudio && (
        <ContactShadows
          position={[0, 0.01, 0]}
          opacity={0.4}
          scale={8}
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

      {currentGarment && (
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
            <span style={{ opacity: 0.7 }}>
              Điểm dừng {currentGarment.tourOrder}/{sortedGarments.length}
            </span>
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
