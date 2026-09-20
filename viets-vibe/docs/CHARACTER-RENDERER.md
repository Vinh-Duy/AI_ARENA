# Character renderer: 2D + 3D

The studio defaults to 2D and offers a visible **2D View / 3D View** switch. The parent studio retains the outfit, colors, avatar configuration and accessories; toggling only changes the presentation. Mode is intentionally local viewer state, not a new required field in old lookbooks or shared URLs. Opening a saved look starts in 2D.

## Files and responsibilities

| File                                    | Responsibility                                                                  |
| --------------------------------------- | ------------------------------------------------------------------------------- |
| `app/components/character-renderer.tsx` | Shared props/ref, optional controlled mode, toggle, lazy 3D import              |
| `app/components/character-2d.tsx`       | Load art, compose preview, PNG export and synchronous thumbnail                 |
| `app/lib/character-art.ts`              | Original SVG fallback art, layers, cloth shading, silhouettes and accessories   |
| `app/lib/character-registry.ts`         | Six outfit mappings, two presentations, five accessories and art slots          |
| `app/components/avatar-canvas.tsx`      | Existing Three.js renderer, softened studio lighting, camera and WebGL recovery |
| `public/avatar/`                        | Reserved art folders and asset contract                                         |

`CharacterRenderer` accepts `garment`, `color` (hex), `extras`, `avatar`, `backdrop`, and a ref exposing `thumbnail()`. It additionally supports `mode?: "2d" | "3d"` and `onModeChange`. When `mode` is supplied, the caller must update it in `onModeChange`. No Three.js runtime is mounted until 3D is selected; switching back disposes its existing resources.

## 2D composition

The shared 600×900 artboard composes background, contact shadow, footwear, bottoms, base character, inner wear, outer garment, hands and accessories. The base uses fixed female/male hair. The six fallback outfits have separate silhouettes, sleeves, collars and trims. Color, skin, inner/bottom/accent/shoe colors, bottom type, footwear, collar, build, height and fabric feed the illustration. Height changes overall staging proportionately, not a body measurement; 3D retains the more detailed regional height deformation.

The fallback is an illustrated concept, not photorealistic RPG art or an authenticated historical reconstruction. Production character quality requires commissioned/aligned artwork. The viewer includes restrained entry transitions, a neutral portrait stage, soft contact shadow, responsive controls and reduced-motion support.

Art slots default to `src: null`, so the app does not fetch missing placeholders. A valid local raster replaces its fallback layer. Failed files revert to the corresponding built-in illustration with a notice. Stale fetch/rasterization results are discarded. Failed backdrops disable export until a valid backdrop is selected. Preview, thumbnail and PNG are derived from the same self-contained SVG; export embeds raster assets, rather than depending on external URLs. The PNG includes an illustration disclaimer.

## Add finished art

1. Follow the pose, dimensions and anchors in [the asset contract](../public/avatar/README.md).
2. Place the file under `public/avatar/`.
3. Set `src` on that slot, for example `{ src: "/avatar/outfits/ao-dai/feminine.png", placeholder: "...", tint: true }`.
4. For a painted color variant, add an entry to that outfit's `variants`:

```ts
variants: {
  "#2c4a3e": {
    feminine: {
      src: "/avatar/outfits/ao-dai/feminine-jade.png",
      placeholder: "/avatar/outfits/ao-dai/feminine-jade.png",
      tint: false,
    },
  },
}
```

With no matching variant, the resolver chooses the presentation's neutral tintable art or its SVG fallback. Use lower-case six-digit hex keys. Maintain common pose/camera/lighting across layers. For material or collar variants of raster outfits, extend the registry/resolver to select a dedicated image; a baked image does not inherit vector-only garment details.

## Extend the catalog

New accessories need a canonical name in `heritage.ts`, an `accessoryRegistry` slot, and fallback definitions in `character-art.ts`/`mannequin.ts`. New outfits also need catalog/heritage data, a registry entry and render support in both builders. Existing validations and Gemini enum schemas use the shared catalog. Add artwork/fallback tests for the new item, including mode switches and lookbook restore.

## Check changes

```bash
npm run check
npm run build
npm run test:e2e
```

`tests/character.spec.ts` covers the default 2D viewer, six outfits, accessories, PNG/thumbnail, cross-mode configuration, mobile, WebGL failure and backdrop failure. Existing 3D tests explicitly select **3D View**. Inspect `test-results/character-2d-*.png` to review each silhouette.
