"use client";
import dynamic from "next/dynamic";
import { useImperativeHandle, useRef, useState } from "react";
import { Box, ScanFace } from "lucide-react";
import Character2D from "./character-2d";
import {
  characterSelection,
  type CharacterHandle,
  type CharacterMode,
  type CharacterProps,
} from "../lib/character-registry";
import { useLanguage } from "./site";

const Character3D = dynamic(() => import("./avatar-canvas"), {
  ssr: false,
  loading: () => (
    <div className="avatar-loading" role="status">
      3D…
    </div>
  ),
});
type Props = CharacterProps & {
  mode?: CharacterMode;
  onModeChange?: (mode: CharacterMode) => void;
};

export default function CharacterRenderer({
  mode,
  onModeChange,
  ref,
  ...props
}: Props) {
  const [localMode, setLocalMode] = useState<CharacterMode>("2d");
  const selectedMode = mode ?? localMode;
  const activeRenderer = useRef<CharacterHandle>(null);
  const { language } = useLanguage();
  const selection = characterSelection(props);
  useImperativeHandle(ref, () => ({
    thumbnail: () => activeRenderer.current?.thumbnail(),
  }));
  function change(next: CharacterMode) {
    setLocalMode(next);
    onModeChange?.(next);
  }
  return (
    <section className="character-viewer" data-character-mode={selectedMode}>
      <div className="character-viewer-header" data-no-translate="">
        <div>
          <span className="eyebrow">VIETS VIBE / ATELIER</span>
          <p>
            {language === "en"
              ? "Your personal fitting room"
              : "Phòng thử của riêng bạn"}
          </p>
        </div>
        <div
          className="character-mode-switch"
          role="group"
          aria-label={
            language === "en" ? "Character view" : "Chế độ xem nhân vật"
          }
        >
          <button
            aria-pressed={selectedMode === "2d"}
            onClick={() => change("2d")}
          >
            <ScanFace size={16} />
            2D View
          </button>
          <button
            aria-pressed={selectedMode === "3d"}
            onClick={() => change("3d")}
          >
            <Box size={16} />
            3D View
          </button>
        </div>
      </div>
      {selectedMode === "2d" ? (
        <Character2D {...props} ref={activeRenderer} />
      ) : (
        <Character3D
          {...props}
          garment={selection.outfit.renderer3d}
          extras={selection.accessories.map(([, a]) => a.renderer3d)}
          ref={activeRenderer}
        />
      )}
    </section>
  );
}
