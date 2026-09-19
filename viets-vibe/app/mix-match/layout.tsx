import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Phòng phối đồ | Việt’s Vibe",
  description:
    "Chọn Việt phục, màu sắc và phụ kiện; phối trên ma-nơ-canh 3D xoay 360° và nhận gợi ý từ Google Gemini.",
};
export default function StudioLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
