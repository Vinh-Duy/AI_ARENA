export const skinTones = [
  "#f0c9ab",
  "#dca77e",
  "#b77d56",
  "#865336",
  "#593b2c",
];
export type AvatarConfig = {
  build: "slim" | "regular" | "broad";
  presentation: "neutral" | "feminine" | "masculine";
  height: number;
  skin: string;
  inner: string;
  bottom: string;
  accent: string;
  shoes: string;
  bottomType: "trousers" | "skirt";
  footwear: "flats" | "sneakers";
  collar: boolean;
};
export const defaultAvatar: AvatarConfig = {
  build: "regular",
  presentation: "neutral",
  height: 165,
  skin: skinTones[1],
  inner: "#f4e8ce",
  bottom: "#eee2c9",
  accent: "#b99857",
  shoes: "#3f342e",
  bottomType: "trousers",
  footwear: "flats",
  collar: true,
};
const hex = (v: unknown): v is string =>
  typeof v === "string" && /^#[0-9a-f]{6}$/i.test(v);
export function validAvatar(v: unknown): v is AvatarConfig {
  if (!v || typeof v !== "object") return false;
  const a = v as AvatarConfig;
  return (
    ["slim", "regular", "broad"].includes(a.build) &&
    ["neutral", "feminine", "masculine"].includes(a.presentation) &&
    Number.isFinite(a.height) &&
    a.height >= 150 &&
    a.height <= 190 &&
    [a.skin, a.inner, a.bottom, a.accent, a.shoes].every(hex) &&
    ["trousers", "skirt"].includes(a.bottomType) &&
    ["flats", "sneakers"].includes(a.footwear) &&
    typeof a.collar === "boolean"
  );
}
export function avatarFromQuery(value: string | null): AvatarConfig {
  try {
    const a: unknown = JSON.parse(value || "null");
    return validAvatar(a) ? a : { ...defaultAvatar };
  } catch {
    return { ...defaultAvatar };
  }
}
export function culturalChecks(id: string, occasion: string, a: AvatarConfig) {
  const notes: { title: string; text: string }[] = [];
  if (!a.collar && ["nhat-binh", "ngu-than", "ao-dai", "ao-tac"].includes(id))
    notes.push({
      title: "Đang giản lược chi tiết nhận diện",
      text:
        id === "nhat-binh"
          ? "Cổ chữ nhật là đặc điểm nổi bật của Nhật Bình. Bỏ phần viền cổ khiến mockup khó nhận diện; bật lại khi giới thiệu trang phục truyền thống."
          : "Bạn đã bỏ phần cổ áo trong mockup. Nếu giới thiệu phom truyền thống, hãy giữ chi tiết cổ phù hợp và đối chiếu ảnh tư liệu.",
    });
  if (id === "tu-than" && a.bottomType === "trousers")
    notes.push({
      title: "Bản phối cách tân",
      text: "Áo tứ thân thường được giới thiệu cùng váy trong bối cảnh hội làng Bắc Bộ. Phối quần ở đây là lựa chọn đương đại, không nên trình bày như phục dựng lịch sử.",
    });
  if (occasion === "Dự lễ trang trọng" && a.footwear === "sneakers")
    notes.push({
      title: "Kiểm tra quy định nơi dự lễ",
      text: "Sneaker là lựa chọn phối hiện đại. Đơn vị tổ chức có thể yêu cầu giày và cách mặc riêng; đây là lưu ý bối cảnh, không phải kết luận vi phạm văn hóa.",
    });
  if (id === "nhat-binh")
    notes.push({
      title: "Không suy phẩm cấp từ màu",
      text: "Bảng màu và họa tiết của mockup mang tính minh họa; không đại diện phẩm cấp hay quy cách lễ phục cung đình.",
    });
  return notes;
}
export function paletteHarmony(values: string[]) {
  const hues = values
    .map((value) => {
      const rgb = [1, 3, 5].map(
        (i) => parseInt(value.slice(i, i + 2), 16) / 255,
      );
      const max = Math.max(...rgb),
        min = Math.min(...rgb),
        d = max - min;
      if (d < 0.13 || max < 0.22) return null;
      const [r, g, b] = rgb;
      const hue =
        max === r
          ? ((g - b) / d) % 6
          : max === g
            ? (b - r) / d + 2
            : (r - g) / d + 4;
      return (hue * 60 + 360) % 360;
    })
    .filter((x): x is number => x !== null);
  if (hues.length < 2) return "Nền trung tính · một màu làm điểm nhấn";
  const gaps = hues.flatMap((h, i) =>
    hues
      .slice(i + 1)
      .map((k) => Math.min(Math.abs(h - k), 360 - Math.abs(h - k))),
  );
  if (Math.max(...gaps) < 45) return "Các sắc gần nhau · tổng thể nhẹ nhàng";
  if (gaps.some((g) => g > 150)) return "Tương phản rõ · chọn một màu chủ đạo";
  return "Nhiều nhóm sắc · thử tiết chế phụ kiện";
}
