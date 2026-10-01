"use client";

import dynamic from "next/dynamic";

const VietPhucGallery = dynamic(() => import("./VietPhucGallery"), {
  ssr: false,
  loading: () => (
    <div
      style={{
        height: "100vh",
        width: "100%",
        background: "#1A120E",
        color: "#EAE4DC",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      ✦ Đang mở không gian 3D Việt phục...
    </div>
  ),
});

export default function VietPhucPage() {
  return <VietPhucGallery />;
}
