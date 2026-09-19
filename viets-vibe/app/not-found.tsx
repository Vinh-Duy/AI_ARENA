import Link from "next/link";
import { ArrowUpRight, Asterisk } from "lucide-react";
import { Header, Footer } from "./components/site";
export default function NotFound() {
  return (
    <>
      <Header />
      <main className="section-wrap error-page">
        <Asterisk size={50} strokeWidth={1} />
        <span className="eyebrow">404 · MỘT NGÃ RẼ KHÁC</span>
        <h1>
          Nếp áo này
          <br />
          <em>chưa có trong thư viện.</em>
        </h1>
        <p>
          Đường dẫn có thể đã thay đổi. Những câu chuyện khác vẫn đang chờ bạn.
        </p>
        <Link href="/heritage" className="button button-orange">
          Trở về thư viện <ArrowUpRight size={17} />
        </Link>
      </main>
      <Footer />
    </>
  );
}
