"use client";

import { motion } from "framer-motion";
import { ArrowUpRight, Menu, Sparkles } from "lucide-react";
import HTMLFlipBook from "react-pageflip";

const heritageItems = [
  {
    name: "Áo Ngũ Thân",
    era: "Thế kỷ XVIII",
    description: "Dáng áo năm thân gợi lại nếp sống nền nã của người Việt xưa, nơi mỗi đường khuy đều kể một câu chuyện về gia phong.",
    image: "https://source.unsplash.com/900x1200/?vietnam,heritage,architecture",
  },
  {
    name: "Áo Tấc",
    era: "Triều Nguyễn",
    description: "Trang phục nghi lễ với tay áo rộng và phom dáng trang trọng, từng hiện diện trong những dịp trọng đại của triều đình.",
    image: "https://source.unsplash.com/900x1200/?vietnam,temple,architecture",
  },
  {
    name: "Nhật Bình",
    era: "Cung đình Huế",
    description: "Cổ áo vuông như vầng nhật nguyệt, Nhật Bình lưu giữ vẻ đẹp quyền quý qua những mảng màu và hoa văn biểu tượng.",
    image: "https://source.unsplash.com/900x1200/?hue,vietnam,heritage",
  },
  {
    name: "Áo Giao Lĩnh",
    era: "Thời Lý - Trần",
    description: "Hai vạt áo giao nhau trước ngực tạo nên một nhịp gấp mềm mại, phản chiếu tinh thần thanh nhã của mỹ học phương Đông.",
    image: "https://source.unsplash.com/900x1200/?vietnam,old,town",
  },
  {
    name: "Áo Viên Lĩnh",
    era: "Thời Lê",
    description: "Cổ tròn kín đáo và cân đối, Viên Lĩnh là dấu tích của một thời kỳ đề cao sự hài hòa giữa con người và lễ nghi.",
    image: "https://source.unsplash.com/900x1200/?vietnam,green,nature",
  },
  {
    name: "Áo Tứ Thân",
    era: "Kinh Bắc",
    description: "Bốn vạt áo gắn với hình ảnh người phụ nữ đồng bằng Bắc Bộ, bền bỉ, duyên dáng và luôn mang theo sắc màu quê hương.",
    image: "https://source.unsplash.com/900x1200/?vietnam,rice,field",
  },
  {
    name: "Áo Dài",
    era: "Thế kỷ XX",
    description: "Đường cong của tà áo dài là cuộc đối thoại đẹp giữa truyền thống và hiện đại, một biểu tượng Việt Nam vượt qua mọi biên giới.",
    image: "https://source.unsplash.com/900x1200/?vietnam,city,architecture",
  },
  {
    name: "Yếm",
    era: "Nếp nhà Bắc Bộ",
    description: "Mảnh yếm nhỏ ôm lấy thân người, giản dị mà tinh tế, thường được điểm bằng sắc đỏ son của mùa hội và những ngày vui.",
    image: "https://source.unsplash.com/900x1200/?vietnam,lotus,pond",
  },
  {
    name: "Nón Quai Thao",
    era: "Vùng Kinh Bắc",
    description: "Vành nón rộng và dải quai mềm đã trở thành một nét chấm phá trong ký ức hội Lim, giữa câu quan họ và sắc xuân.",
    image: "https://source.unsplash.com/900x1200/?vietnam,traditional,village",
  },
  {
    name: "Hài Mũi Thuyền",
    era: "Phục sức cung đình",
    description: "Mũi hài cong như mũi thuyền, một chi tiết nhỏ nhưng giàu nhạc tính, làm hoàn chỉnh dáng đi khoan thai của người mặc.",
    image: "https://source.unsplash.com/900x1200/?vietnam,craft,handmade",
  },
  {
    name: "Kim Khánh",
    era: "Biểu tượng ban thưởng",
    description: "Tấm kim loại chạm khắc dùng trong nghi lễ, nơi nghệ thuật thủ công và ngôn ngữ quyền uy cùng được lưu lại trên một mặt vàng.",
    image: "https://source.unsplash.com/900x1200/?vietnam,gold,craft",
  },
  {
    name: "Thẻ Bài",
    era: "Dấu tích triều nghi",
    description: "Thẻ bài từng xác nhận vị trí và vai trò trong những nghi lễ xưa, nay trở thành mảnh ghép để đọc lại trật tự của một thời.",
    image: "https://source.unsplash.com/900x1200/?vietnam,wood,pattern",
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
        <div className="hero-image absolute inset-0" />
        <div className="hero-overlay absolute inset-0" />
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

      <section id="explore" className="relative z-10 overflow-hidden border-t border-[#f5ecd8]/10 bg-[#17251e]/60 px-6 py-24 md:px-12 lg:px-16 lg:py-32">
        <div className="mx-auto mb-14 max-w-3xl text-center">
          <p className="mb-4 flex items-center justify-center gap-3 text-[10px] font-semibold uppercase tracking-[0.3em] text-[#d4ad63]"><span className="h-px w-10 bg-[#d4ad63]" />01 / Thư viện di sản<span className="h-px w-10 bg-[#d4ad63]" /></p>
          <h2 className="font-editorial text-5xl leading-none text-[#f5ecd8] md:text-7xl">Lật mở một miền ký ức.</h2>
          <p id="mix" className="mx-auto mt-6 max-w-lg text-sm leading-6 text-[#b9b49d]">Mỗi trang là một dấu vết. Kéo góc giấy hoặc chạm vào góc sách để đi qua những lớp lang của Việt phục.</p>
        </div>

        <motion.div initial={{ opacity: 0, scale: 0.94, y: 28 }} whileInView={{ opacity: 1, scale: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }} className="mx-auto flex max-w-6xl justify-center">
          <HTMLFlipBook width={360} height={500} size="stretch" minWidth={280} maxWidth={520} minHeight={390} maxHeight={720} startPage={0} startZIndex={0} autoSize showCover usePortrait drawShadow flippingTime={1100} maxShadowOpacity={0.36} mobileScrollSupport clickEventForward={false} useMouseEvents showPageCorners swipeDistance={30} disableFlipByClick={false} className="heritage-book" style={{}}>
            <div className="book-page book-cover flex h-full flex-col justify-between p-8 md:p-10"><div className="flex items-center justify-between text-[9px] uppercase tracking-[0.3em] text-[#d4ad63]"><span>Việt&apos;s Vibe</span><span>2026</span></div><div><p className="mb-5 text-[10px] uppercase tracking-[0.3em] text-[#d4ad63]">Một tuyển tập</p><h3 className="font-editorial text-6xl italic leading-[0.82] text-[#f5ecd8]">Việt<br />Phục</h3><p className="mt-6 max-w-[12rem] text-xs leading-5 text-[#b9b49d]">Những hình hài của ký ức, được kể lại bằng ánh sáng hôm nay.</p></div><div className="flex items-end justify-between"><span className="font-editorial text-3xl text-[#d4ad63]">✦</span><span className="text-[9px] uppercase tracking-[0.22em] text-[#87937d]">Mở sách</span></div></div>
            {heritageItems.map((item, index) => (
              <div key={item.name} className="book-page">
                <div className="book-image-page h-1/2 bg-cover bg-center" style={{ backgroundImage: `linear-gradient(180deg, rgba(16,26,22,0.05), rgba(16,26,22,0.55)), url(${item.image})` }}><span className="m-5 inline-flex border border-[#f5ecd8]/35 bg-[#101a16]/45 px-3 py-2 text-[9px] uppercase tracking-[0.25em] text-[#f5ecd8]">{String(index + 1).padStart(2, "0")} / Dấu tích</span></div>
                <div className="flex h-1/2 flex-col justify-between p-7 md:p-8"><div><p className="mb-3 text-[9px] font-semibold uppercase tracking-[0.25em] text-[#d4ad63]">{item.era}</p><h3 className="font-editorial text-4xl italic leading-none text-[#f5ecd8]">{item.name}</h3></div><p className="text-xs leading-6 text-[#b9b49d]">{item.description}</p><span className="text-[9px] uppercase tracking-[0.22em] text-[#87937d]">Việt phục / {String(index + 1).padStart(2, "0")}</span></div>
              </div>
            ))}
            <div className="book-page book-back flex flex-col items-center justify-center p-10 text-center"><span className="mb-6 font-editorial text-5xl italic text-[#d4ad63]">Hết một vòng</span><p className="max-w-[13rem] text-xs leading-6 text-[#b9b49d]">Nhưng câu chuyện về cội nguồn vẫn tiếp tục trong cách bạn mặc hôm nay.</p><span className="mt-8 text-[9px] uppercase tracking-[0.3em] text-[#87937d]">Cảm ơn đã lật mở</span></div>
          </HTMLFlipBook>
        </motion.div>
        <p className="mt-10 text-center text-[10px] uppercase tracking-[0.24em] text-[#87937d]">Kéo góc trang để lật · 12 câu chuyện di sản</p>
      </section>
    </main>
  );
}
