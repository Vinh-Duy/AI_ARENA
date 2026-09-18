"use client";

import { ChangeEvent, DragEvent, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowUpRight,
  AlertTriangle,
  ChevronDown,
  Flower2,
  ImagePlus,
  Sparkles,
  Upload,
} from "lucide-react";

const occasions = ["Dạo phố", "Sự kiện", "Tết"];

type StyleSuggestion = {
  "tên_trang_phục": string;
  "nguồn_gốc": string;
  "gợi_ý_phối": string[];
  "cảnh_báo_văn_hóa": string;
};

function fileToBase64(file: File) {
  return new Promise<string>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(new Error("Không thể đọc ảnh."));
    reader.readAsDataURL(file);
  });
}

export default function MixMatchPage() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [occasion, setOccasion] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [result, setResult] = useState<StyleSuggestion | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const previewUrlRef = useRef<string | null>(null);

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
    };
  }, []);

  function handleFile(file?: File) {
    if (file?.type.startsWith("image/")) {
      if (previewUrlRef.current) URL.revokeObjectURL(previewUrlRef.current);
      const objectUrl = URL.createObjectURL(file);
      previewUrlRef.current = objectUrl;
      setSelectedImage(file);
      setImagePreview(objectUrl);
      setResult(null);
      setErrorMessage(null);
    }
  }

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    handleFile(event.target.files?.[0]);
  }

  function handleDrop(event: DragEvent<HTMLLabelElement>) {
    event.preventDefault();
    setIsDragging(false);
    handleFile(event.dataTransfer.files[0]);
  }

  async function handleGenerate() {
    setIsGenerating(true);
    setResult(null);
    setErrorMessage(null);

    try {
      const imageBase64 = selectedImage ? await fileToBase64(selectedImage) : undefined;
      const response = await fetch("/api/style", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          occasion,
          imageBase64,
          mimeType: selectedImage?.type,
          imageDescription: selectedImage ? undefined : `Người dùng muốn phối đồ cho dịp ${occasion}.`,
        }),
      });
      const payload = (await response.json()) as { suggestion?: StyleSuggestion; error?: string };
      if (!response.ok || !payload.suggestion) throw new Error(payload.error || "Không thể tạo gợi ý.");
      setResult(payload.suggestion);
    } catch (error) {
      setErrorMessage(error instanceof Error ? error.message : "Không thể tạo gợi ý lúc này.");
    } finally {
      setIsGenerating(false);
    }
  }

  const canGenerate = Boolean(selectedImage || occasion);

  return (
    <main className="relative min-h-screen overflow-hidden bg-[#180e0d] text-[#f3ead7]">
      <div className="grain pointer-events-none absolute inset-0 z-20" />
      <header className="relative z-30 flex h-20 items-center justify-between border-b border-[#f3ead7]/10 px-6 md:px-12 lg:px-16">
        <Link href="/" className="group flex items-center gap-3" aria-label="Về trang chủ">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d9a95b]/60 text-[#d9a95b] transition-colors group-hover:bg-[#d9a95b] group-hover:text-[#180e0d]"><Sparkles size={15} strokeWidth={1.5} /></span>
          <span className="font-display text-xl tracking-wide">VIET&apos;S VIBE</span>
        </Link>
        <Link href="/" className="flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#b6a596] transition-colors hover:text-[#f3ead7]"><ArrowLeft size={15} strokeWidth={1.5} /> Về trang chủ</Link>
      </header>

      <div className="relative z-10 mx-auto grid max-w-[1500px] gap-0 lg:min-h-[calc(100vh-5rem)] lg:grid-cols-[minmax(0,0.88fr)_minmax(0,1.12fr)]">
        <section className="glass-card border-b border-[#f3ead7]/10 px-7 py-14 md:px-14 lg:border-b-0 lg:border-r lg:px-20 lg:py-20">
          <div className="mb-10 max-w-lg">
            <p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9a95b]"><span className="h-px w-10 bg-[#d9a95b]" />01 / Bắt đầu</p>
            <h1 className="font-display text-6xl leading-[0.88] tracking-[-0.03em] md:text-7xl">Phối đồ<br /><em className="font-editorial font-normal text-[#d9a95b]">theo</em> chất riêng.</h1>
            <p className="mt-6 max-w-sm text-sm leading-6 text-[#b6a596]">Đưa một món đồ bạn yêu thích vào đây. Chúng tôi sẽ tìm nhịp điệu phù hợp cho dịp sắp tới.</p>
          </div>

          <label
            htmlFor="clothing-upload"
            onDragEnter={() => setIsDragging(true)}
            onDragOver={(event) => event.preventDefault()}
            onDragLeave={() => setIsDragging(false)}
            onDrop={handleDrop}
            className={`glass-card-hover group relative flex aspect-[1.7/1] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-sm border transition-colors ${isDragging ? "border-[#d9a95b] bg-[#d9a95b]/10" : "border-dashed border-[#f3ead7]/25 bg-[#211312]/60 hover:border-[#d9a95b]/70"}`}
          >
            {imagePreview ? (
              <>
                <div className="absolute inset-0 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(24,14,13,0.08), rgba(24,14,13,0.8)), url(${imagePreview})` }} />
                <div className="relative z-10 text-center"><ImagePlus className="mx-auto mb-3 text-[#d9a95b]" size={25} strokeWidth={1.4} /><p className="text-sm text-[#f3ead7]">{selectedImage?.name}</p><p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-[#d9a95b]">Thay đổi ảnh</p></div>
              </>
            ) : (
              <div className="relative z-10 flex flex-col items-center text-center"><span className="mb-5 flex h-14 w-14 items-center justify-center rounded-full border border-[#d9a95b]/40 text-[#d9a95b] transition-transform duration-500 group-hover:-translate-y-1"><Upload size={20} strokeWidth={1.4} /></span><p className="font-editorial text-2xl italic text-[#f3ead7]">Thả món đồ vào đây</p><p className="mt-2 text-[10px] uppercase tracking-[0.2em] text-[#806c62]">hoặc chạm để chọn ảnh</p></div>
            )}
            <input id="clothing-upload" type="file" accept="image/*" onChange={handleFileChange} className="sr-only" />
          </label>

          <div className="my-8 flex items-center gap-4 text-[10px] uppercase tracking-[0.25em] text-[#806c62]"><span className="h-px flex-1 bg-[#f3ead7]/10" />hoặc chọn dịp<span className="h-px flex-1 bg-[#f3ead7]/10" /></div>
          <div className="relative">
            <select aria-label="Chọn dịp phối đồ" value={occasion} onChange={(event) => { setOccasion(event.target.value); setResult(null); setErrorMessage(null); }} className="w-full appearance-none border border-[#f3ead7]/20 bg-[#211312] px-5 py-4 text-sm text-[#f3ead7] outline-none transition-colors focus:border-[#d9a95b]">
              <option value="" disabled>Chọn một dịp đặc biệt</option>
              {occasions.map((item) => <option key={item} value={item}>{item}</option>)}
            </select>
            <ChevronDown className="pointer-events-none absolute right-5 top-1/2 -translate-y-1/2 text-[#d9a95b]" size={17} strokeWidth={1.5} />
          </div>

          <motion.button type="button" aria-label="Phối đồ ngay" onClick={handleGenerate} disabled={!canGenerate || isGenerating} whileHover={canGenerate ? { scale: 1.015, backgroundColor: "#e5b96c" } : undefined} whileTap={canGenerate ? { scale: 0.985 } : undefined} transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }} className="mt-10 flex w-full items-center justify-between border border-[#d9a95b] bg-[#d9a95b] px-7 py-5 text-[11px] font-bold uppercase tracking-[0.2em] text-[#261210] transition-opacity duration-700 disabled:cursor-not-allowed disabled:opacity-35">
            <span>{isGenerating ? "Đang dệt nên diện mạo..." : "Phối Đồ Ngay"}</span>
            {isGenerating ? <motion.span animate={{ rotate: 360 }} transition={{ duration: 1.3, repeat: Infinity, ease: "linear" }}><Flower2 size={19} strokeWidth={1.4} /></motion.span> : <ArrowUpRight size={18} strokeWidth={1.5} />}
          </motion.button>
        </section>

        <section aria-live="polite" aria-busy={isGenerating} className="glass-card relative flex min-h-[560px] flex-col justify-between overflow-hidden px-7 py-14 transition-colors duration-1000 md:px-14 lg:min-h-0 lg:px-20 lg:py-20">
          <div className="absolute -right-28 -top-28 h-80 w-80 rounded-full border border-[#d9a95b]/10" />
          <div className="absolute -right-16 -top-16 h-56 w-56 rounded-full border border-[#d9a95b]/10" />
          <div className="relative z-10 flex items-start justify-between"><div><p className="mb-5 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d9a95b]"><span className="h-px w-10 bg-[#d9a95b]" />02 / Lookbook</p><h2 className="font-display text-5xl leading-none md:text-6xl">Gợi ý<br /><em className="font-editorial font-normal text-[#d9a95b]">của bạn.</em></h2></div><span className="font-editorial text-4xl italic text-[#d9a95b]/50">V.V</span></div>

          <div className="relative z-10 flex flex-1 items-center justify-center py-16">
            {isGenerating ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center gap-6 text-center"><motion.div animate={{ rotate: 360, scale: [1, 1.08, 1] }} transition={{ rotate: { duration: 2.4, repeat: Infinity, ease: "linear" }, scale: { duration: 1.4, repeat: Infinity, ease: "easeInOut" } }} className="flex h-24 w-24 items-center justify-center rounded-[44%_56%_52%_48%/48%_44%_56%_52%] border border-[#d9a95b] text-[#d9a95b]"><Flower2 size={34} strokeWidth={1} /></motion.div><p className="font-editorial text-2xl italic text-[#f3ead7]">Đang tìm cảm hứng...</p><p className="max-w-xs text-xs leading-5 text-[#806c62]">Những đường nét phù hợp đang được kết nối.</p></motion.div>
            ) : result ? (
                <motion.div layout aria-label="Lookbook Card" initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.05, ease: [0.22, 1, 0.36, 1] }} className="glass-card w-full max-w-lg rounded-sm p-7 [will-change:transform,opacity] md:p-9"><div className="mb-8 flex items-start justify-between gap-5"><div><p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.25em] text-[#d9a95b]">Bản phối đã thành hình</p><h3 className="font-editorial text-3xl italic leading-tight text-[#f3ead7]">{result["tên_trang_phục"]}</h3><p className="mt-3 text-xs text-[#b6a596]">{result["nguồn_gốc"]}</p></div><Sparkles className="mt-1 shrink-0 text-[#d9a95b]" size={21} strokeWidth={1.2} /></div><div className="border-t border-[#f3ead7]/10 pt-6"><p className="mb-4 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d9a95b]">Gợi ý phối</p><ul className="space-y-4 text-sm leading-6 text-[#d5c7b7]">{result["gợi_ý_phối"].map((item) => <li key={item} className="flex gap-3"><span className="mt-3 h-px w-5 shrink-0 bg-[#d9a95b]" />{item}</li>)}</ul></div><motion.div role="alert" initial={{ opacity: 0, clipPath: "inset(0 100% 0 0)" }} animate={{ opacity: 1, clipPath: "inset(0 0% 0 0)" }} transition={{ delay: 0.35, duration: 0.8, ease: [0.22, 1, 0.36, 1] }} className="mt-8 flex gap-4 border border-[#d66b45]/35 bg-[#6e2b24]/35 p-5 text-xs leading-5 text-[#f3d4bd]"><AlertTriangle className="mt-0.5 shrink-0 text-[#e9a167]" size={18} strokeWidth={1.5} /><p><span className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.2em] text-[#e9a167]">Cảnh báo văn hóa</span>{result["cảnh_báo_văn_hóa"]}</p></motion.div></motion.div>
            ) : errorMessage ? (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-sm text-center"><p className="font-editorial text-2xl italic text-[#f3ead7]">Chưa thể dệt nên gợi ý.</p><p className="mt-3 text-xs leading-5 text-[#b6a596]">{errorMessage}</p></motion.div>
            ) : (
              <div className="max-w-sm text-center"><div className="mx-auto mb-7 flex h-20 w-20 items-center justify-center rounded-[46%_54%_48%_52%/52%_46%_54%_48%] border border-[#d9a95b]/25 text-[#d9a95b]/70"><Sparkles size={25} strokeWidth={1} /></div><p className="font-editorial text-3xl italic text-[#f3ead7]">Lookbook Result</p><p className="mt-3 text-xs leading-5 text-[#806c62]">Chọn một món đồ hoặc một dịp để bắt đầu bản phối riêng của bạn.</p></div>
            )}
          </div>

          <div className="relative z-10 flex items-center justify-between border-t border-[#f3ead7]/10 pt-5 text-[10px] uppercase tracking-[0.2em] text-[#806c62]"><span>Việt phục / 2026</span><span className="flex items-center gap-2">Chờ cảm hứng <ArrowUpRight size={13} /></span></div>
        </section>
      </div>
    </main>
  );
}
