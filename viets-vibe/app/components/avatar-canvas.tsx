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
import { Download, RotateCcw, Rotate3D, ZoomIn, ZoomOut } from "lucide-react";
import { buildMannequin, disposeModel } from "../lib/mannequin";
import type { AvatarConfig } from "../lib/avatar";
export type AvatarHandle = { thumbnail: () => string | undefined };
type Props = {
  garment: string;
  color: string;
  extras: string[];
  avatar: AvatarConfig;
  ref?: Ref<AvatarHandle>;
};
export default function AvatarCanvas({
  garment,
  color,
  extras,
  avatar,
  ref,
}: Props) {
  const host = useRef<HTMLDivElement>(null);
  const runtime = useRef<{
    renderer: T.WebGLRenderer;
    scene: T.Scene;
    camera: T.PerspectiveCamera;
    controls: OrbitControls;
    model?: T.Group;
    dirty: boolean;
  } | null>(null);
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const [rotating, setRotating] = useState(false);
  const [view, setView] = useState("front");
  const [notice, setNotice] = useState("");
  useImperativeHandle(ref, () => ({
    thumbnail() {
      const r = runtime.current;
      if (!r || !r.model || r.renderer.getContext().isContextLost())
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
    renderer.toneMappingExposure = 1.35;
    renderer.domElement.setAttribute(
      "aria-label",
      "Ma-nơ-canh 3D — kéo để xoay, cuộn để phóng to",
    );
    renderer.domElement.setAttribute("role", "img");
    element.appendChild(renderer.domElement);
    const scene = new T.Scene();
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
    scene.add(new T.HemisphereLight("#fff9eb", "#8d8a76", 2.4));
    const key = new T.DirectionalLight("#fff2da", 3.2);
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
    };
    runtime.current = r;
    const resize = new ResizeObserver(() => {
      const w = element.clientWidth,
        h = element.clientHeight;
      if (!w || !h) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
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
      image.height = source.height + 94;
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
      );
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
        className="avatar-stage"
        data-ready={ready && !error}
        data-garment={garment}
        data-build={avatar.build}
        data-skin={avatar.skin}
      >
        <div ref={host} className="avatar-renderer" />
        <div className="stage-heading">
          <span>THE FITTING ROOM</span>
          <strong>Chất riêng, mọi góc nhìn.</strong>
        </div>
        <span className="stage-badge">
          LIVE 3D <i />
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
        <button
          className="text-link"
          disabled={!ready || !!error}
          onClick={download}
        >
          <Download size={16} /> Tải ảnh 3D
        </button>
      </div>
      {notice && (
        <p className="export-notice" role="status">
          {notice}
        </p>
      )}
      <p className="reference-note">
        Mô hình minh họa phom và màu. Chưa mô phỏng chất vải, số đo may hoặc
        phục dựng lịch sử.
      </p>
    </div>
  );
}
