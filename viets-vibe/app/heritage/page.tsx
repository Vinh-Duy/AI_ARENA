import type { Metadata } from "next";
import { Header, Footer } from "../components/site";
import { Library } from "./library";
export const metadata: Metadata = {
  title: "Thư viện Việt phục | Việt’s Vibe",
  description:
    "Khám phá áo dài, áo ngũ thân, áo tấc, Nhật Bình, áo tứ thân và áo bà ba. Tìm hiểu đặc điểm, nguồn gốc và cách phối theo bối cảnh.",
};
export default function HeritagePage() {
  return (
    <>
      <Header />
      <main className="section-wrap library-page">
        <Library />
      </main>
      <Footer />
    </>
  );
}
