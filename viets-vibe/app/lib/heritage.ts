import type { AvatarConfig } from "./avatar";
const collection = [
  {
    id: "ao-dai",
    name: "Áo dài",
    region: "Ba miền",
    tag: "Biểu tượng Việt",
    image: "/images/hero.jpg",
    description: "Tà áo quen, một góc nhìn mới.",
    story:
      "Áo dài hiện đại phát triển từ những dạng áo dài truyền thống, với nhiều thay đổi về phom dáng trong thế kỷ XX. Hai tà áo mặc cùng quần dài tạo nên nét nhận diện quen thuộc.",
    note: "Giữ sự cân đối giữa tà áo và quần. Với lễ nghi hoặc không gian tín ngưỡng, ưu tiên chất liệu kín đáo và cách phối trang nhã.",
    source: "https://vietnam.travel/things-to-do/ao-dai-vietnam",
    sourceName: "Vietnam Tourism",
    palette: "#adc5c4",
  },
  {
    id: "ao-tac",
    name: "Áo tấc",
    region: "Huế",
    tag: "Nét xưa đương đại",
    image: "/images/ao-tac.jpg",
    description: "Một chút hoài niệm. Rất nhiều chất riêng.",
    story:
      "Áo tấc là dạng áo ngũ thân tay rộng, gắn với lễ phục truyền thống. Phần tay thụng và phom áo rộng là những đặc điểm cần giữ khi tìm hiểu hoặc tái hiện trang phục.",
    note: "Bản phối đời thường là gợi ý sáng tạo, không phải phục dựng lễ phục. Khi dự nghi lễ, tìm hiểu quy cách mặc và phụ kiện phù hợp với bối cảnh.",
    source:
      "https://huetourism.gov.vn/ao-tac-co-phuc-quy-dang-hoi-sinh/?pid=MjExMjB8Y3NkbGRs0",
    sourceName: "Sở Du lịch Huế",
    palette: "#b2a08b",
  },
  {
    id: "nhat-binh",
    name: "Nhật Bình",
    region: "Huế",
    tag: "Dấu ấn cung đình",
    image: "/images/nhat-binh-portrait.webp",
    description: "Mang một miền di sản trong từng nếp áo.",
    story:
      "Nhật Bình là trang phục của phụ nữ cung đình triều Nguyễn, nổi bật với cổ áo hình chữ nhật. Màu sắc, hoa văn và phụ kiện từng được quy định theo phẩm cấp.",
    note: "Không gán phẩm cấp lịch sử cho bản phối hiện đại. Với phục dựng cung đình, cần đối chiếu tư liệu về hoa văn, màu sắc và phụ kiện của từng thời kỳ.",
    source:
      "https://thegioidisan.vn/vi/ao-nhat-binh-di-san-van-hoa-quy-cua-co-do-hue.html",
    sourceName: "Tạp chí Thế giới Di sản",
    palette: "#d798ab",
  },
  {
    id: "ngu-than",
    name: "Áo ngũ thân",
    region: "Huế",
    tag: "Phong thái Việt",
    image: "/images/ngu-than.webp",
    description: "Năm thân áo, một dáng hình thanh nhã.",
    story:
      "Áo ngũ thân có cấu trúc năm thân, cổ đứng và hàng khuy cài lệch. Đây là một dạng áo dài truyền thống gắn với lịch sử trang phục thời Nguyễn, có cả kiểu dành cho nam và nữ. Áo ngũ thân là một tiền đề của áo dài hiện đại.",
    note: "Phân biệt áo ngũ thân tay chẽn với áo tấc tay rộng. Khi mặc, giữ hàng khuy và lớp áo trong ngay ngắn; cách phối hiện đại không thay thế quy cách lễ phục.",
    source: "https://vietnam.travel/things-to-do/ao-dai-vietnam",
    sourceName: "Vietnam Tourism",
    palette: "#297178",
  },
  {
    id: "tu-than",
    name: "Áo tứ thân",
    region: "Bắc Bộ",
    tag: "Duyên miền Kinh Bắc",
    image: "/images/tu-than.png",
    description: "Sắc áo hội làng, bước vào hôm nay.",
    story:
      "Áo tứ thân gắn với trang phục phụ nữ Bắc Bộ. Hai vạt trước có thể để mở hoặc buộc lại, kết hợp cùng lớp áo bên trong và dây lưng. Ngày nay, hình ảnh áo tứ thân thường xuất hiện trong lễ hội và biểu diễn văn hóa dân gian.",
    note: "Giữ sự hài hòa giữa áo khoác, lớp trong và phần thân dưới. Trang phục biểu diễn có thể được cách điệu; không mặc định mọi bộ sân khấu là mẫu phục dựng lịch sử.",
    source:
      "https://www.diendan.org/phe-binh-nghien-cuu/ao-tu-than-khan-mo-qua/AoTuThan-KhanMoQua-ed.pdf",
    sourceName: "Võ Quang Yến · Áo tứ thân, khăn mỏ quạ",
    palette: "#397075",
  },
  {
    id: "ba-ba",
    name: "Áo bà ba",
    region: "Nam Bộ",
    tag: "Mộc mạc phương Nam",
    image: "/images/ba-ba.jpg",
    description: "Giản dị như một buổi chiều miền Tây.",
    story:
      "Áo bà ba gắn bó với đời sống Nam Bộ, được cả nam và nữ sử dụng. Dáng áo ngắn, hàng khuy phía trước và cách mặc cùng quần dài phù hợp với sinh hoạt thường ngày. Có nhiều giả thuyết về nguồn gốc, vì vậy không nên gán cho áo một mốc ra đời duy nhất.",
    note: "Khăn rằn và nón lá là gợi ý phụ kiện theo bối cảnh, không phải yêu cầu bắt buộc. Tôn trọng đời sống văn hóa Nam Bộ, tránh biến trang phục thành khuôn mẫu gây cười về người địa phương.",
    source:
      "https://scov.gov.vn/ban-sac-van-hoa/ao-ba-ba-khan-ran-non-la-bo-ba-bat-ly-than-cua-nguoi-phu-nu-nam-bo.html",
    sourceName: "Ủy ban Nhà nước về người Việt Nam ở nước ngoài",
    palette: "#bda889",
  },
];

