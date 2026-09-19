import {
  accessories,
  colors,
  garments,
  type StyleSuggestion,
} from "./heritage";
import type { AvatarConfig } from "./avatar";

export type StylingLayers = Pick<
  AvatarConfig,
  "inner" | "bottom" | "accent" | "shoes" | "bottomType" | "footwear" | "collar"
>;
export type OutfitRecommendation = {
  garment: string;
  color: string;
  accessories: string[];
  layers: StylingLayers;
};
export function validLayers(value: unknown): value is StylingLayers {
  if (!value || typeof value !== "object") return false;
  const a = value as StylingLayers;
  return (
    [a.inner, a.bottom, a.accent, a.shoes].every(
      (c) => typeof c === "string" && /^#[a-f0-9]{6}$/i.test(c),
    ) &&
    ["trousers", "skirt"].includes(a.bottomType) &&
    ["flats", "sneakers"].includes(a.footwear) &&
    typeof a.collar === "boolean"
  );
}
export function validRecommendation(
  value: unknown,
): value is OutfitRecommendation {
  if (!value || typeof value !== "object") return false;
  const r = value as OutfitRecommendation;
  return (
    garments.some((g) => g.id === r.garment) &&
    colors.some((c) => c.name === r.color) &&
    Array.isArray(r.accessories) &&
    r.accessories.length <= 4 &&
    r.accessories.every((a) => accessories.includes(a)) &&
    validLayers(r.layers)
  );
}
export function validSuggestion(value: unknown): value is StyleSuggestion {
  if (!value || typeof value !== "object") return false;
  const r = value as StyleSuggestion;
  return (
    [r.tên_trang_phục, r.nguồn_gốc, r.cảnh_báo_văn_hóa].every(
      (s) => typeof s === "string" && s.length <= 4000,
    ) &&
    Array.isArray(r.gợi_ý_phối) &&
    r.gợi_ý_phối.length >= 1 &&
    r.gợi_ý_phối.length <= 8 &&
    r.gợi_ý_phối.every((s) => typeof s === "string" && s.length <= 1500) &&
    (r.nhận_xét === undefined ||
      (typeof r.nhận_xét === "string" && r.nhận_xét.length <= 3000)) &&
    (r.lý_do === undefined ||
      (typeof r.lý_do === "string" && r.lý_do.length <= 3000)) &&
    (r.bản_phối === undefined || validRecommendation(r.bản_phối))
  );
}
export const recommendationSchema = {
  type: "object",
  properties: {
    garment: { type: "string", enum: garments.map((g) => g.id) },
    color: { type: "string", enum: colors.map((c) => c.name) },
    accessories: {
      type: "array",
      items: { type: "string", enum: accessories },
      maxItems: 4,
    },
    layers: {
      type: "object",
      properties: {
        inner: { type: "string" },
        bottom: { type: "string" },
        accent: { type: "string" },
        shoes: { type: "string" },
        bottomType: { type: "string", enum: ["trousers", "skirt"] },
        footwear: { type: "string", enum: ["flats", "sneakers"] },
        collar: { type: "boolean" },
      },
      required: [
        "inner",
        "bottom",
        "accent",
        "shoes",
        "bottomType",
        "footwear",
        "collar",
      ],
    },
  },
  required: ["garment", "color", "accessories", "layers"],
};
