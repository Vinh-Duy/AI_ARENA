"use client";
import { Suspense, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import dynamic from "next/dynamic";
import { AvatarControls } from "../components/avatar-controls";
import type { AvatarHandle } from "../components/avatar-canvas";
import {
  avatarFromQuery,
  defaultAvatar,
  culturalChecks,
  paletteHarmony,
} from "../lib/avatar";
const AvatarCanvas = dynamic(() => import("../components/avatar-canvas"), {
  ssr: false,
  loading: () => <div className="avatar-loading">Đang tải phòng thử 3D…</div>,
});
import Image from "next/image";
import {
  ArrowUpRight,
  Bookmark,
  Check,
  ChevronDown,
  ImagePlus,
  LoaderCircle,
  Plus,
  RotateCcw,
  Share2,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";
import { Header, Footer, Reveal } from "../components/site";
import {
  accessories,
  colors,
  garments,
  occasions,
  vibes,
  type StyleSuggestion,
  type SavedLook,
} from "../lib/heritage";
import { readLooks, writeLooks } from "../lib/lookbook";
import { backdrops, findBackdrop } from "../lib/backdrops";
import { validSuggestion, type OutfitRecommendation } from "../lib/stylist";
import { BrandMark } from "../components/brand-mark";

function Studio() {
  const params = useSearchParams();
  const [backdropId, setBackdropId] = useState(
    () => findBackdrop(params.get("backdrop")).id,
  );
  const backdrop = findBackdrop(backdropId);
  const [goal, setGoal] = useState("");
  const [applied, setApplied] = useState(false);
  const [previousOutfit, setPreviousOutfit] =
    useState<OutfitRecommendation | null>(null);
  const [avatar, setAvatar] = useState(() =>
    avatarFromQuery(params.get("avatar")),
  );
  const avatarRef = useRef<AvatarHandle>(null);
  const [controlTab, setControlTab] = useState("outfit");
  const [garmentId, setGarmentId] = useState(
    () => garments.find((g) => g.id === params.get("garment"))?.id || "ao-dai",
  );
  const [colorName, setColorName] = useState(
    () =>
      colors.find((c) => c.name === params.get("color"))?.name || "Ngọc bích",
  );
  const [occasion, setOccasion] = useState(
    () => occasions.find((o) => o === params.get("occasion")) || "Dạo phố",
  );
  const [vibe, setVibe] = useState(
    () => vibes.find((v) => v === params.get("vibe")) || "Thanh lịch",
  );
  const [extras, setExtras] = useState<string[]>(() =>
    params.has("extras")
      ? accessories.filter((a) => params.get("extras")?.split(",").includes(a))
      : ["Quạt giấy"],
  );
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState("");
  const [result, setResult] = useState<StyleSuggestion | null>(null);
  const [busy, setBusy] = useState(false);
  const [resultSource, setResultSource] = useState("BẢN PHỐI GỢI Ý");
  const [message, setMessage] = useState("");
  const [saved, setSaved] = useState(false);
  const fileInput = useRef<HTMLInputElement>(null);
  const garment = garments.find((g) => g.id === garmentId)!;
  const color = colors.find((c) => c.name === colorName)!;
  const warnings = culturalChecks(garmentId, occasion, avatar);
  const harmony = paletteHarmony([
    color.hex,
    avatar.inner,
    avatar.bottom,
    avatar.accent,
  ]);
  useEffect(
    () => () => {
      if (preview) URL.revokeObjectURL(preview);
    },
    [preview],
  );
  function changed() {
    setResult(null);
    setSaved(false);
    setMessage("");
    setApplied(false);
    setPreviousOutfit(null);
  }
  function upload(f?: File) {
    if (!f) return;
    if (!["image/jpeg", "image/png", "image/webp"].includes(f.type)) {
      setMessage("Chọn ảnh JPG, PNG hoặc WebP nhé.");
      return;
    }
    if (f.size > 5 * 1024 * 1024) {
      setMessage("Ảnh cần nhỏ hơn 5 MB.");
      return;
    }
    setPreview(URL.createObjectURL(f));
    setFile(f);
    changed();
  }
  function compose() {
    const vibeTip: Record<string, string> = {
      "Thanh lịch":
        "Chọn giày bệt hoặc loafer trơn, ưu tiên đường nét gọn và phụ kiện nhỏ.",
      "Tối giản":
        "Giữ tổng thể ở hai đến ba màu, chọn quần trơn và hạn chế họa tiết bổ sung.",
      "Nàng thơ":
        "Dùng sắc ngà ở lớp trang phục đi kèm và chọn chi tiết mềm mại để tạo cảm giác nhẹ nhàng.",
      "Cá tính":
        "Thử giày sneaker tối giản trong bối cảnh đời thường; giữ phom áo làm điểm nhấn chính.",
    };
    const eventTip: Record<string, string> = {
      "Dạo phố":
        "Ưu tiên vải nhẹ, giày dễ đi và kiểm tra độ dài tà áo khi di chuyển.",
      "Chụp kỷ yếu":
        "Chọn phụ kiện nhỏ, thống nhất tông màu với nhóm và thử dáng áo trước buổi chụp.",
      "Lễ hội":
        "Chọn giày thoải mái, phụ kiện gọn và tìm hiểu quy định trang phục tại nơi tổ chức.",
      Tết: "Phối một điểm nhấn ấm như đỏ son hoặc vàng nhạt; chọn phom thoải mái cho những buổi thăm hỏi.",
      "Dự lễ trang trọng":
        "Ưu tiên phần thân dưới kín đáo, giày gọn và cách mặc chỉnh tề; hỏi đơn vị tổ chức về quy cách lễ phục.",
    };
    setResult({
      tên_trang_phục: `${garment.name} · ${vibe.toLowerCase()}`,
      nguồn_gốc: garment.story,
      gợi_ý_phối: [
        `Lấy ${colorName.toLowerCase()} làm màu chủ đạo; dùng bảng màu từng lớp bạn đã chọn để cân bằng tổng thể.`,
        `${garment.stylingTip} Bản hiện tại dùng ${avatar.bottomType === "skirt" ? "váy dài" : "quần dài"} và ${avatar.footwear === "sneakers" ? "sneaker" : "giày bệt"}. ${vibeTip[vibe]}`,
        extras.length
          ? `Điểm xuyết ${extras.join(", ").toLowerCase()}; chọn một món làm điểm nhấn để tổng thể không quá nhiều chi tiết.`
          : "Giữ bản phối tinh giản, để chất liệu và phom áo tự tạo điểm nhấn.",
        eventTip[occasion],
      ],
      cảnh_báo_văn_hóa: [garment.note, ...warnings.map((w) => w.text)].join(
        " ",
      ),
    });
    setResultSource("BẢN PHỐI THEO LỰA CHỌN");
    setMessage("");
    setSaved(false);
  }
  async function askGemini() {
    setBusy(true);
    setMessage("");
    try {
      let imageBase64: string | undefined;
      if (file)
        imageBase64 = await new Promise<string>((resolve, reject) => {
          const reader = new FileReader();
          reader.onload = () => resolve(String(reader.result));
          reader.onerror = () => reject(new Error("Không đọc được ảnh."));
          reader.readAsDataURL(file);
        });
      const response = await fetch("/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        signal: AbortSignal.timeout(60000),
        body: JSON.stringify({
          occasion,
          garment: garment.name,
          color: colorName,
          vibe,
          accessories: extras,
          goal,
          backdrop: backdropId,
          layers: {
            inner: avatar.inner,
            bottom: avatar.bottom,
            accent: avatar.accent,
            shoes: avatar.shoes,
            bottomType: avatar.bottomType,
            footwear: avatar.footwear,
            collar: avatar.collar,
          },
          imageBase64,
          mimeType: file?.type,
          imageDescription: `Mockup 3D: lớp dưới ${avatar.bottomType}, giày ${avatar.footwear}, màu trong ${avatar.inner}, màu dưới ${avatar.bottom}, màu phụ kiện ${avatar.accent}, giữ cổ áo ${avatar.collar}. Lưu ý: ${warnings.map((w) => w.title).join("; ")}.`,
        }),
      });
      const data = await response.json();
      if (!response.ok || !validSuggestion(data.suggestion))
        throw new Error(
          data.error || "Chưa thể kết nối stylist. Bạn thử lại nhé.",
        );
      setResult(data.suggestion);
      setResultSource("GỢI Ý TỪ GOOGLE GEMINI");
      setSaved(false);
      setApplied(false);
      setPreviousOutfit(null);
    } catch (error) {
      setMessage(
        error instanceof Error && error.name === "TimeoutError"
          ? "Gemini đang phản hồi lâu hơn thường lệ. Bạn có thể thử lại hoặc tạo bản phối theo lựa chọn."
          : error instanceof Error
            ? error.message
            : "Chưa thể kết nối stylist.",
      );
    } finally {
      setBusy(false);
    }
  }
  function applyOutfit(outfit: OutfitRecommendation) {
    setGarmentId(outfit.garment);
    setColorName(outfit.color);
    setExtras([...outfit.accessories]);
    setAvatar((current) => ({ ...current, ...outfit.layers }));
    setSaved(false);
  }
  function save() {
    try {
      const looks = readLooks();
      const look: SavedLook = {
        id: crypto.randomUUID(),
        garment: garmentId,
        color: colorName,
        occasion,
        vibe,
        accessories: extras,
        avatar,
        backdrop: backdropId,
        thumbnail: avatarRef.current?.thumbnail(),
        ...(result && (!result.bản_phối || applied) ? { result } : {}),
      };
      writeLooks([look, ...looks].slice(0, 30));
      setSaved(true);
      setMessage("Đã lưu vào lookbook trên thiết bị này.");
    } catch {
      setMessage(
        "Trình duyệt chưa cho phép lưu. Bạn vẫn có thể chia sẻ đường dẫn bản phối.",
      );
    }
  }
  async function share() {
    const query = new URLSearchParams({
      garment: garmentId,
      color: colorName,
      occasion,
      vibe,
      extras: extras.join(","),
      avatar: JSON.stringify(avatar),
      backdrop: backdropId,
    });
    const url = `${location.origin}/mix-match?${query}`;
    try {
      await navigator.clipboard.writeText(url);
      setMessage(
        "Đã sao chép liên kết các lựa chọn phối đồ. Ảnh cá nhân không được chia sẻ.",
      );
    } catch {
      setMessage(`Liên kết bản phối: ${url}`);
    }
  }
  return (
    <>
      <Header active="studio" />
      <main className="studio-page section-wrap">
        <Reveal>
          <div className="studio-heading">
            <div>
              <span className="eyebrow">THE REMIX STUDIO / 3D</span>
              <h1>
                Hôm nay, bạn <em>mặc gì?</em>
              </h1>
              <p>Chọn dáng người. Khoác nếp áo. Xoay để thấy chất riêng.</p>
            </div>
            <span className="powered-pill">
              <BrandMark className="gemini-symbol" size={20} /> Cùng Google
              Gemini
            </span>
          </div>
        </Reveal>
        <nav className="mobile-studio-jump" aria-label="Di chuyển trong studio">
          <a href="#studio-canvas">Xem mô hình 3D ↑</a>
          <a href="#studio-controls">Chọn & chỉnh đồ ↓</a>
        </nav>
        <div className="studio-layout">
          <section
            id="studio-controls"
            className="studio-controls"
            aria-label="Tùy chỉnh bản phối"
          >
            <fieldset disabled={busy}>
              <div
                className="studio-control-tabs"
                role="group"
                aria-label="Nhóm tùy chỉnh"
              >
                <button
                  aria-pressed={controlTab === "outfit"}
                  onClick={() => setControlTab("outfit")}
                >
                  Trang phục
                </button>
                <button
                  aria-pressed={controlTab === "avatar"}
                  onClick={() => setControlTab("avatar")}
                >
                  Người mẫu & lớp
                </button>
              </div>
              <div hidden={controlTab !== "avatar"}>
                {" "}
                <AvatarControls
                  value={avatar}
                  onChange={(next) => {
                    setAvatar(next);
                    changed();
                  }}
                />
              </div>
              <div hidden={controlTab !== "outfit"}>
                <div className="control-group">
                  <span className="control-label">
                    <b>01</b> Bắt đầu từ một nếp áo
                  </span>
                  <div className="garment-options">
                    {garments.map((g) => (
                      <button
                        key={g.id}
                        className={
                          g.id === garmentId
                            ? "garment-option selected"
                            : "garment-option"
                        }
                        aria-pressed={g.id === garmentId}
                        onClick={() => {
                          setGarmentId(g.id);
                          changed();
                        }}
                      >
                        <span>
                          <Image src={g.image} alt="" fill sizes="90px" />
                        </span>
                        {g.name}
                        {g.id === garmentId && (
                          <i>
                            <Check size={11} />
                          </i>
                        )}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="control-group">
                  <label className="control-label" htmlFor="occasion">
                    <b>02</b> Bạn sẽ đi đâu?
                  </label>
                  <div className="select-wrap">
                    <select
                      id="occasion"
                      value={occasion}
                      onChange={(e) => {
                        setOccasion(e.target.value);
                        changed();
                      }}
                    >
                      {occasions.map((o) => (
                        <option key={o}>{o}</option>
                      ))}
                    </select>
                    <ChevronDown size={16} />
                  </div>
                </div>
                <div className="control-group">
                  <span className="control-label">
                    <b>03</b> Một sắc màu rất bạn <small>{colorName}</small>
                  </span>
                  <div className="color-options">
                    {colors.map((c) => (
                      <button
                        key={c.name}
                        title={c.name}
                        aria-label={c.name}
                        aria-pressed={c.name === colorName}
                        className={
                          c.name === colorName
                            ? "color-option selected"
                            : "color-option"
                        }
                        onClick={() => {
                          setColorName(c.name);
                          changed();
                        }}
                      >
                        <span style={{ backgroundColor: c.hex }}>
                          {c.name === colorName && <Check size={18} />}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
                <div className="control-group">
                  <span className="control-label">
                    <b>04</b> Chọn chất riêng
                  </span>
                  <div className="choice-chips">
                    {vibes.map((v) => (
                      <button
                        key={v}
                        aria-pressed={v === vibe}
                        className={v === vibe ? "selected" : ""}
                        onClick={() => {
                          setVibe(v);
                          changed();
                        }}
                      >
                        {v}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="control-group">
                  <span className="control-label">
                    <b>05</b> Thêm chút điểm nhấn <small>Tùy chọn</small>
                  </span>
                  <div className="choice-chips accessories">
                    {accessories.map((a) => (
                      <button
                        key={a}
                        aria-pressed={extras.includes(a)}
                        className={extras.includes(a) ? "selected" : ""}
                        onClick={() => {
                          setExtras(
                            extras.includes(a)
                              ? extras.filter((x) => x !== a)
                              : [...extras, a],
                          );
                          changed();
                        }}
                      >
                        {extras.includes(a) ? (
                          <Check size={13} />
                        ) : (
                          <Plus size={13} />
                        )}
                        {a}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              <div
                className="upload-area"
                onDragOver={(e) => e.preventDefault()}
                onDrop={(e) => {
                  e.preventDefault();
                  if (!busy) upload(e.dataTransfer.files[0]);
                }}
              >
                <button
                  type="button"
                  onClick={() => fileInput.current?.click()}
                >
                  <ImagePlus size={20} />
                  <span>
                    {file ? file.name : "Thêm ảnh món đồ của bạn"}
                    <small>JPG, PNG, WebP · tối đa 5 MB</small>
                  </span>
                </button>
                {file && (
                  <button
                    className="icon-button"
                    aria-label="Xóa ảnh"
                    onClick={() => {
                      setFile(null);
                      setPreview("");
                      changed();
                    }}
                  >
                    <X size={15} />
                  </button>
                )}
                <input
                  ref={fileInput}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  aria-label="Tải ảnh món đồ"
                  className="sr-only"
                  onChange={(e) => {
                    upload(e.target.files?.[0]);
                    e.target.value = "";
                  }}
                />
              </div>
              <p className="upload-note">
                Ảnh chỉ gửi tới Google khi bạn chọn gợi ý từ Gemini.
              </p>
              <label className="stylist-goal">
                Bạn muốn stylist giúp gì?
                <textarea
                  maxLength={400}
                  rows={3}
                  value={goal}
                  placeholder="VD: Phối đi chụp kỷ yếu ở Văn Miếu, nhẹ nhàng, ít phụ kiện và dễ tìm đồ."
                  onChange={(e) => {
                    setGoal(e.target.value);
                    changed();
                  }}
                />
              </label>
              <button
                className="button button-primary full-button"
                onClick={compose}
              >
                Tạo bản phối của tôi <ArrowUpRight size={18} />
              </button>
              <button
                className="gemini-button"
                onClick={askGemini}
                disabled={busy}
              >
                {busy ? (
                  <LoaderCircle size={18} className="spin" />
                ) : (
                  <Sparkles size={17} />
                )}
                {busy
                  ? "Gemini đang tìm cảm hứng…"
                  : "Gợi ý sâu hơn cùng Gemini"}
              </button>
              <p className="upload-note">
                AI tư vấn cả bộ: áo, bảng màu, quần/váy, giày và phụ kiện. Bạn
                xem rồi chọn áp dụng.
              </p>
            </fieldset>
          </section>
          <section
            className="studio-result"
            aria-label="Bản phối của bạn"
            aria-busy={busy}
          >
            <div className="result-topline">
              <span>YOUR PERSONAL EDIT</span>
              <button
                className="text-link"
                disabled={busy}
                onClick={() => {
                  setAvatar({ ...defaultAvatar });
                  setBackdropId("studio");
                  setGoal("");
                  setGarmentId("ao-dai");
                  setColorName("Ngọc bích");
                  setOccasion("Dạo phố");
                  setVibe("Thanh lịch");
                  setExtras(["Quạt giấy"]);
                  setFile(null);
                  setPreview("");
                  changed();
                }}
              >
                <RotateCcw size={13} /> Làm mới
              </button>
            </div>
            <div className="canvas-anchor" id="studio-canvas" />
            <div className="backdrop-picker">
              <div className="backdrop-heading">
                <span className="eyebrow">MẶC ĐẸP, ĐÚNG KHUNG CẢNH</span>
                <span>Hà Nội trong bản phối của bạn</span>
              </div>
              <div
                className="backdrop-options"
                role="group"
                aria-label="Chọn bối cảnh"
              >
                {backdrops.map((b) => (
                  <button
                    key={b.id}
                    aria-pressed={backdropId === b.id}
                    onClick={() => {
                      setBackdropId(b.id);
                      changed();
                    }}
                    disabled={busy}
                  >
                    <span className="backdrop-thumb">
                      {b.image ? (
                        <Image src={b.image} alt="" fill sizes="180px" />
                      ) : (
                        <BrandMark size={28} />
                      )}
                    </span>
                    <span>{b.name}</span>
                  </button>
                ))}
              </div>
              <p>{backdrop.description}</p>
            </div>
            <AvatarCanvas
              ref={avatarRef}
              garment={garmentId}
              color={color.hex}
              extras={extras}
              avatar={avatar}
              backdrop={backdropId}
            />
            {result?.bản_phối && (
              <section
                className="stylist-proposal"
                aria-label="Bản phối stylist đề xuất"
              >
                <span className="eyebrow">
                  <BrandMark size={18} /> GOOGLE GEMINI / STYLIST CỦA BẠN
                </span>
                <h2>Một tổng thể có chủ ý.</h2>
                <p>{result.nhận_xét}</p>
                <p>{result.lý_do}</p>
                <div className="proposal-palette">
                  {[
                    colors.find((c) => c.name === result.bản_phối!.color)!.hex,
                    result.bản_phối.layers.inner,
                    result.bản_phối.layers.bottom,
                    result.bản_phối.layers.accent,
                    result.bản_phối.layers.shoes,
                  ].map((hex, i) => (
                    <i key={i} style={{ background: hex }} />
                  ))}
                </div>
                <p className="proposal-summary">
                  {
                    garments.find((g) => g.id === result.bản_phối!.garment)
                      ?.name
                  }{" "}
                  · {result.bản_phối.color} ·{" "}
                  {result.bản_phối.layers.bottomType === "skirt"
                    ? "Váy dài"
                    : "Quần dài"}{" "}
                  ·{" "}
                  {result.bản_phối.layers.footwear === "sneakers"
                    ? "Sneaker"
                    : "Giày bệt"}{" "}
                  · {result.bản_phối.accessories.join(", ") || "Không phụ kiện"}
                </p>
                <div className="look-actions">
                  <button
                    className="button button-primary"
                    disabled={applied || busy}
                    onClick={() => {
                      setPreviousOutfit({
                        garment: garmentId,
                        color: colorName,
                        accessories: [...extras],
                        layers: {
                          inner: avatar.inner,
                          bottom: avatar.bottom,
                          accent: avatar.accent,
                          shoes: avatar.shoes,
                          bottomType: avatar.bottomType,
                          footwear: avatar.footwear,
                          collar: avatar.collar,
                        },
                      });
                      applyOutfit(result.bản_phối!);
                      setApplied(true);
                      setMessage("Đã áp dụng bản phối AI lên ma-nơ-canh.");
                    }}
                  >
                    {applied ? <Check size={16} /> : <Sparkles size={16} />}{" "}
                    {applied ? "Đã áp dụng bản phối AI" : "Áp dụng bản phối AI"}
                  </button>
                  {applied && previousOutfit && (
                    <button
                      className="button button-outline"
                      onClick={() => {
                        applyOutfit(previousOutfit);
                        setApplied(false);
                        setPreviousOutfit(null);
                        setMessage("Đã trở lại bản phối trước khi áp dụng AI.");
                      }}
                    >
                      Trở lại bản phối trước
                    </button>
                  )}
                </div>
              </section>
            )}
            <div className="palette-insight">
              <div>
                {[
                  color.hex,
                  avatar.inner,
                  avatar.bottom,
                  avatar.accent,
                  avatar.shoes,
                ].map((hex, i) => (
                  <i key={i} style={{ background: hex }} />
                ))}
              </div>
              <p>
                <b>{harmony}</b>
                <span>
                  Gợi ý theo khoảng cách sắc màu, không phải điểm đánh giá thẩm
                  mỹ.
                </span>
              </p>
            </div>
            <div
              className="live-culture"
              aria-live="polite"
              aria-label="Lưu ý văn hóa theo bản phối"
            >
              {warnings.length ? (
                warnings.map((warning) => (
                  <div className="cultural-warning" key={warning.title}>
                    <ShieldCheck size={18} />
                    <div>
                      <strong>{warning.title}</strong>
                      <p>{warning.text}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="culture-clear">
                  <ShieldCheck size={17} /> Chưa có lưu ý bổ sung từ các quy tắc
                  của demo. Xem tư liệu cho bối cảnh sử dụng.
                </p>
              )}
            </div>
            <details className="reference-drawer">
              <summary>
                Đối chiếu ảnh thật & nguồn gốc <Plus size={16} />
              </summary>
              <div className="reference-content">
                <div className="reference-photo">
                  <Image
                    src={garment.image}
                    alt={`Ảnh tham khảo ${garment.name}`}
                    fill
                    sizes="180px"
                    style={{ objectPosition: garment.objectPosition }}
                  />
                </div>
                <div>
                  <span className="eyebrow">
                    {garment.region} / {garment.name}
                  </span>
                  <p>{garment.story}</p>
                  <a
                    className="text-link"
                    href={garment.source}
                    target="_blank"
                    rel="noreferrer"
                  >
                    {garment.sourceName} ↗
                  </a>
                </div>
              </div>
            </details>
            {preview && (
              <div className="upload-preview-row">
                <div className="user-photo">
                  <Image
                    src={preview}
                    alt="Món đồ bạn tải lên"
                    fill
                    unoptimized
                    sizes="100px"
                  />
                </div>
                <p>Ảnh tham khảo cho Gemini; chưa chuyển thành vật thể 3D.</p>
              </div>
            )}
            <Link
              className="text-link garment-story-link"
              href={`/heritage/${garment.id}`}
            >
              Đọc câu chuyện {garment.name.toLowerCase()}{" "}
              <ArrowUpRight size={13} />
            </Link>
            <p className="reference-note">
              Ảnh tư liệu dùng để đối chiếu. Ma-nơ-canh là minh họa được dựng
              riêng cho bản demo.
            </p>
            <div className="look-result-copy" aria-live="polite">
              <span className="eyebrow">
                {result ? resultSource : "BẢN PHÁC THẢO CỦA BẠN"}
              </span>
              <h2>
                {result
                  ? result["tên_trang_phục"]
                  : `${garment.name}, theo cách của bạn.`}
              </h2>
              {result ? (
                <ul className="styling-tips">
                  {result["gợi_ý_phối"].map((tip, i) => (
                    <li key={i}>
                      <span>{String(i + 1).padStart(2, "0")}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="muted">
                  Mô hình 3D cập nhật ngay theo lựa chọn. Nhấn “Tạo bản phối của
                  tôi” để thêm thẻ gợi ý, hoặc lưu ngay mockup vào lookbook.
                </p>
              )}
              <div className="look-actions">
                <button
                  className="button button-dark"
                  onClick={save}
                  disabled={saved || busy}
                >
                  {saved ? <Check size={16} /> : <Bookmark size={16} />}
                  {saved ? "Đã lưu bản phối" : "Lưu vào lookbook"}
                </button>
                <button className="button button-outline" onClick={share}>
                  <Share2 size={15} /> Chia sẻ
                </button>
              </div>
            </div>
            {message && (
              <p role="status" className="status-message">
                {message}
              </p>
            )}
            <details className="culture-note" open>
              <summary>
                <ShieldCheck size={18} /> Đẹp từ sự thấu hiểu{" "}
                <ChevronDown size={16} />
              </summary>
              <p>{garment.story}</p>
              <p>{result ? result["cảnh_báo_văn_hóa"] : garment.note}</p>
              <a href={garment.source} target="_blank" rel="noreferrer">
                Tìm hiểu thêm · {garment.sourceName} <ArrowUpRight size={13} />
              </a>
              {resultSource === "GỢI Ý TỪ GOOGLE GEMINI" && result && (
                <small>
                  Gợi ý AI có thể chưa chính xác; đối chiếu nguồn tư liệu khi
                  dùng trong bối cảnh nghi lễ.
                </small>
              )}
            </details>
            <Link href="/lookbook" className="text-link view-lookbook">
              Mở lookbook của bạn <ArrowUpRight size={15} />
            </Link>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}
export default function MixMatchPage() {
  return (
    <Suspense
      fallback={
        <>
          <Header active="studio" />
          <div className="page-loading">Đang mở phòng phối đồ…</div>
        </>
      }
    >
      <Studio />
    </Suspense>
  );
}
