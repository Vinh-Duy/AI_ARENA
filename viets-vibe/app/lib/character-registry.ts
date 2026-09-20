import type { Ref } from "react";
import type { AvatarConfig } from "./avatar";

export type CharacterMode = "2d" | "3d";
export type CharacterHandle = { thumbnail: () => string | undefined };
export type CharacterProps = {
  garment: string;
  color: string;
  extras: string[];
  avatar: AvatarConfig;
  backdrop?: string;
  ref?: Ref<CharacterHandle>;
};
export type ArtSlot = {
  /** Set src when an actual, aligned transparent asset is available. */
  src: string | null;
  placeholder: string;
  tint: boolean;
};
const slot = (path: string, tint = true): ArtSlot => ({
  src: null,
  placeholder: `/avatar/${path}.png`,
  tint,
});
const outfit = (id: string) => ({
  renderer3d: id,
  art: {
    feminine: slot(`outfits/${id}/feminine`),
    masculine: slot(`outfits/${id}/masculine`),
  },
  /** Exact hex variants override the tintable neutral artwork. */
  variants: {} as Record<
    string,
    Partial<Record<"feminine" | "masculine", ArtSlot>>
  >,
});
export const outfitRegistry = {
  "ao-dai": outfit("ao-dai"),
  "ao-tac": outfit("ao-tac"),
  "nhat-binh": outfit("nhat-binh"),
  "ngu-than": outfit("ngu-than"),
  "tu-than": outfit("tu-than"),
  "ba-ba": outfit("ba-ba"),
};
export type OutfitId = keyof typeof outfitRegistry;
export const baseRegistry = {
  feminine: slot("base/feminine/body"),
  masculine: slot("base/masculine/body"),
};
export const accessoryRegistry = {
  "Khăn vấn": { renderer3d: "Khăn vấn", art: slot("accessories/khan-van") },
  "Nón lá": { renderer3d: "Nón lá", art: slot("accessories/non-la", false) },
  "Ngọc trai": {
    renderer3d: "Ngọc trai",
    art: slot("accessories/ngoc-trai", false),
  },
  "Túi cói": { renderer3d: "Túi cói", art: slot("accessories/tui-coi", false) },
  "Quạt giấy": { renderer3d: "Quạt giấy", art: slot("accessories/quat-giay") },
};
export function characterSelection(props: CharacterProps) {
  const id: OutfitId = Object.hasOwn(outfitRegistry, props.garment)
    ? (props.garment as OutfitId)
    : "ao-dai";
  const presentation =
    props.avatar.presentation === "masculine" ? "masculine" : "feminine";
  const outfit = outfitRegistry[id];
  return {
    id,
    presentation,
    outfit,
    base: baseRegistry[presentation],
    art:
      outfit.variants[props.color.toLowerCase()]?.[presentation] ||
      outfit.art[presentation],
    accessories: Object.entries(accessoryRegistry).filter(([name]) =>
      props.extras.includes(name),
    ),
  };
}
