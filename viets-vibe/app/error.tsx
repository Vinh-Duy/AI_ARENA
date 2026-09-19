"use client";
import Link from "next/link";
import { Header, Footer } from "./components/site";
export default function ErrorPage({
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  return (
    <>
      <Header />
      <main className="section-wrap error-page">
        <span className="eyebrow">MỘT NHỊP NGHỈ NHỎ</span>
        <h1>
          Cảm hứng
          <br />
          <em>đang gián đoạn.</em>
        </h1>
        <p>Trang này chưa tải được. Bạn thử lại hoặc trở về trang chủ nhé.</p>
        <div className="look-actions">
          <button onClick={retry} className="button button-orange">
            Thử lại
          </button>
          <Link href="/" className="button button-outline">
            Về trang chủ
          </Link>
        </div>
      </main>
      <Footer />
    </>
  );
}
