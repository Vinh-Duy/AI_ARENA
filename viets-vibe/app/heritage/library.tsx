"use client";
import { useState } from "react";
import Link from "next/link";
import { ArrowUpRight, BookOpen, Search, X } from "lucide-react";
import { Reveal } from "../components/site";
import { GarmentCard } from "../components/garment-card";
import { garments, regions, findGarments } from "../lib/heritage";
export function Library() {
  const [query, setQuery] = useState("");
  const [region, setRegion] = useState("Tất cả");
  const results = findGarments(query, region);
  return (
    <>
      <Reveal>
        <div className="library-intro">
          <div>
            <span className="eyebrow">
              THE HERITAGE ARCHIVE · {String(garments.length).padStart(2, "0")}{" "}
              CÂU CHUYỆN
            </span>
            <h1>
              Đi qua những miền.
              <br />
              <em>Gặp lại nếp xưa.</em>
            </h1>
            <p>
              Một thư viện nhỏ để hiểu chiếc áo bạn chọn.
              <br />
              Từ sự gần gũi thường ngày đến vẻ trang trọng của lễ phục.
            </p>
          </div>
          <div className="library-seal">
            <BookOpen size={31} strokeWidth={1} />
            <span>
              ĐỌC MỘT CHÚT.
              <br />
              YÊU THÊM MỘT CHÚT.
            </span>
          </div>
        </div>
      </Reveal>
      <div className="archive-controls">
        <label className="search-box">
          <Search size={18} />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Tìm tên áo, vùng miền…"
            aria-label="Tìm trong thư viện"
          />
          {query && (
            <button aria-label="Xóa từ khóa" onClick={() => setQuery("")}>
              <X size={16} />
            </button>
          )}
        </label>
        <div className="filter-tabs archive-tabs" aria-label="Lọc theo vùng">
          {regions.map((r) => (
            <button
              key={r}
              aria-pressed={region === r}
              className={region === r ? "selected" : ""}
              onClick={() => setRegion(r)}
            >
              {r}
            </button>
          ))}
        </div>
      </div>
      <div className="archive-results-meta">
        <span role="status">
          {results.length} trang phục{query && ` cho “${query}”`}
        </span>
        <span>Vùng gắn với câu chuyện, không giới hạn nơi mặc.</span>
      </div>
      {results.length ? (
        <div className="garment-grid archive-grid">
          {results.map((g) => (
            <Reveal key={g.id}>
              <GarmentCard garment={g} />
            </Reveal>
          ))}
        </div>
      ) : (
        <div className="empty-lookbook">
          <Search size={32} strokeWidth={1} />
          <h2>Chưa tìm thấy nếp áo này.</h2>
          <p>Thử tìm “ngũ thân”, “bà ba” hoặc chọn một vùng khác.</p>
          <button
            className="button button-dark"
            onClick={() => {
              setQuery("");
              setRegion("Tất cả");
            }}
          >
            Xem toàn bộ thư viện
          </button>
        </div>
      )}
      <aside className="archive-note">
        <BookOpen size={24} strokeWidth={1} />
        <div>
          <h2>Hiểu trước khi biến tấu.</h2>
          <p>
            Thư viện giới thiệu một số trang phục người Việt (Kinh), chưa đại
            diện cho toàn bộ trang phục các dân tộc Việt Nam. Ảnh đương đại và
            tư liệu lịch sử được ghi nguồn riêng.
          </p>
        </div>
        <Link href="/credits" className="text-link">
          Đọc cách chọn tư liệu <ArrowUpRight size={16} />
        </Link>
      </aside>
    </>
  );
}
