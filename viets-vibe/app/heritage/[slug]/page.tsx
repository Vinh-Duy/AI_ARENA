import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, ArrowUpRight, Check, ShieldCheck } from "lucide-react";
import { garments } from "../../lib/heritage";
import { Header, Footer, Reveal } from "../../components/site";
import { GarmentCard } from "../../components/garment-card";
export const dynamicParams = false;
export function generateStaticParams() {
  return garments.map((g) => ({ slug: g.id }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const garment = garments.find((g) => g.id === slug);
  return {
    title: garment
      ? `${garment.name} — Câu chuyện & cách phối | Việt’s Vibe`
      : "Không tìm thấy trang phục",
    description: garment?.story,
  };
}
export default async function GarmentPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const garment = garments.find((g) => g.id === slug);
  if (!garment) notFound();
  const related = garments
    .filter((g) => g.id !== slug)
    .sort(
      (a, b) =>
        Number(b.regionGroup === garment.regionGroup) -
        Number(a.regionGroup === garment.regionGroup),
    )
    .slice(0, 3);
  return (
    <>
      <Header />
      <main className="section-wrap garment-detail">
        <Link className="text-link detail-back" href="/heritage">
          <ArrowLeft size={15} /> Trở về thư viện
        </Link>
        <div className="detail-layout">
          <Reveal className="detail-photo-column">
            <div className="detail-photo">
              <Image
                src={garment.image}
                alt={`${garment.name} — ${garment.imageNote}`}
                fill
                priority
                sizes="(max-width: 700px) 90vw, 45vw"
                style={{ objectPosition: garment.objectPosition }}
              />
              <span className="detail-image-label">
                {garment.region} / VIỆT PHỤC
              </span>
            </div>
            <p className="photo-credit">
              {garment.imageNote}
              <br />
              <a href={garment.imageSource} target="_blank" rel="noreferrer">
                Ảnh: {garment.imageCredit} ↗
              </a>
            </p>
          </Reveal>
          <Reveal className="detail-story" delay={0.08}>
            <span className="eyebrow">
              {garment.regionGroup} · {garment.tag}
            </span>
            <h1>
              {garment.name}
              <span>{garment.context}</span>
            </h1>
            <p className="detail-description">{garment.story}</p>
            <div className="detail-features">
              <h2>Nhận ra từ những điều nhỏ.</h2>
              {garment.features.map((feature) => (
                <p key={feature}>
                  <Check size={15} />
                  {feature}
                </p>
              ))}
            </div>
            <div className="detail-occasions">
              <span className="eyebrow">MỘT DỊP ĐỂ MẶC</span>
              <div>
                {garment.wearing.map((occasion) => (
                  <Link
                    key={occasion}
                    href={`/mix-match?${new URLSearchParams({ garment: garment.id, occasion })}`}
                  >
                    {occasion}
                    <ArrowUpRight size={12} />
                  </Link>
                ))}
              </div>
            </div>
            <Link
              href={`/mix-match?garment=${garment.id}`}
              className="button button-orange"
            >
              Phối {garment.name.toLowerCase()} theo chất riêng{" "}
              <ArrowUpRight size={17} />
            </Link>
          </Reveal>
        </div>
        <div className="detail-notes">
          <article>
            <span className="eyebrow">GỢI Ý ĐƯƠNG ĐẠI</span>
            <h2>Một cách bắt đầu.</h2>
            <p>{garment.stylingTip}</p>
            <span className="note-caption">
              Gợi ý phối của Việt’s Vibe, không phải quy cách phục dựng.
            </span>
          </article>
          <article className="detail-respect">
            <span className="eyebrow">
              <ShieldCheck size={16} /> GIỮ SỰ THẤU HIỂU
            </span>
            <h2>Đẹp đúng bối cảnh.</h2>
            <p>{garment.note}</p>
            <a href={garment.source} target="_blank" rel="noreferrer">
              Đọc tư liệu · {garment.sourceName} <ArrowUpRight size={13} />
            </a>
          </article>
        </div>
        <section className="related-section">
          <div className="section-heading">
            <div>
              <span className="eyebrow">CÒN NHỮNG CÂU CHUYỆN KHÁC</span>
              <h2>
                Tiếp tục <em>chạm vào di sản.</em>
              </h2>
            </div>
            <Link href="/heritage" className="text-link">
              Xem tất cả <ArrowUpRight size={16} />
            </Link>
          </div>
          <div className="garment-grid">
            {related.map((g) => (
              <GarmentCard key={g.id} garment={g} />
            ))}
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
