export type Backdrop = {
  id: string;
  name: string;
  image: string;
  description: string;
  credit: string;
  source: string;
  license: string;
  licenseUrl: string;
};
export const legacyPhotoBackdrops: Backdrop[] = [
  {
    id: "studio",
    name: "Phòng thử",
    image: "",
    description: "Nền trung tính để tập trung vào màu và phom áo.",
    credit: "",
    source: "",
    license: "",
    licenseUrl: "",
  },
  {
    id: "ho-guom",
    name: "Hồ Gươm",
    image: "/images/hanoi-ho-guom.jpg",
    description:
      "Mặt hồ xanh, cây và sắc đá trầm. Thử một tông sáng hoặc ấm để bản phối nổi bật.",
    credit: "xiquinhosilva",
    source:
      "https://commons.wikimedia.org/wiki/File:04489-Hanoi_(32954159775).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
  {
    id: "van-mieu",
    name: "Văn Miếu",
    image: "/images/hanoi-van-mieu.jpg",
    description:
      "Khuê Văn Các với gạch đỏ và cây xanh. Gợi ý biên tập: màu kem, xanh trầm; chú ý bối cảnh di tích.",
    credit: "Sai Gon Dep Lam",
    source: "https://commons.wikimedia.org/wiki/File:Khue_Van_Cac_2024.jpg",
    license: "CC BY 4.0",
    licenseUrl: "https://creativecommons.org/licenses/by/4.0/",
  },
  {
    id: "long-bien",
    name: "Cầu Long Biên",
    image: "/images/hanoi-long-bien.jpg",
    description:
      "Kết cấu thép, sắc xám và nâu. Thử màu áo ấm, phụ kiện gọn; nền chỉ dùng hình dung màu sắc.",
    credit: "David McKelvey",
    source:
      "https://commons.wikimedia.org/wiki/File:Long_Bien_Bridge,_Red_River,_Hanoi,_Vietnam_(6914609830).jpg",
    license: "CC BY 2.0",
    licenseUrl: "https://creativecommons.org/licenses/by/2.0/",
  },
];
export const backdrops: Backdrop[] = legacyPhotoBackdrops.map((backdrop) =>
  backdrop.image
    ? {
        ...backdrop,
        image: `/images/hanoi-${backdrop.id}-illustration.png`,
        description: `Bối cảnh minh họa 3D cách điệu. ${backdrop.description}`,
        credit: "Minh họa tạo bằng AI",
        source: "/credits#hanoi-illustrations",
        license: "",
        licenseUrl: "",
      }
    : backdrop,
);
export const findBackdrop = (id?: string | null) =>
  backdrops.find((b) => b.id === id) || backdrops[0];