export type GarmentDetail = {
  regionGroup: "Ba miền" | "Miền Bắc" | "Miền Trung" | "Miền Nam";
  context: string;
  features: string[];
  wearing: string[];
  stylingTip: string;
  imageCredit: string;
  imageSource: string;
  imageOriginal: string;
  imageNote: string;
  objectPosition: string;
};
const details: Record<string, GarmentDetail> = {
  "ao-dai": {
    regionGroup: "Ba miền",
    context: "Từ học đường đến những ngày trọng đại",
    features: [
      "Hai tà áo dài",
      "Mặc cùng quần dài",
      "Phom dáng thay đổi qua thời gian",
    ],
    wearing: ["Chụp kỷ yếu", "Tết", "Dự lễ trang trọng"],
    stylingTip:
      "Giữ quần dài làm nền cho tà áo. Chọn giày bệt hoặc loafer gọn để dễ di chuyển, và chỉ thêm một phụ kiện nổi bật.",
    imageCredit: "Aaron Joel Santos / Vietnam Tourism",
    imageSource: "https://vietnam.travel/things-to-do/ao-dai-vietnam",
    imageOriginal:
      "https://image.vietnam.travel/sites/default/files/inline-images/Vietnam%20national%20costume.jpg",
    imageNote: "Ảnh áo dài đương đại trong không gian kiến trúc Việt.",
    objectPosition: "35% center",
  },
  "ao-tac": {
    regionGroup: "Miền Trung",
    context: "Nét trang trọng trong một phom áo rộng",
    features: [
      "Cấu trúc ngũ thân",
      "Tay áo rộng, thụng",
      "Gắn với bối cảnh lễ phục",
    ],
    wearing: ["Dự lễ trang trọng", "Lễ hội", "Tết"],
    stylingTip:
      "Để phom tay rộng là điểm nhấn. Chọn quần dài và phụ kiện nhỏ; trong nghi lễ, ưu tiên quy cách của nơi tổ chức.",
    imageCredit: "Hoa Nghiêm Việt Phục",
    imageSource:
      "https://hoanghiemvietphuc.com/san-pham/ao-tac-tron-truyen-thong-viet-phuc-phong-cach-co-trang/",
    imageOriginal:
      "https://hoanghiemvietphuc.com/wp-content/uploads/2025/08/Tim-hieu-chi-tiet-ve-Ao-tac-truyen-thong-Viet-Nam-4-1337x2048.jpg",
    imageNote: "Ảnh thực hành Việt phục hiện nay; không phải hiện vật lịch sử.",
    objectPosition: "center 32%",
  },
  "nhat-binh": {
    regionGroup: "Miền Trung",
    context: "Một dấu ấn của trang phục cung đình Huế",
    features: [
      "Cổ áo chữ nhật",
      "Hoa văn trang trí nổi bật",
      "Màu và phụ kiện có bối cảnh lịch sử",
    ],
    wearing: ["Lễ hội", "Tết", "Dự lễ trang trọng"],
    stylingTip:
      "Giữ phần cổ áo và hoa văn dễ nhìn. Phụ kiện nhỏ, quần hoặc lớp thân dưới đơn sắc giúp bản phối không bị rối.",
    imageCredit: "Hoa Nghiêm Việt Phục",
    imageSource:
      "https://hoanghiemvietphuc.com/san-pham/nhat-binh-hong-pastel-hoa-tiet-cung-dinh/",
    imageOriginal:
      "https://hoanghiemvietphuc.com/wp-content/uploads/2026/06/Nhat-Binh-hong-pastel-hoa-tiet-cung-dinh.webp",
    imageNote:
      "Mẫu Nhật Bình hồng pastel đương đại; không dùng để xác định phẩm cấp lịch sử.",
    objectPosition: "center 37%",
  },
  "ngu-than": {
    regionGroup: "Miền Trung",
    context: "Một lựa chọn cho cả nam và nữ",
    features: [
      "Năm thân áo",
      "Cổ đứng, khuy cài lệch",
      "Tay chẽn khác với tay áo tấc",
    ],
    wearing: ["Tết", "Lễ hội", "Chụp kỷ yếu"],
    stylingTip:
      "Phối quần dài màu sáng hoặc nâu trầm, giày gọn và quạt giấy. Để cổ áo, khuy cài và dáng áo là điểm nhấn chính.",
    imageCredit: "Hoa Nghiêm Việt Phục",
    imageSource:
      "https://hoanghiemvietphuc.com/san-pham/ao-ngu-than-nam-thanh-lam-cong-tu/",
    imageOriginal:
      "https://hoanghiemvietphuc.com/wp-content/uploads/2026/05/Ao-Ngu-Than-Nam-Thanh-Lam-Cong-Tu-1.webp",
    imageNote: "Mẫu ngũ thân nam đương đại trong không gian Huế.",
    objectPosition: "center 60%",
  },
  "tu-than": {
    regionGroup: "Miền Bắc",
    context: "Những lớp áo trong không gian hội làng",
    features: [
      "Hai vạt trước tách rời",
      "Phối lớp áo bên trong",
      "Dây lưng tạo điểm nhấn",
    ],
    wearing: ["Lễ hội", "Chụp kỷ yếu", "Tết"],
    stylingTip:
      "Phối lớp áo trong sáng màu với áo ngoài trầm hơn, giữ váy dài hoặc phần thân dưới kín đáo. Dây lưng nhỏ tạo điểm nhấn mà không che phom áo.",
    imageCredit:
      "Ảnh tham khảo đăng trên BBCosplay; tác giả chưa được xác minh",
    imageSource:
      "https://i.bbcosplay.com/news/mceu_87649668911704432593481.png",
    imageOriginal:
      "https://i.bbcosplay.com/news/mceu_87649668911704432593481.png",
    imageNote:
      "Ảnh phối tứ thân đương đại; không phải tư liệu phục dựng theo niên đại.",
    objectPosition: "center 35%",
  },
  "ba-ba": {
    regionGroup: "Miền Nam",
    context: "Gần gũi với nhịp sống phương Nam",
    features: [
      "Dáng áo ngắn",
      "Hàng khuy phía trước",
      "Thường kết hợp quần dài",
    ],
    wearing: ["Dạo phố", "Tết", "Chụp kỷ yếu"],
    stylingTip:
      "Thử quần suông, giày bệt và túi cói nhỏ. Chất vải nhẹ và phụ kiện vừa đủ giúp giữ tinh thần giản dị của áo bà ba.",
    imageCredit: "Ảnh đăng trên scov.gov.vn; bài viết ghi nguồn VOV",
    imageSource:
      "https://scov.gov.vn/ban-sac-van-hoa/ao-ba-ba-khan-ran-non-la-bo-ba-bat-ly-than-cua-nguoi-phu-nu-nam-bo.html",
    imageOriginal:
      "https://scov.gov.vn/upload/2005660/20210923/e3ef67e68b39cb0d9f01f6bfa319ed0b103824_pnnb.jpg",
    imageNote: "Áo bà ba kết hợp khăn rằn và nón lá trong hoạt động văn hóa.",
    objectPosition: "82% center",
  },
};
export const garments = collection.map((garment) => ({
  ...garment,
  ...details[garment.id],
}));
export type Garment = (typeof garments)[number];
export const regions = [
  "Tất cả",
  "Ba miền",
  "Miền Bắc",
  "Miền Trung",
  "Miền Nam",
];
export function normalizeSearch(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/đ/g, "d")
    .replace(/Đ/g, "D")
    .toLowerCase()
    .trim();
}
export function findGarments(query: string, region = "Tất cả") {
  const search = normalizeSearch(query);
  return garments.filter(
    (g) =>
      (region === "Tất cả" || g.regionGroup === region) &&
      normalizeSearch(
        `${g.name} ${g.region} ${g.regionGroup} ${g.tag} ${g.description}`,
      ).includes(search),
  );
}
export const colors = [
  { name: "Đỏ son", hex: "#ac4238", light: "#f1ded6" },
  { name: "Ngọc bích", hex: "#476859", light: "#e1e8dd" },
  { name: "Kem lụa", hex: "#decba9", light: "#f0e9db" },
  { name: "Hồng sen", hex: "#c78394", light: "#f3e3e7" },
  { name: "Lam ngọc", hex: "#7c9fae", light: "#e3eced" },
];
export const occasions = [
  "Dạo phố",
  "Chụp kỷ yếu",
  "Lễ hội",
  "Tết",
  "Dự lễ trang trọng",
];
export const vibes = ["Thanh lịch", "Tối giản", "Nàng thơ", "Cá tính"];
export const accessories = ["Quạt giấy", "Túi cói", "Ngọc trai", "Khăn vấn"];
export type StyleSuggestion = {
  tên_trang_phục: string;
  nguồn_gốc: string;
  gợi_ý_phối: string[];
  cảnh_báo_văn_hóa: string;
};
export type SavedLook = {
  id: string;
  garment: string;
  color: string;
  occasion: string;
  vibe: string;
  accessories: string[];
  result?: StyleSuggestion;
  avatar?: AvatarConfig;
  thumbnail?: string;
};
