"use client";
import {
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { Download, Layers3 } from "lucide-react";
import {
  characterSelection,
  type CharacterProps,
} from "../lib/character-registry";
import { characterSvg } from "../lib/character-art";
import { findBackdrop } from "../lib/backdrops";
import { useLanguage } from "./site";

async function readArt(url: string, signal: AbortSignal): Promise<string> {
  // Local raster art only: no cross-origin canvas taint or executable SVG uploads.
  if (!/^\/(avatar|images)\/[\w/.-]+\.(png|webp|jpe?g)$/i.test(url))
    throw new Error("Unsupported art path");
  const response = await fetch(url, { signal });
  if (!response.ok) throw new Error("Art unavailable");
  const blob = await response.blob();
  if (
    !/^image\/(png|jpeg|webp)$/.test(blob.type) ||
    blob.size > 12 * 1024 * 1024
  )
    throw new Error("Invalid art");
  const data = await new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
  await new Promise<void>((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve();
    image.onerror = reject;
    image.src = data;
  });
  return data;
}

export default function Character2D({ ref, ...props }: CharacterProps) {
  const { language } = useLanguage();
  const en = language === "en";
  const selection = characterSelection(props);
  const location = findBackdrop(props.backdrop);
  const urls = [
    ...new Set(
      [
        selection.base.src,
        selection.art.src,
        ...selection.accessories.map(([, a]) => a.art.src),
        location.image,
      ].filter((v): v is string => !!v),
    ),
  ];
  const artKey = JSON.stringify(urls);
  const [loaded, setLoaded] = useState<{
    key: string;
    data: Record<string, string>;
    failed: string[];
  }>({ key: "", data: {}, failed: [] });
  const [snapshotKey, setSnapshotKey] = useState("");
  const [notice, setNotice] = useState("");
  const snapshot = useRef<HTMLCanvasElement | null>(null);
  useEffect(() => {
    const controller = new AbortController();
    const paths: string[] = JSON.parse(artKey);
    Promise.all(
      paths.map(async (url) => {
        try {
          return [url, await readArt(url, controller.signal)] as const;
        } catch {
          return [url, ""] as const;
        }
      }),
    ).then((entries) => {
      if (!controller.signal.aborted)
        setLoaded({
          key: artKey,
          data: Object.fromEntries(entries.filter(([, value]) => value)),
          failed: entries.filter(([, value]) => !value).map(([url]) => url),
        });
    });
    return () => controller.abort();
  }, [artKey]);
  const assets = useMemo(
    () => (loaded.key === artKey ? loaded.data : {}),
    [loaded, artKey],
  );
  const background = assets[location.image];
  const markup = useMemo(
    () => characterSvg(props, assets, background),
    [props, assets, background],
  );
  const ready = loaded.key === artKey && snapshotKey === markup;
  const backgroundFailed =
    loaded.key === artKey && !!location.image && !background;
  const canExport = ready && !backgroundFailed;
  useEffect(() => {
    let disposed = false;
    const image = new Image();
    const url = URL.createObjectURL(
      new Blob([markup], { type: "image/svg+xml;charset=utf-8" }),
    );
    image.onload = () => {
      if (disposed) return;
      const canvas = document.createElement("canvas");
      canvas.width = 1200;
      canvas.height = 1800;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
      // The same self-contained composition powers the preview, PNG and lookbook.
      snapshot.current = canvas;
      setSnapshotKey(markup);
    };
    image.onerror = () => {
      if (!disposed)
        setNotice(
          en
            ? "Image export is unavailable. Your outfit can still be saved."
            : "Chưa xuất được ảnh. Bạn vẫn có thể lưu cấu hình bản phối.",
        );
    };
    image.src = url;
    return () => {
      disposed = true;
      URL.revokeObjectURL(url);
    };
  }, [markup, en]);
  useImperativeHandle(ref, () => ({
    thumbnail() {
      if (!canExport || !snapshot.current) return undefined;
      const small = document.createElement("canvas");
      small.width = 300;
      small.height = 450;
      const ctx = small.getContext("2d");
      if (!ctx) return undefined;
      ctx.drawImage(snapshot.current, 0, 0, 300, 450);
      return small.toDataURL("image/jpeg", 0.85);
    },
  }));
  function download() {
    if (!canExport || !snapshot.current) return;
    const canvas = document.createElement("canvas");
    canvas.width = 1200;
    canvas.height = 1860;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;
    ctx.fillStyle = "#f1f0e6";
    ctx.fillRect(0, 0, 1200, 1860);
    ctx.drawImage(snapshot.current, 0, 0);
    ctx.fillStyle = "#455545";
    ctx.font = "18px sans-serif";
    ctx.textAlign = "center";
    ctx.fillText(
      en
        ? "VIETS VIBE · 2D fashion illustration · Concept, not historical reconstruction"
        : "VIETS VIBE · Minh họa phối đồ 2D · Không phải phục dựng lịch sử",
      600,
      1837,
    );
    const link = document.createElement("a");
    link.download = `viets-vibe-${selection.id}-2d.png`;
    link.href = canvas.toDataURL("image/png");
    link.click();
    setNotice(
      en ? "Your 2D look has been downloaded." : "Đã tải ảnh bản phối 2D.",
    );
  }
  return (
    <div className="character-2d" data-no-translate="" data-mode="2d">
      <div
        className="character-art-stage"
        data-ready={ready}
        data-garment={selection.id}
        data-presentation={props.avatar.presentation}
        data-color={props.color}
        data-extras={props.extras.join(",")}
        data-backdrop={location.id}
        data-background-ready={!location.image || !!background}
      >
        <div className="character-art-caption">
          <span>THE HERITAGE ATELIER</span>
          <h2>
            {en ? "A silhouette of your own." : "Một dáng hình. Chất riêng."}
          </h2>
          <p>
            {en ? "Wear a story, beautifully." : "Khoác một câu chuyện đẹp."}
          </p>
        </div>
        <span className="character-edition">01 / PORTRAIT</span>
        <div
          className="character-illustration"
          key={`${selection.id}-${selection.presentation}`}
          role="img"
          aria-label={
            en
              ? "Layered 2D outfit illustration"
              : "Minh họa bản phối 2D nhiều lớp"
          }
          dangerouslySetInnerHTML={{ __html: markup }}
        />
        <div className="character-art-footer">
          <span>
            <Layers3 size={13} />
            {en ? "LIVE COMPOSITION" : "BẢN PHỐI TRỰC TIẾP"}
          </span>
          <span>{en ? "2D illustration" : "Minh họa 2D"}</span>
        </div>
      </div>
      <div className="character-export">
        <p>
          {en ? "One look. Every detail, yours." : "Từng chi tiết, theo ý bạn."}
        </p>
        <button className="text-link" onClick={download} disabled={!canExport}>
          <Download size={16} />
          {en ? "Download 2D image" : "Tải ảnh 2D"}
        </button>
      </div>
      <p className="reference-note">
        {en
          ? "Illustrated layers preview colors and silhouettes. Height and fit are indicative; use 3D to explore angles."
          : "Các lớp minh họa thể hiện màu và phom. Chiều cao, độ vừa chỉ mang tính gợi ý; chuyển 3D để xem các góc."}
      </p>
      {loaded.failed.length > 0 && (
        <p role="status" className="export-notice">
          {backgroundFailed
            ? en
              ? "Backdrop unavailable. Choose Studio to export with a neutral background."
              : "Chưa tải được phông. Chọn Phòng thử để xuất ảnh nền trung tính."
            : en
              ? "Some artwork is unavailable; built-in illustrations are being used."
              : "Một số artwork chưa tải được; đang dùng lớp minh họa có sẵn."}
        </p>
      )}
      {notice && (
        <p role="status" className="export-notice">
          {notice}
        </p>
      )}
    </div>
  );
}
