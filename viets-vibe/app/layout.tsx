import type { Metadata, Viewport } from "next";
import { Be_Vietnam_Pro, Playfair_Display } from "next/font/google";
import "./globals.css";
import { LanguageProvider } from "./components/site";
import { RouteScroll } from "./components/route-scroll";
const sansFont = Be_Vietnam_Pro({
  variable: "--font-body",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});
const editorialFont = Playfair_Display({
  variable: "--font-heading",
  subsets: ["latin", "vietnamese"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});
export const metadata: Metadata = {
  title: "Việt’s Vibe — Nếp xưa. Chất mới.",
  description:
    "Khám phá Việt phục, phối màu và phụ kiện theo chất riêng. Sáng tạo cùng Google Gemini, từ sự thấu hiểu văn hóa Việt.",
  icons: { icon: "/icon.svg" },
};
export const viewport: Viewport = { themeColor: "#f8f6f0" };
export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="vi"
      data-scroll-behavior="smooth"
      className={`${sansFont.variable} ${editorialFont.variable}`}
    >
      <body>
        <LanguageProvider>{children}</LanguageProvider>
        <RouteScroll />
      </body>
    </html>
  );
}
