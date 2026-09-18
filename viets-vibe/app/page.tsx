"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Menu, Sparkles } from "lucide-react";

const looks = [
  {
    name: "Áo Ngũ Thân",
    note: "Nét thanh lịch của kinh kỳ",
    number: "01",
    image: "https://source.unsplash.com/1200x1600/?vietnam,heritage,architecture",
    position: "center 20%",
  },
  {
    name: "Áo Tấc",
    note: "Cấu trúc của nghi lễ",
    number: "02",
    image: "https://source.unsplash.com/1200x1600/?vietnam,lotus,nature",
    position: "center 30%",
  },
  {
    name: "Nhật Bình",
    note: "Một chương sắc màu cung đình",
    number: "03",
    image: "https://source.unsplash.com/1200x1600/?vietnam,temple,heritage",
    position: "center 25%",
  },
];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#101a16]">
      <div className="grain absolute inset-0 z-20" />
      <nav className="fixed inset-x-0 top-0 z-30 flex h-20 items-center justify-between px-6 md:px-12 lg:px-16">
        <a href="#top" className="group flex items-center gap-3" aria-label="Về đầu trang">
          <span className="flex h-9 w-9 items-center justify-center rounded-full border border-[#d4ad63]/60 text-[#d4ad63]"><Sparkles size={15} strokeWidth={1.5} /></span>
          <span className="font-display text-xl tracking-wide text-[#f5ecd8]">VIET&apos;S VIBE</span>
        </a>
        <div className="hidden items-center gap-10 text-[11px] font-semibold uppercase tracking-[0.22em] text-[#b9b49d] md:flex">
          <a className="transition-colors hover:text-[#f5ecd8]" href="#explore">Explore</a>
          <a className="transition-colors hover:text-[#f5ecd8]" href="/mix-match">Mix &amp; Match</a>
        </div>
        <button className="flex h-10 w-10 items-center justify-center text-[#f5ecd8] md:hidden" aria-label="Mở menu"><Menu size={21} strokeWidth={1.5} /></button>
      </nav>

      <section id="top" className="relative isolate flex min-h-screen items-end px-6 pb-12 pt-32 md:px-12 md:pb-16 lg:px-16">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_74%_38%,rgba(105,133,91,0.3),transparent_30%),linear-gradient(115deg,#101a16_12%,rgba(16,26,22,0.72)_52%,rgba(16,26,22,0.35)),url('https://source.unsplash.com/1600x900/?vietnam,nature,lotus,temple')] bg-cover bg-[center_28%]" />
        <div className="absolute right-[8%] top-[24%] hidden h-56 w-56 rounded-full border border-[#d4ad63]/25 md:block" />
        <div className="absolute right-[13%] top-[31%] hidden h-44 w-44 rounded-full border border-[#d4ad63]/15 md:block" />

        <motion.div initial={{ opacity: 0, y: 28 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }} className="relative z-10 max-w-4xl">
          <p className="mb-6 flex items-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d4ad63] md:mb-8"><span className="h-px w-10 bg-[#d4ad63]" />Di sản · Thiên nhiên · Cội nguồn</p>
          <h1 className="max-w-4xl font-editorial text-[clamp(3.6rem,9vw,8.5rem)] font-medium leading-[0.84] tracking-[-0.04em] text-[#f5ecd8]">Khám phá <em className="font-normal text-[#d4ad63]">&amp;</em><br />Biến tấu<br />Việt Phục</h1>
          <div className="mt-10 flex flex-col gap-8 md:mt-12 md:flex-row md:items-end md:justify-between">
            <p className="max-w-xs text-sm leading-6 text-[#d9d5be]">Nơi ký ức, thiên nhiên và những nếp vải Việt gặp nhau trong một hành trình đương đại.</p>
            <motion.a href="/mix-match" whileHover={{ scale: 1.04, backgroundColor: "#e1bd75" }} whileTap={{ scale: 0.98 }} className="group flex w-fit items-center gap-8 border border-[#d4ad63] bg-[#d4ad63] px-6 py-4 text-[11px] font-bold uppercase tracking-[0.2em] text-[#18231c] transition-colors">Thử ngay <ArrowUpRight size={17} strokeWidth={1.6} className="transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></motion.a>
          </div>
        </motion.div>
        <p className="absolute bottom-16 right-8 z-10 hidden text-[10px] uppercase tracking-[0.25em] text-[#b9b49d] [writing-mode:vertical-rl] md:block lg:right-16">Bắt đầu hành trình về cội nguồn</p>
      </section>

      <section id="explore" className="relative z-10 border-t border-[#f5ecd8]/10 bg-[#17251e]/60 px-6 py-20 md:px-12 lg:px-16">
        <div className="mb-12 flex flex-col justify-between gap-8 md:flex-row md:items-end">
          <div>
            <p className="mb-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d4ad63]">01 / Cảm hứng</p>
            <h2 className="font-editorial text-5xl text-[#f5ecd8] md:text-6xl">Di sản, theo cách của bạn.</h2>
          </div>
          <p id="mix" className="max-w-sm text-sm leading-6 text-[#b9b49d]">Từ nhịp sen, mái ngói đến sắc màu cung đình. Hành trình phối ghép bắt đầu từ một cái chạm.</p>
        </div>

        <div aria-label="Bộ sưu tập Việt phục" className="-mx-6 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-8 md:-mx-12 md:px-12 lg:-mx-16 lg:px-16">
          {looks.map((look, index) => (
            <motion.article
              key={look.name}
              initial={{ opacity: 0, y: 48 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 1.05, delay: index * 0.14, ease: [0.22, 1, 0.36, 1] }}
              className="glass-card glass-card-hover group relative min-w-[82vw] snap-start overflow-hidden rounded-sm p-2 md:min-w-[44vw] lg:min-w-[31vw]"
            >
              <div
                className="aspect-[3/4] bg-cover transition-transform duration-1000 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.025]"
                style={{ backgroundImage: `linear-gradient(180deg, rgba(16, 26, 22, 0.05) 36%, rgba(16, 26, 22, 0.94) 100%), url(${look.image})`, backgroundPosition: look.position }}
              />
              <div className="absolute inset-x-2 bottom-2 flex items-end justify-between bg-[#101a16]/65 p-6 backdrop-blur-md md:p-7">
                <div>
                  <p className="mb-2 text-[10px] font-semibold uppercase tracking-[0.22em] text-[#d4ad63]">{look.number} / {look.note}</p>
                  <h3 className="font-editorial text-3xl italic text-[#f5ecd8] md:text-4xl">{look.name}</h3>
                </div>
                <ArrowUpRight className="mb-1 text-[#d4ad63] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1" size={21} strokeWidth={1.3} />
              </div>
            </motion.article>
          ))}
        </div>
        <p className="mt-2 text-[10px] uppercase tracking-[0.24em] text-[#87937d]">Vuốt để khám phá · 03 dấu ấn di sản</p>
      </section>
    </main>
  );
}
