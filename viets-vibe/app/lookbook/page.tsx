"use client";
import { useMemo, useState, useSyncExternalStore } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowUpRight, Bookmark, Plus, Trash2 } from "lucide-react";
import { Footer, Header, Reveal } from "../components/site";
import { LookbookTools } from "../components/lookbook-tools";
import { colors, garments, type SavedLook } from "../lib/heritage";
import {
  parseLooks,
  writeLooks,
  subscribeLooks,
  getLooksSnapshot,
  getServerLooksSnapshot,
} from "../lib/lookbook";
export default function Lookbook() {
  const raw = useSyncExternalStore(
    subscribeLooks,
    getLooksSnapshot,
    getServerLooksSnapshot,
  );
  const loaded = raw !== null;
  const stored = useMemo(() => {
    try {
      return { looks: parseLooks(raw || "[]"), error: "" };
    } catch {
      return {
        looks: [],
        error:
          "Chưa thể đọc dữ liệu đã lưu. Hãy kiểm tra quyền lưu trữ của trình duyệt; dữ liệu hiện tại chưa bị thay đổi.",
      };
    }
  }, [raw]);
  const looks = stored.looks;
  const [deleted, setDeleted] = useState<SavedLook | null>(null);
  const [error, setError] = useState("");
  function remove(id: string) {
    try {
      const removed = looks.find((l) => l.id === id);
      writeLooks(looks.filter((l) => l.id !== id));
      setDeleted(removed || null);
    } catch {
      setError("Chưa thể cập nhật lookbook. Bạn thử lại nhé.");
    }
  }
  return (
    <>
      <Header active="lookbook" />
      <main className="lookbook-page section-wrap">
        <Reveal>
          <div className="studio-heading">
            <div>
              <span className="eyebrow">THE PERSONAL COLLECTION</span>
              <h1>
                Một chút <em>rất bạn.</em>
              </h1>
              <p>Những bản phối đã lưu, những câu chuyện chưa kể.</p>
            </div>
            <Link href="/mix-match" className="button button-orange">
              <Plus size={17} /> Tạo bản phối mới
            </Link>
          </div>
        </Reveal>
        <p className="storage-note">
          Lưu trên trình duyệt này · {looks.length}/30 bản phối
        </p>
        {(error || stored.error) && (
          <p role="alert" className="status-message">
            {error || stored.error}
          </p>
        )}
        {loaded && !stored.error && <LookbookTools looks={looks} />}
        {deleted && (
          <div className="undo-message" role="status">
            Đã xóa bản phối.{" "}
            <button
              onClick={() => {
                try {
                  writeLooks(
                    [
                      deleted,
                      ...looks.filter((l) => l.id !== deleted.id),
                    ].slice(0, 30),
                  );
                  setDeleted(null);
                } catch {
                  setError("Chưa thể khôi phục bản phối.");
                }
              }}
            >
              Hoàn tác
            </button>
          </div>
        )}
        {!loaded ? (
          <p className="page-loading">Đang mở lookbook…</p>
        ) : looks.length ? (
          <div className="garment-grid saved-grid">
            {looks.map((look) => {
              const garment = garments.find((g) => g.id === look.garment)!;
              const color = colors.find((c) => c.name === look.color)!;
              const query = new URLSearchParams({
                garment: look.garment,
                color: look.color,
                occasion: look.occasion,
                vibe: look.vibe,
                extras: look.accessories.join(","),
              });
              if (look.avatar) query.set("avatar", JSON.stringify(look.avatar));
              return (
                <article className="saved-card" key={look.id}>
                  <Link className="saved-image" href={`/mix-match?${query}`}>
                    <Image
                      src={look.thumbnail || garment.image}
                      unoptimized={!!look.thumbnail}
                      style={{
                        objectPosition: look.thumbnail
                          ? "center"
                          : garment.objectPosition,
                        objectFit: look.thumbnail ? "contain" : "cover",
                        background: look.thumbnail ? "#eae6dc" : undefined,
                      }}
                      alt={
                        look.thumbnail
                          ? `Mockup 3D ${garment.name}`
                          : garment.name
                      }
                      fill
                      sizes="(max-width: 700px) 90vw, 30vw"
                    />
                    <span className="image-tag">{look.occasion}</span>
                    <span className="card-arrow">
                      <ArrowUpRight />
                    </span>
                  </Link>
                  <div className="saved-card-copy">
                    <span className="eyebrow">
                      {look.vibe} <i style={{ backgroundColor: color.hex }} />
                    </span>
                    <h2>{look.result?.["tên_trang_phục"] || garment.name}</h2>
                    <p>
                      {look.color} ·{" "}
                      {look.accessories.join(" + ") || "Tối giản phụ kiện"}
                    </p>
                    {look.result && (
                      <details>
                        <summary>Xem gợi ý đã lưu</summary>
                        <ul>
                          {look.result["gợi_ý_phối"].map((tip, i) => (
                            <li key={i}>{tip}</li>
                          ))}
                        </ul>
                        <p>{look.result["cảnh_báo_văn_hóa"]}</p>
                      </details>
                    )}
                    <div className="saved-actions">
                      <Link className="text-link" href={`/mix-match?${query}`}>
                        Phối tiếp <ArrowUpRight size={15} />
                      </Link>
                      <button
                        className="icon-button"
                        aria-label={`Xóa bản phối ${garment.name}`}
                        onClick={() => remove(look.id)}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="empty-lookbook">
            <Bookmark size={42} strokeWidth={1} />
            <h2>Chương đầu còn để ngỏ.</h2>
            <p>Lưu một bản phối yêu thích để bắt đầu bộ sưu tập của bạn.</p>
            <Link href="/mix-match" className="button button-dark">
              Tìm chất riêng <ArrowUpRight size={17} />
            </Link>
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
