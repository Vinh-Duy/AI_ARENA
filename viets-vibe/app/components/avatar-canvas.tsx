"use client";
import {
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
  type Ref,
} from "react";
import * as T from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";
import { RoomEnvironment } from "three/addons/environments/RoomEnvironment.js";
import { Download, RotateCcw, Rotate3D, ZoomIn, ZoomOut } from "lucide-react";
import { buildMannequin, disposeModel } from "../lib/mannequin";
import type { AvatarConfig } from "../lib/avatar";
import { findBackdrop } from "../lib/backdrops";

function fitBackground(texture: T.Texture, aspect: number) {
  const image = texture.image as HTMLImageElement;
  const imageAspect = image.width / image.height;
  texture.repeat.set(
    Math.min(1, aspect / imageAspect),
    Math.min(1, imageAspect / aspect),
  );
  texture.offset.set((1 - texture.repeat.x) / 2, (1 - texture.repeat.y) / 2);
}
export type AvatarHandle = { thumbnail: () => string | undefined };
type Props = {
  garment: string;
  color: string;
  extras: string[];
  avatar: AvatarConfig;
  ref?: Ref<AvatarHandle>;
  backdrop?: string;
};
export default function AvatarCanvas({
  garment,
  color,
  extras,
  avatar,
  ref,
  backdrop = "studio",
}: Props) {
  const location = findBackdrop(backdrop);
  const host = useRef<HTMLDivElement>(null);
  const runtime = useRef<{
    renderer: T.WebGLRenderer;
    scene: T.Scene;
    camera: T.PerspectiveCamera;
    controls: OrbitControls;
    model?: T.Group;
    dirty: boolean;
    floor: T.Mesh;
    plinth: T.Mesh;
    backgroundId: string;
  } | null>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [view, setView] = useState("front");
  const [notice, setNotice] = useState("");
  const [loadedBackdrop, setLoadedBackdrop] = useState("studio");
  const [backgroundError, setBackgroundError] = useState("");
  const canExport = ready && !error && loadedBackdrop === location.id;
  useImperativeHandle(ref, () => ({
    thumbnail() {
      const r = runtime.current;
      if (
        !r ||
        !r.model ||
        r.backgroundId !== location.id ||
        r.renderer.getContext().isContextLost()
      )
        return undefined;
      r.renderer.render(r.scene, r.camera);
      const image = document.createElement("canvas");
      image.width = 300;
      image.height = 360;
      const ctx = image.getContext("2d");
      if (!ctx) return undefined;
      ctx.fillStyle = "#eae6dc";
      ctx.fillRect(0, 0, 300, 360);
      const source = r.renderer.domElement;
      const scale = Math.min(300 / source.width, 360 / source.height);
      ctx.drawImage(
        source,
        (300 - source.width * scale) / 2,
        (360 - source.height * scale) / 2,
        source.width * scale,
        source.height * scale,
      );
      return image.toDataURL("image/jpeg", 0.82);
    },
  }));
  useEffect(() => {
    const element = host.current;
    if (!element) return;
    let renderer: T.WebGLRenderer;
    try {
      renderer = new T.WebGLRenderer({
        antialias: true,
        alpha: false,
        preserveDrawingBuffer: true,
      });
    } catch {
      queueMicrotask(() =>
        setError(
          "Thiết bị chưa mở được 3D. Hãy bật tăng tốc đồ họa hoặc thử trình duyệt khác. Bạn vẫn có thể chọn đồ, xem tư liệu và lưu cấu hình.",
        ),
      );
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.75));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = T.PCFSoftShadowMap;
    renderer.toneMapping = T.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.05;
    renderer.domElement.setAttribute(
      "aria-label",
      "Ma-nơ-canh 3D — kéo để xoay, cuộn để phóng to",
    );
    renderer.domElement.setAttribute("role", "img");
    element.appendChild(renderer.domElement);
    const scene = new T.Scene();
    const room = new RoomEnvironment();
    const pmrem = new T.PMREMGenerator(renderer);
    const environment = pmrem.fromScene(room, 0.04);
    scene.environment = environment.texture;
    scene.environmentIntensity = 0.55;
    room.dispose();
    pmrem.dispose();
    scene.background = new T.Color("#eae6dc");
    scene.fog = new T.Fog("#eae6dc", 7, 18);
    const camera = new T.PerspectiveCamera(34, 1, 0.1, 30);
    camera.position.set(0, 1.65, 5.9);
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.target.set(0, 1.37, 0);
    controls.enablePan = false;
    controls.enableDamping = true;
    controls.minDistance = 3.6;
    controls.maxDistance = 8;
    controls.minPolarAngle = 0.5;
    controls.maxPolarAngle = 1.8;
    controls.autoRotateSpeed = 1.4;
    scene.add(new T.HemisphereLight("#fffaf2", "#838a7f", 1.65));
    const key = new T.DirectionalLight("#fff7ed", 2.5);
    key.position.set(3, 5, 4);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.left = -3;
    key.shadow.camera.right = 3;
    key.shadow.camera.top = 4;
    key.shadow.camera.bottom = -3;
    key.shadow.normalBias = 0.025;
    scene.add(key);
    const rim = new T.DirectionalLight("#dceaf1", 2);
    rim.position.set(-3, 3, -2);
    scene.add(rim);
    const plinth = new T.Mesh(
      new T.CylinderGeometry(0.87, 0.9, 0.08, 96),
      new T.MeshStandardMaterial({ color: "#d4cebc", roughness: 0.8 }),
    );
    plinth.position.y = 0.01;
    plinth.receiveShadow = true;
    scene.add(plinth);
    const floor = new T.Mesh(
      new T.PlaneGeometry(200, 200),
      new T.MeshStandardMaterial({ color: "#eae6dc", roughness: 1 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.035;
    floor.receiveShadow = true;
    scene.add(floor);
    const r = {
      renderer,
      scene,
      camera,
      controls,
      dirty: true,
      model: undefined as T.Group | undefined,
      floor,
      plinth,
      backgroundId: "studio",
    };
    runtime.current = r;
    const resize = new ResizeObserver(() => {
      const w = element.clientWidth,
        h = element.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
      if (scene.background instanceof T.Texture)
        fitBackground(scene.background, camera.aspect);
      r.dirty = true;
    });
    resize.observe(element);
    const lost = (e: Event) => {
      e.preventDefault();
      setReady(false);
      setError(
        "Phiên 3D bị gián đoạn. Tải lại trang để mở lại; các lựa chọn vẫn có thể lưu vào lookbook.",
      );
    };
    renderer.domElement.addEventListener("webglcontextlost", lost);
    const started = () => setView("custom");
    controls.addEventListener("start", started);
    let frame = 0;
    function tick() {
      frame = requestAnimationFrame(tick);
      const moved = controls.update();
      if (r.dirty || moved) {
        renderer.render(scene, camera);
        r.dirty = false;
      }
    }
    tick();
    queueMicrotask(() => setReady(true));
    return () => {
      cancelAnimationFrame(frame);
      resize.disconnect();
      controls.removeEventListener("start", started);
      controls.dispose();
      renderer.domElement.removeEventListener("webglcontextlost", lost);
      disposeModel(scene);
      environment.dispose();
      key.shadow.dispose();
      renderer.dispose();
      renderer.forceContextLoss();
      renderer.domElement.remove();
      runtime.current = null;
    };
  }, []);
  useEffect(() => {
    const r = runtime.current;
    if (!r) return;
    if (r.model) {
      r.scene.remove(r.model);
      disposeModel(r.model);
    }
    r.model = buildMannequin(garment, color, extras, avatar);
    r.scene.add(r.model);
    r.dirty = true;
  }, [garment, color, extras, avatar]);
  useEffect(() => {
    const r = runtime.current;
    if (!r) return;
    const offset = r.camera.position.clone().sub(r.controls.target);
    r.controls.target.y = 1.37 + ((avatar.height - 165) / 165) * 1.1;
    const comfortableDistance = 5.9 * Math.max(1, avatar.height / 165);
    if (offset.length() < comfortableDistance)
      offset.setLength(comfortableDistance);
    r.camera.position.copy(r.controls.target).add(offset);
    r.controls.update();
    r.dirty = true;
  }, [avatar.height]);
  useEffect(() => {
    const r = runtime.current;
    if (!r) return;
    let cancelled = false;
    let texture: T.Texture | undefined;
    r.backgroundId = "studio";
    r.scene.background = new T.Color("#eae6dc");
    r.floor.visible = true;
    r.plinth.visible = true;
    r.dirty = true;
    queueMicrotask(() => {
      if (!cancelled) {
        setBackgroundError("");
        setLoadedBackdrop("studio");
      }
    });
    if (location.image) {
      new T.TextureLoader().load(
        location.image,
        (loaded) => {
          if (cancelled) {
            loaded.dispose();
            return;
          }
          texture = loaded;
          loaded.colorSpace = T.SRGBColorSpace;
          fitBackground(loaded, r.camera.aspect);
          r.scene.background = loaded;
          r.floor.visible = false;
          r.plinth.visible = false;
          r.backgroundId = location.id;
          r.dirty = true;
          setLoadedBackdrop(location.id);
        },
        undefined,
        () => {
          if (!cancelled)
            setBackgroundError(
              "Chưa tải được phông ảnh. Chọn lại địa danh hoặc dùng nền Phòng thử để xuất ảnh.",
            );
        },
      );
    }
    return () => {
      cancelled = true;
      if (texture) {
        if (r.scene.background === texture)
          r.scene.background = new T.Color("#eae6dc");
        texture.dispose();
      }
    };
  }, [location]);
  function angle(next: string) {
    const r = runtime.current;
    if (!r) return;
    r.controls.autoRotate = false;
    setRotating(false);
    setView(next);
    const theta = next === "back" ? Math.PI : next === "side" ? Math.PI / 2 : 0;
    r.camera.position.set(Math.sin(theta) * 5.9, 1.65, Math.cos(theta) * 5.9);
    r.controls.target.set(0, 1.37, 0);
    r.controls.update();
    r.dirty = true;
  }
  function zoom(amount: number) {
    const r = runtime.current;
    if (!r) return;
    const offset = r.camera.position.clone().sub(r.controls.target);
    const d = T.MathUtils.clamp(offset.length() * amount, 3.6, 8);
    r.camera.position.copy(r.controls.target).add(offset.setLength(d));
    r.controls.update();
    r.dirty = true;
  }
  function download() {
    const r = runtime.current;
    if (!r) return;
    try {
      r.renderer.render(r.scene, r.camera);
      const source = r.renderer.domElement,
        image = document.createElement("canvas");
      image.width = source.width;
      image.height = source.height + (location.image ? 145 : 94);
      const ctx = image.getContext("2d");
      if (!ctx) throw new Error();
      ctx.fillStyle = "#f8f6f0";
      ctx.fillRect(0, 0, image.width, image.height);
      ctx.drawImage(source, 0, 0);
      ctx.fillStyle = "#34392f";
      ctx.font = "20px sans-serif";
      ctx.fillText("VIỆT’S VIBE · STUDIO 3D", 24, source.height + 36);
      ctx.font = "14px sans-serif";
      ctx.fillText(
        "Phác thảo phom & màu · không phải phục dựng hay đo độ vừa vặn",
        24,
        source.height + 66,
        image.width - 48,
      );
      if (location.image) {
        ctx.font = "12px sans-serif";
        const credit = `${location.name} · Phông minh họa tạo bằng AI, mang phong cách 3D. Kiến trúc cách điệu, không phải ảnh thực địa hay phục dựng lịch sử.`;
        let line = "",
          y = source.height + 92;
        for (const char of credit) {
          if (ctx.measureText(line + char).width > image.width - 48) {
            ctx.fillText(line, 24, y);
            line = "";
            y += 17;
          }
          line += char;
        }
        ctx.fillText(line, 24, y);
      }
      const link = document.createElement("a");
      link.download = `viets-vibe-${garment}-3d.png`;
      link.href = image.toDataURL("image/png");
      link.click();
      setNotice("Đã xuất ảnh góc nhìn hiện tại.");
    } catch {
      setNotice("Chưa xuất được ảnh. Hãy thử tải lại phiên 3D.");
    }
  }
  return (
    <div className="avatar-workspace">
      <div
        className={`avatar-stage${location.image ? " on-location" : ""}`}
        data-ready={ready && !error}
        data-garment={garment}
        data-build={avatar.build}
        data-skin={avatar.skin}
        data-presentation={avatar.presentation}
        data-height={avatar.height}
        data-fabric={avatar.fabric || "silk"}
        data-backdrop={location.id}
        data-background-ready={loadedBackdrop === location.id}
      >
        <div ref={host} className="avatar-renderer" />
        <div className="stage-heading">
          <span>
            {location.image
              ? `HÀ NỘI / ${location.name.toUpperCase()}`
              : "THE FITTING ROOM"}
          </span>
          <strong>Chất riêng, mọi góc nhìn.</strong>
        </div>
        <span className="stage-badge">
          {location.image ? "3D / HÀ NỘI CÁCH ĐIỆU" : "LIVE 3D"} <i />
        </span>
        <span className="stage-watermark" aria-hidden="true">
          v.
        </span>
        {error ? (
          <div className="canvas-fallback">
            <p>{error}</p>
          </div>
        ) : !ready ? (
          <div className="canvas-fallback">Đang mở phòng thử 3D…</div>
        ) : null}
        <div className="stage-zoom">
          <button
            disabled={!ready || !!error}
            aria-label="Phóng to mô hình"
            onClick={() => zoom(0.88)}
          >
            <ZoomIn size={18} />
          </button>
          <button
            disabled={!ready || !!error}
            aria-label="Thu nhỏ mô hình"
            onClick={() => zoom(1.12)}
          >
            <ZoomOut size={18} />
          </button>
          <button
            disabled={!ready || !!error}
            aria-label="Đặt lại góc nhìn"
            onClick={() => angle("front")}
          >
            <RotateCcw size={17} />
          </button>
        </div>
        <span className="stage-hint">
          Kéo để xoay 360° · Cuộn / chụm để zoom
        </span>
      </div>
      {backgroundError && (
        <p className="export-notice" role="status">
          {backgroundError}
        </p>
      )}
      {location.image && loadedBackdrop !== location.id && !backgroundError && (
        <p className="export-notice">Đang tải phông {location.name}…</p>
      )}
      <div className="canvas-toolbar">
        <div className="view-options" aria-label="Góc nhìn">
          {[
            ["front", "Trước"],
            ["side", "Bên"],
            ["back", "Sau"],
          ].map(([key, label]) => (
            <button
              key={key}
              disabled={!ready || !!error}
              aria-pressed={view === key}
              onClick={() => angle(key)}
            >
              {label}
            </button>
          ))}
          <button
            disabled={!ready || !!error}
            aria-pressed={rotating}
            onClick={() => {
              const r = runtime.current;
              if (r) {
                r.controls.autoRotate = !rotating;
                setRotating(!rotating);
                setView("custom");
              }
            }}
          >
            <Rotate3D size={15} /> Tự xoay
          </button>
        </div>
        <button className="text-link" disabled={!canExport} onClick={download}>
          <Download size={16} /> Tải ảnh 3D
        </button>
      </div>
      {notice && (
        <p className="export-notice" role="status">
          {notice}
        </p>
      )}
      <p className="reference-note">
        Mô hình minh họa phom, màu và bề mặt vải. Chưa mô phỏng chuyển động vải,
        độ vừa theo số đo hoặc phục dựng lịch sử.
        {location.image && (
          <>
            {" "}
            Phông minh họa AI dạng 2D, phong cách 3D; ma-nơ-canh xoay độc lập.{" "}
            <a href={location.source}>Về bối cảnh minh họa</a>.
          </>
        )}
      </p>
    </div>
  );
}
