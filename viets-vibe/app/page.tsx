"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Check,
  Heart,
  MoveUpRight,
  Sparkles,
} from "lucide-react";
import { Header, Footer, Reveal, TranslationBoundary } from "./components/site";
import { garments, regions } from "./lib/heritage";
import { GarmentCard } from "./components/garment-card";
import { BrandMark } from "./components/brand-mark";

// Nạp động Không gian 3D để không làm nặng tốc độ tải trang ban đầu
const VietPhucGallery = dynamic(() => import("./viet-phuc/VietPhucGallery"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "620px",
        width: "100%",
        borderRadius: "24px",
        background: "#1A120E",
        color: "#EAE4DC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontSize: "15px",
        border: "1px solid rgba(213, 203, 183, 0.25)",
      }}
    >
      ✦ Đang mở hành lang 3D Việt phục...
    </div>
  ),
});

export default function Home() {
  const [filter, setFilter] = useState("Tất cả");
  const [showInline3D, setShowInline3D] = useState(false);

  return (
    <TranslationBoundary>
      <Header />
      <main>
        <section className="hero section-wrap" id="top">
          <Reveal className="hero-copy">
            <span className="eyebrow">
              <span className="live-dot" /> DI SẢN VIỆT, THẾ HỆ MỚI
            </span>
            <h1>
              Nếp xưa.
              <br />
              <em>Chất mới.</em>
              <span className="title-spark" aria-hidden="true">
                <BrandMark size={48} />
              </span>
            </h1>
            <p className="hero-description">
              Không chỉ mặc một bộ đồ.
              <br />
              Mặc một câu chuyện, kể theo cách của bạn.
            </p>
            <p className="hero-subtext">
              Khám phá Việt phục, remix cùng AI và tìm thấy
              <br className="desktop-break" /> phiên bản rất riêng của chính
              mình.
            </p>
            <div
              className="hero-actions"
              style={{ flexWrap: "wrap", gap: "12px" }}
            >
              <Link href="/mix-match" className="button button-primary">
                Bắt đầu phối đồ <ArrowUpRight size={19} />
              </Link>
              {/* NÚT MỚI 1: Mở thẳng Không gian trưng bày 3D toàn màn hình */}
              <Link href="/viet-phuc" className="button button-outline">
                Không gian 3D Việt phục <ArrowUpRight size={17} />
              </Link>
              <a href="#explore" className="text-link">
                Khám phá di sản <ArrowDown size={15} />
              </a>
            </div>
            <div className="hero-footnote">
              <span className="gemini-symbol">✦</span>
              <span>
                Sáng tạo cùng <strong>Google Gemini</strong>
              </span>
              <span className="tiny-divider" />
              <span>Chất Việt, không giới hạn.</span>
            </div>
          </Reveal>
          <Reveal className="hero-art" delay={0.15}>
            <div className="art-outline" />
            <div className="vertical-caption">
              HERITAGE REIMAGINED — EST. 2026
            </div>
            <div className="main-editorial">
              <Image
                src="/images/ao-tac.jpg"
                alt="Áo tấc màu nâu mộc, phối khăn vấn và quạt trong không gian truyền thống"
                fill
                priority
                sizes="(max-width: 700px) 80vw, 36vw"
              />
              <div className="editorial-gradient" />
              <div className="editorial-caption">
                <span>THE HERITAGE EDIT</span>
                <p>Nét xưa, cảm hứng mới.</p>
              </div>
            </div>
            <div className="mini-editorial">
              <Image
                src="/images/hero.jpg"
                alt="Tà áo dài xanh bên kiến trúc Việt"
                fill
                sizes="180px"
              />
              <span>Một chút đương đại ↗</span>
            </div>
            <div className="floating-label">
              <span className="floating-icon">
                <Sparkles size={19} />
              </span>
              <div>
                <strong>Truyền thống × Bạn</strong>
                <span>Biến tấu, vẫn đậm bản sắc</span>
              </div>
            </div>
            <div className="round-stamp">
              <BrandMark size={37} />
              <span>RẤT VIỆT. RẤT BẠN.</span>
            </div>
            <span className="photo-index">
              01 / HERITAGE <span>ÁO TẤC / HUẾ</span>
            </span>
          </Reveal>
        </section>

        <div className="ticker" aria-label="Tự hào bản sắc, tự do thể hiện">
          <div className="ticker-track">
            {Array.from({ length: 4 }, (_, i) => (
              <span key={i} aria-hidden={i > 0}>
                DI SẢN KHÔNG ĐỨNG YÊN <BrandMark /> PHONG CÁCH KHÔNG GIỚI HẠN{" "}
                <BrandMark /> RẤT VIỆT. RẤT BẠN. <BrandMark />
              </span>
            ))}
          </div>
        </div>

        <section id="explore" className="collection section-wrap">
          <Reveal>
            <div className="section-heading">
              <div>
                <span className="eyebrow">01 / CHẠM VÀO DI SẢN</span>
                <h2>
                  Mỗi nếp áo,
                  <br className="mobile-break" /> <em>một câu chuyện.</em>
                </h2>
              </div>
              <p>
                Hiểu điều mình mặc.
                <br />
                Yêu thêm điều mình là.
              </p>
            </div>

            {/* BANNER TƯƠNG TÁC MỚI: Cho phép bật 3D ngay tại trang chủ hoặc mở Fullscreen */}
            <div
              style={{
                marginBottom: "28px",
                padding: "20px 24px",
                borderRadius: "20px",
                background: "linear-gradient(135deg, #1f1612 0%, #2f2019 100%)",
                color: "#f5efe6",
                display: "flex",
                flexWrap: "wrap",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                border: "1px solid rgba(213, 203, 183, 0.2)",
              }}
            >
              <div>
                <span
                  className="eyebrow"
                  style={{
                    color: "#e09f3e",
                    marginBottom: "6px",
                    display: "inline-flex",
                  }}
                >
                  <span className="live-dot" /> TRẢI NGHIỆM TƯƠNG TÁC MỚI
                </span>
                <h3
                  style={{
                    margin: "4px 0",
                    fontSize: "1.25rem",
                    fontWeight: 600,
                  }}
                >
                  Hành lang 3D Việt Phục &amp; Không gian Soi Chi Tiết 360°
                </h3>
                <p style={{ margin: 0, fontSize: "0.9rem", opacity: 0.85 }}>
                  Bước vào hiên gỗ cổ truyền, ngắm tận mắt từng nếp Áo Giao
                  Lĩnh, Tứ Thân, Ngũ Thân, Áo Dài và Nhật Bình.
                </p>
              </div>
              <div style={{ display: "flex", gap: "10px", flexWrap: "wrap" }}>
                <button
                  type="button"
                  onClick={() => setShowInline3D((prev) => !prev)}
                  className="button button-outline"
                  style={{
                    color: "#f5efe6",
                    borderColor: "rgba(245, 239, 230, 0.4)",
                    cursor: "pointer",
                  }}
                >
                  {showInline3D
                    ? "Đóng khung 3D thu nhỏ"
                    : "Xem thử 3D tại đây"}
                </button>
                <Link href="/viet-phuc" className="button button-primary">
                  Vào Không gian 3D Toàn màn hình <ArrowUpRight size={17} />
                </Link>
              </div>
            </div>

            {/* KHUNG 3D NHÚNG TRỰC TIẾP (Hiện ra khi bấm "Xem thử 3D tại đây") */}
            {showInline3D && (
              <div
                style={{
                  marginBottom: "36px",
                  borderRadius: "24px",
                  overflow: "hidden",
                  border: "1px solid rgba(174, 68, 58, 0.3)",
                  boxShadow: "0 20px 50px rgba(0,0,0,0.25)",
                }}
              >
                <VietPhucGallery embedded />
              </div>
            )}

            <div className="collection-toolbar">
              <div className="filter-tabs" aria-label="Lọc trang phục">
                {regions.map((item) => (
                  <button
                    key={item}
                    onClick={() => setFilter(item)}
                    aria-pressed={filter === item}
                    className={filter === item ? "selected" : ""}
                  >
                    {item}
                    {item === "Tất cả" && (
                      <span>{String(garments.length).padStart(2, "0")}</span>
                    )}
                  </button>
                ))}
              </div>
              <span className="collection-count">
                BỘ SƯU TẬP VIỆT PHỤC <ArrowDown size={14} />
              </span>
            </div>
          </Reveal>

          <div className="garment-grid">
            {garments
              .filter(
                (item) => filter === "Tất cả" || item.regionGroup === filter,
              )
              .map((item, i) => (
                <Reveal key={item.id} delay={i * 0.07}>
                  <GarmentCard garment={item} />
                </Reveal>
              ))}
          </div>

          <div
            className="collection-bottom"
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "12px",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <p>Mỗi vùng một sắc áo. Mỗi người một cách kể.</p>
            <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
              <Link href="/viet-phuc" className="button button-dark">
                Bước vào Hành lang 3D <ArrowUpRight size={17} />
              </Link>
              <Link href="/heritage" className="button button-outline">
                Mở thư viện Việt phục <ArrowUpRight size={17} />
              </Link>
            </div>
          </div>
        </section>

        <section className="studio-teaser section-wrap">
          <Reveal className="studio-teaser-inner">
            <div className="teaser-art">
              <span className="eyebrow">YOUR NEXT FAVORITE LOOK</span>
              <div className="moodboard-photo">
                <Image
                  src="/images/editorial.jpg"
                  alt="Áo dài trắng và ô lụa trong khu vườn xanh"
                  fill
                  sizes="400px"
                />
                <span>the soft side of heritage.</span>
              </div>
              <div className="palette-paper">
                <span>BẢNG MÀU CỦA BẠN</span>
                <div>
                  {["#688073", "#d5cbb7", "#ae443a", "#d29a8a"].map((c) => (
                    <i key={c} style={{ background: c }} />
                  ))}
                </div>
                <small>Đương đại. Nhưng không phai bản sắc.</small>
              </div>
              <span className="art-doodle" aria-hidden="true">
                <BrandMark size={48} />
              </span>
            </div>
            <div className="teaser-copy">
              <span className="eyebrow">
                <Sparkles size={14} /> 02 / MIX, MATCH &amp; MAKE IT YOURS
              </span>
              <h2>
                Gu của bạn.
                <br />
                <em>AI đồng hành.</em>
              </h2>
              <p>
                Một chiếc áo quen, thêm màu bạn thích, một món phụ kiện bất ngờ.
                Để Gemini gợi mở những bản phối mang dấu ấn riêng.
              </p>
              <ul>
                <li>
                  <Check size={16} /> Chọn trang phục, màu sắc &amp; phong cách
                </li>
                <li>
                  <Check size={16} /> Nhận gợi ý phối cùng lưu ý văn hóa
                </li>
                <li>
                  <Check size={16} /> Lưu lại thành lookbook của riêng bạn
                </li>
              </ul>
              <Link href="/mix-match" className="button button-dark">
                Vào phòng phối đồ <ArrowUpRight size={18} />
              </Link>
              <span className="teaser-note">
                Không cần tài khoản. Cứ thỏa sức sáng tạo.
              </span>
            </div>
          </Reveal>
        </section>

        <section className="manifesto section-wrap">
          <Reveal>
            <span className="eyebrow">SÁNG TẠO CÓ HIỂU BIẾT</span>
            <h2>
              Đổi cách phối.
              <br />
              <em>Giữ điều làm nên bản sắc.</em>
            </h2>
            <div className="manifesto-bottom">
              <span className="manifesto-flower">
                <Heart size={25} strokeWidth={1} />
              </span>
              <p>
                Mỗi gợi ý đi cùng câu chuyện nguồn gốc và lưu ý văn hóa.
                <br />
                Để bạn tự do thể hiện, từ sự thấu hiểu và tôn trọng.
              </p>
              <Link href="/credits" className="text-link">
                Cách chúng mình chọn tư liệu <ArrowRight size={17} />
              </Link>
            </div>
          </Reveal>
        </section>

        <section className="closing">
          <span>TRUYỀN THỐNG LÀ ĐIỂM BẮT ĐẦU.</span>
          <Link href="/mix-match">
            Phần tiếp theo, <em>là bạn.</em>
            <MoveUpRight />
          </Link>
          <p>Thử một bản phối. Kể một câu chuyện mới.</p>
        </section>
      </main>
      <Footer />
    </TranslationBoundary>
  );
}
