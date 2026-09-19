import fs from "node:fs";
import path from "node:path";
import ts from "typescript";
const source = fs.readFileSync("app/lib/heritage.ts", "utf8");
const compiled = ts.transpileModule(source, {
  compilerOptions: { module: ts.ModuleKind.ES2022 },
}).outputText;
const { garments, occasions } = await import(
  `data:text/javascript;base64,${Buffer.from(compiled).toString("base64")}`
);
const ids = new Set();
for (const garment of garments) {
  if (ids.has(garment.id)) throw new Error(`Duplicate garment: ${garment.id}`);
  ids.add(garment.id);
  for (const key of [
    "name",
    "story",
    "note",
    "regionGroup",
    "stylingTip",
    "imageCredit",
    "imageNote",
    "objectPosition",
  ]) {
    if (typeof garment[key] !== "string" || !garment[key].trim())
      throw new Error(`Missing ${key}: ${garment.id}`);
  }
  for (const key of ["source", "imageSource", "imageOriginal"]) {
    if (new URL(garment[key]).protocol !== "https:")
      throw new Error(`Invalid ${key}: ${garment.id}`);
  }
  if (
    !garment.image.startsWith("/images/") ||
    !fs.statSync(path.join("public", garment.image)).isFile()
  )
    throw new Error(`Missing image: ${garment.id}`);
  if (
    garment.features.length < 3 ||
    !garment.wearing.length ||
    garment.wearing.some((occasion) => !occasions.includes(occasion))
  )
    throw new Error(`Invalid details: ${garment.id}`);
}
console.log(
  `Content check passed: ${garments.length} garments, local images, source links, details and occasions.`,
);
