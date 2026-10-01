"use client";

import React, { useRef, useState, useEffect, useMemo, Suspense } from "react";
import Link from "next/link";
import { Canvas, useFrame, useThree, ThreeEvent } from "@react-three/fiber";
import { useGLTF, CameraControls, Environment, ContactShadows, Html } from "@react-three/drei";
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

function SceneContent({
  activeId,
  isStudio360,
  studioTheme,
  targetYawRef,
  onSelectGarment,
}: {
  activeId: string;
  isStudio360: boolean;
  studioTheme: "warm" | "dark";
  targetYawRef: React.MutableRefObject<number>;
  onSelectGarment: (id: string) => void;
}) {
  const { scene: gltfScene } = useGLTF("/models/viet_phuc_gallery.glb");
  const { scene: rootScene, size } = useThree();
  const controlsRef = useRef<CameraControls>(null);

  const isPortrait = size.width < size.height;
  const activeGarment = useMemo(
    () => manifest.garments.find((g) => g.id === activeId) || null,
    [activeId]
  );

  const initialRotations = useRef<Record<string, number>>({});
  useEffect(() => {
    manifest.garments.forEach((g) => {
      const obj = gltfScene.getObjectByName(g.meshName);
      if (obj && initialRotations.current[g.meshName] === undefined) {
        initialRotations.current[g.meshName] = obj.rotation.y;
      }
    });
  }, [gltfScene]);

  useEffect(() => {
    const inStudio = isStudio360 && activeGarment !== null;

    if (inStudio) {
      rootScene.background = new THREE.Color(STUDIO_THEMES[studioTheme]);
      rootScene.fog = null;
    } else {
      rootScene.background = new THREE.Color(CORRIDOR_BG);
      rootScene.fog = new THREE.FogExp2(CORRIDOR_BG, 0.045);
    }

    gltfScene.traverse((obj) => {
      if (obj.name.startsWith("ENV_")) {
        obj.visible = !inStudio;
      } else if (obj.name.startsWith("GARMENT_")) {
        obj.visible = inStudio ? obj.name === activeGarment?.meshName : true;
      }
    });
  }, [isStudio360, activeGarment, studioTheme, gltfScene, rootScene]);

  useEffect(() => {
    const controls = controlsRef.current;
    if (!controls) return;

    if (activeId === "overview" || !activeGarment) {
      const [cx, cy, cz] = manifest.overview.cameraPosition;
      const [tx, ty, tz] = manifest.overview.targetPosition;
      const pullbackZ = isPortrait ? 3.2 : 1.5;
      void controls.setLookAt(cx, cy + 0.15, cz + pullbackZ, tx, ty, tz, true);
      targetYawRef.current = 0;
    } else {
      const [cx, cy, cz] = activeGarment.cameraPosition;
      const [tx, ty, tz] = activeGarment.targetPosition;

      const dir = new THREE.Vector3(cx - tx, cy - ty, cz - tz);
      const scaleDist = isPortrait ? 1.32 : 1.0;

      void controls.setLookAt(
        tx + dir.x * scaleDist,
        ty + dir.y * scaleDist,
        tz + dir.z * scaleDist,
        tx,
        ty,
        tz,
        true
      );
      targetYawRef.current = 0;
    }
  }, [activeId, activeGarment, isStudio360, isPortrait, targetYawRef]);

  useFrame((_, delta) => {
    manifest.garments.forEach((g) => {
      const obj = gltfScene.getObjectByName(g.meshName);
      if (!obj) return;

      const baseRot = initialRotations.current[g.meshName] ?? 0;
      const desiredRot =
        g.id === activeId && !isStudio360 ? baseRot + targetYawRef.current : baseRot;

      obj.rotation.y = THREE.MathUtils.damp(obj.rotation.y, desiredRot, 6.5, delta);
    });
  });

  const handleSceneClick = (e: ThreeEvent<MouseEvent>) => {
    if (isStudio360) return;
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

  const inStudio = isStudio360 && activeGarment !== null;

  return (
    <>
      <CameraControls
        ref={controlsRef}
        smoothTime={0.65}
        mouseButtons={{
          left: inStudio ? 1 : 0,
          middle: 8,
          right: 0,
          wheel: 8,
        }}
        touches={{
          one: inStudio ? 32 : 0,
          two: 64,
          three: 0,
        }}
        minPolarAngle={Math.PI * 0.18}
        maxPolarAngle={Math.PI * 0.56}
        minDistance={inStudio ? 1.15 : 1.6}
        maxDistance={activeId === "overview" ? 16 : 4.2}
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
        <ContactShadows position={[0, 0.01, 0]} opacity={0.4} scale={8} blur={2.2} frames={1} />
      )}

      <primitive object={gltfScene} onClick={handleSceneClick} />
    </>
  );
}

