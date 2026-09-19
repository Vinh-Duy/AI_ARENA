import type { Metadata } from "next";
export const metadata: Metadata = {
  title: "Lookbook của bạn | Việt’s Vibe",
  description:
    "Lưu, so sánh và mang theo những bản phối Việt phục của riêng bạn.",
};
export default function LookbookLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
