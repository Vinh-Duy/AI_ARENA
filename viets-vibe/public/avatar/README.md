# Character artwork

The app works without any raster files in this directory: it renders original layered SVG fallback illustrations. `.gitkeep` files reserve the future art folders. No missing placeholder URLs are fetched.

Use transparent PNG or WebP, **600 × 900** (or a proportional 1200 × 1800 export), on the same front-facing artboard. Keep empty space; do not crop each item to its bounds. The feet sit at y=838, head center at (300,145), neck near y=220 and hands near (185,500)/(415,500). Female hair is a fixed low bun; male hair is fixed and side-parted.

Expected paths:

```text
base/feminine/body.png
base/masculine/body.png
outfits/ao-dai/feminine.png
outfits/ao-dai/masculine.png
outfits/ao-tac/{feminine,masculine}.png
outfits/nhat-binh/{feminine,masculine}.png
outfits/ngu-than/{feminine,masculine}.png
outfits/tu-than/{feminine,masculine}.png
outfits/ba-ba/{feminine,masculine}.png
accessories/khan-van.png
accessories/non-la.png
accessories/ngoc-trai.png
accessories/tui-coi.png
accessories/quat-giay.png
```

These paths are conventions, not required files. Activate an existing file by setting the corresponding `src` in `app/lib/character-registry.ts`; changing `placeholder` alone does not activate it. Only local PNG/JPEG/WebP under `/avatar/` or `/images/` are loaded. Keep each file below 12 MB; aim below 1 MB for mobile. Assets must have usage rights appropriate to your release.

For tintable slots, use neutral grayscale art with shading and set `tint: true`. Its RGB is multiplied by the selected skin/clothing/accent color. For fully painted, fixed-color variants, set `tint: false` and register the exact hex variant. Fine highlights and dark seams belong in the art. Transparent areas let the other clothing layers show through.

Base art replaces the fallback body/head/hair; hands remain a separate fallback layer. Outfit art replaces the entire fallback outer garment, including its generated collar, folds and embroidery. A single baked PNG cannot reflect fabric/collar changes: keep `src: null` for the fully configurable fallback until you provide dedicated art variants and extend the resolver for those options. Bottoms, inner wear and shoes remain configurable vector layers.

Art direction: refined Vietnamese fashion illustration, realistic-stylized face, soft light from upper left, consistent pose, elegant drape, detailed fabrics and restrained trim. Avoid copying a specific game character. Decorative fallback motifs do not represent historical rank or an authenticated reconstruction.

See [renderer guide](../../docs/CHARACTER-RENDERER.md) for architecture, variants, export and extension examples.