export default function VietPhucGallery({ embedded = false }: { embedded?: boolean }) {
  const [activeId, setActiveId] = useState<string>("overview");
  const [isStudio360, setIsStudio360] = useState<boolean>(false);
  const [studioTheme, setStudioTheme] = useState<"warm" | "dark">("warm");
  const [viewingSide, setViewingSide] = useState<"front" | "back">("front");

  const targetYawRef = useRef<number>(0);
  const isDraggingRef = useRef<boolean>(false);
  const prevXRef = useRef<number>(0);

  const sortedGarments = useMemo(
    () => [...manifest.garments].sort((a, b) => a.tourOrder - b.tourOrder),
    []
  );
  const currentIndex = sortedGarments.findIndex((g) => g.id === activeId);
  const currentGarment = currentIndex >= 0 ? sortedGarments[currentIndex] : null;

  const selectGarment = (id: string) => {
    setActiveId(id);
    setViewingSide("front");
    if (id === "overview") setIsStudio360(false);
  };

  const handlePointerDown = (e: React.PointerEvent) => {
    if (activeId === "overview" || isStudio360) return;
    isDraggingRef.current = true;
    prevXRef.current = e.clientX;
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDraggingRef.current || activeId === "overview" || isStudio360) return;
    const deltaX = e.clientX - prevXRef.current;
    prevXRef.current = e.clientX;
    targetYawRef.current += deltaX * 0.012;

    const norm = Math.abs(targetYawRef.current % (Math.PI * 2));
    setViewingSide(norm > Math.PI * 0.5 && norm < Math.PI * 1.5 ? "back" : "front");
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
    const nextIdx = (currentIndex + dir + sortedGarments.length) % sortedGarments.length;
    selectGarment(sortedGarments[nextIdx].id);
  };

  return (
    <div
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      style={{
        position: "relative",
        width: "100%",
        height: embedded ? "640px" : "100vh",
        background: "#1A120E",
        overflow: "hidden",
        userSelect: "none",
        touchAction: "none",
      }}
    >
      <Canvas camera={{ fov: 48, position: [0, 2.2, 7.3] }} dpr={[1, 1.5]}>
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
            onSelectGarment={selectGarment}
          />
        </Suspense>
      </Canvas>

      {/* Nút quay về trang chủ khi đang ở chế độ Fullscreen (/viet-phuc) */}
      {!embedded && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{ position: "absolute", top: "20px", left: "20px", zIndex: 10 }}
        >
          <Link
            href="/"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "10px 18px",
              borderRadius: "999px",
              background: "rgba(26, 18, 14, 0.85)",
              backdropFilter: "blur(8px)",
              color: "#F5EFE6",
              textDecoration: "none",
              fontSize: "13px",
              fontWeight: 600,
              border: "1px solid rgba(213, 203, 183, 0.3)",
            }}
          >
            ← Về trang chủ
          </Link>
        </div>
      )}

      {/* Bảng thông tin chi tiết bên góc phải */}
      {currentGarment && (
        <div
          onPointerDown={(e) => e.stopPropagation()}
          style={{
            position: "absolute",
            top: "20px",
            right: "20px",
            width: "min(360px, calc(100vw - 40px))",
            background: "rgba(26, 18, 14, 0.9)",
            backdropFilter: "blur(12px)",
            padding: "20px",
            borderRadius: "20px",
            border: "1px solid rgba(224, 159, 62, 0.35)",
            color: "#F5EFE6",
            zIndex: 10,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", fontSize: "11px" }}>
            <span style={{ color: "#E09F3E", fontWeight: 700, textTransform: "uppercase" }}>
              {currentGarment.era}
            </span>
            <span style={{ opacity: 0.7 }}>
              Điểm dừng {currentGarment.tourOrder}/{sortedGarments.length}
            </span>
          </div>

          <h3 style={{ margin: "6px 0 12px", fontSize: "20px", fontWeight: 700 }}>
            {currentGarment.title}
          </h3>

          <div
            style={{
              padding: "12px",
              borderRadius: "12px",
              background: "rgba(255, 255, 255, 0.06)",
              fontSize: "13px",
              lineHeight: 1.5,
            }}
          >
            <strong style={{ color: "#F4A261", display: "block", marginBottom: "4px" }}>
              {viewingSide === "front" ? "Đặc trưng Mặt trước:" : "Đặc trưng Mặt sau:"}
            </strong>
            {viewingSide === "front"
              ? currentGarment.highlightFront
              : currentGarment.highlightBack}
          </div>

          {!isStudio360 ? (
            <div style={{ marginTop: "12px" }}>
              <div style={{ fontSize: "11px", opacity: 0.75, marginBottom: "6px" }}>
                Kéo ngang màn hình để xoay bục hoặc chọn góc nhanh:
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  type="button"
                  onClick={() => rotateToSide("front")}
                  style={{
                    flex: 1,
                    padding: "8px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: viewingSide === "front" ? "#AE443A" : "rgba(255,255,255,0.1)",
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
                    padding: "8px",
                    borderRadius: "8px",
                    border: "none",
                    cursor: "pointer",
                    fontSize: "12px",
                    fontWeight: 600,
                    background: viewingSide === "back" ? "#AE443A" : "rgba(255,255,255,0.1)",
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
                marginTop: "12px",
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
                    background: studioTheme === "warm" ? "#EAE4DC" : "rgba(255,255,255,0.15)",
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
                    background: studioTheme === "dark" ? "#E09F3E" : "rgba(255,255,255,0.15)",
                    color: "#FFF",
                  }}
                >
                  Tối trầm
                </button>
              </div>
            </div>
          )}

          <div style={{ marginTop: "14px", display: "flex", gap: "8px" }}>
            <button
              type="button"
              onClick={() => setIsStudio360((prev) => !prev)}
              style={{
                flex: 1,
                padding: "10px",
                borderRadius: "10px",
                border: "none",
                cursor: "pointer",
                fontSize: "12px",
                fontWeight: 700,
                background: "#E09F3E",
                color: "#1A120E",
              }}
            >
              {isStudio360 ? "← Trở lại Hành lang" : "Soi chi tiết 360° (Cô lập)"}
            </button>
            <button
              type="button"
              onClick={() => goStep(-1)}
              style={{
                padding: "10px 14px",
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
                padding: "10px 14px",
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

      {/* Thanh chọn nhanh 5 bộ trang phục ở dưới đáy */}
      <div
        onPointerDown={(e) => e.stopPropagation()}
        style={{
          position: "absolute",
          bottom: "20px",
          left: "50%",
          transform: "translateX(-50%)",
          maxWidth: "94vw",
          overflowX: "auto",
          display: "flex",
          gap: "6px",
          padding: "6px",
          borderRadius: "999px",
          background: "rgba(26, 18, 14, 0.88)",
          backdropFilter: "blur(10px)",
          border: "1px solid rgba(224, 159, 62, 0.35)",
          zIndex: 10,
        }}
      >
        <button
          type="button"
          onClick={() => selectGarment("overview")}
          style={{
            padding: "8px 14px",
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
              padding: "8px 14px",
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
            {g.tourOrder}. {g.title.replace(" Truyền Thống", "").replace(" Cung Đình", "")}
          </button>
        ))}
      </div>
    </div>
  );
}

useGLTF.preload("/models/viet_phuc_gallery.glb");