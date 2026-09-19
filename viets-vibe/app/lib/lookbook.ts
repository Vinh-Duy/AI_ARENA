import { validAvatar } from "./avatar";
import {
  accessories,
  colors,
  garments,
  occasions,
  vibes,
  type SavedLook,
} from "./heritage";
const key = "viets-vibe-lookbook-v1";
export function readLooks(): SavedLook[] {
  return parseLooks(localStorage.getItem(key) || "[]");
}
export function parseLooks(value: string): SavedLook[] {
  const raw: unknown = JSON.parse(value);
  if (!Array.isArray(raw)) return [];
  return raw.filter(
    (l): l is SavedLook =>
      l &&
      typeof l === "object" &&
      typeof l.id === "string" &&
      garments.some((g) => g.id === l.garment) &&
      colors.some((c) => c.name === l.color) &&
      occasions.includes(l.occasion) &&
      vibes.includes(l.vibe) &&
      Array.isArray(l.accessories) &&
      l.accessories.every(
        (a: unknown) => typeof a === "string" && accessories.includes(a),
      ) &&
      (!l.avatar || validAvatar(l.avatar)) &&
      (!l.thumbnail ||
        (typeof l.thumbnail === "string" &&
          l.thumbnail.length < 300_000 &&
          /^data:image\/jpeg;base64,[A-Za-z0-9+/=]+$/.test(l.thumbnail))) &&
      (!l.result ||
        (typeof l.result === "object" &&
          typeof l.result["tên_trang_phục"] === "string" &&
          typeof l.result["nguồn_gốc"] === "string" &&
          typeof l.result["cảnh_báo_văn_hóa"] === "string" &&
          Array.isArray(l.result["gợi_ý_phối"]) &&
          l.result["gợi_ý_phối"].every((s: unknown) => typeof s === "string"))),
  );
}
export function writeLooks(looks: SavedLook[]) {
  localStorage.setItem(key, JSON.stringify(looks));
  window.dispatchEvent(new Event("lookbook-changed"));
}
export function subscribeLooks(callback: () => void) {
  window.addEventListener("storage", callback);
  window.addEventListener("lookbook-changed", callback);
  return () => {
    window.removeEventListener("storage", callback);
    window.removeEventListener("lookbook-changed", callback);
  };
}
export function getLooksSnapshot(): string {
  try {
    return localStorage.getItem(key) || "[]";
  } catch {
    return "unavailable";
  }
}
export function getServerLooksSnapshot(): null {
  return null;
}
