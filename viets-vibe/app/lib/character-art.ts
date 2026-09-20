import {
  characterSelection,
  type ArtSlot,
  type CharacterProps,
} from "./character-registry";

// A shared 600 × 900 artboard makes every layer interchangeable. These original
// vector illustrations are the working fallback, not claimed production RPG art.
const safeColor = (value: string) =>
  /^#[\da-f]{6}$/i.test(value) ? value : "#657961";
const path = (d: string, fill: string, extra = "") =>
  `<path d="${d}" fill="${fill}" ${extra}/>`;
const stroke = (d: string, color: string, width = 1, extra = "") =>
  path(
    d,
    "none",
    `stroke="${color}" stroke-width="${width}" stroke-linecap="round" stroke-linejoin="round" ${extra}`,
  );
const ellipse = (
  cx: number,
  cy: number,
  rx: number,
  ry: number,
  fill: string,
  extra = "",
) =>
  `<ellipse cx="${cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="${fill}" ${extra}/>`;

function face(male: boolean) {
  return `<g data-layer="portrait">
    ${ellipse(300, 137, 47, 62, "#282822")}
    ${!male ? ellipse(335, 99, 28, 29, "#292721") : ""}
    ${path("M279 184 L277 225 Q300 246 325 224 L322 183Z", "url(#skin)")}
    ${ellipse(259, 153, 7, 14, "url(#skin)")}${ellipse(341, 153, 7, 14, "url(#skin)")}
    ${path(male ? "M261 120 Q300 88 339 120 L338 169 Q329 194 309 205 L289 203 Q269 192 262 169Z" : "M262 120 Q300 88 338 120 L336 166 Q326 194 301 203 Q274 193 264 167Z", "url(#skin)")}
    ${path("M268 134 Q280 126 290 132 L290 135 Q279 131 268 137Z", "#514237")}
    ${path("M309 132 Q321 126 332 134 L332 137 Q321 131 309 135Z", "#514237")}
    ${path("M268 144 Q280 137 291 144 Q280 151 268 144", "#eee5d8")}
    ${path("M309 144 Q321 137 332 144 Q321 151 309 144", "#eee5d8")}
    ${ellipse(280, 144, 3.8, 4.1, "#454334")}${ellipse(320, 144, 3.8, 4.1, "#454334")}
    ${ellipse(281, 143, 1, 1, "#fff9e9")}${ellipse(321, 143, 1, 1, "#fff9e9")}
    ${stroke("M268 144 Q280 136 291 144 M309 144 Q321 136 332 144", "#5f493a", 1.5)}
    ${stroke("M301 147 L297 164 Q301 168 306 164", "#916b54", 1.1, 'opacity=".55"')}
    ${path("M287 179 Q295 175 300 177 Q305 175 314 179 Q300 189 287 179", male ? "#a87865" : "#b87970")}
    ${stroke("M288 179 Q301 182 313 179", "#784f48", 0.9)}
    ${stroke("M294 188 Q300 190 307 187", "#fff4dc", 1.5, 'opacity=".4"')}
    ${path(male ? "M255 132 Q243 91 269 80 Q300 62 334 89 Q352 105 343 140 L332 115 Q307 115 294 99 Q282 118 263 121Z" : "M256 139 Q245 104 269 83 Q298 64 331 90" + " Q353 111 343 146 L333 124 Q313 115 300 97 Q282 119 264 124Z", "url(#hair)")}
    ${stroke(male ? "M263 105 Q278 79 319 88 M274 111 Q290 89 329 99" : "M259 115 Q269 88 295 87 M308 90 Q331 102 341 128", "#8a7b61", 1.4, 'opacity=".42"')}
  </g>`;
}

export function characterSvg(
  props: CharacterProps,
  assets: Record<string, string> = {},
  background?: string,
) {
  const { avatar: a } = props;
  const selected = characterSelection(props);
  const male = selected.presentation === "masculine";
  const id = selected.id;
  const color = safeColor(props.color),
    accent = safeColor(a.accent),
    skin = safeColor(a.skin);
  const wide = id === "ao-tac" || id === "nhat-binh";
  const short = id === "ba-ba";
  const split = id === "tu-than";
  const waist = male ? 249 : 266;
  const right = 600 - waist;
  const hem = short ? 473 : 758;
  const body = `M263 220 Q248 225 231 239 L${waist} 368 Q${waist + 2} 400 242 464 L${short ? 235 : 203} ${hem} Q253 ${hem + 13} 298 ${hem - 1} L302 ${hem - 1} Q351 ${hem + 13} ${short ? 365 : 397} ${hem} L358 464 Q${right - 2} 400 ${right} 368 L369 239 Q349 226 326 220Z`;
  const sleeveLeft = wide
    ? "M237 237 Q217 249 203 284 L140 468 Q171 497 224 508 L259 326Z"
    : "M237 237 Q218 242 208 278 L173 475 L205 484 L254 316Z";
  const sleeveRight = wide
    ? "M363 237 Q383 249 397 284 L460 468 Q429 497 376 508 L341 326Z"
    : "M363 237 Q382 242 392 278 L427 475 L395 484 L346 316Z";
  const artLayer = (
    slot: ArtSlot,
    fallback: string,
    tint: string,
    key: string,
  ) => {
    const image = slot.src && assets[slot.src];
    // Only loader-produced data URLs enter the SVG; arbitrary markup never does.
    return image &&
      /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(image)
      ? `<g data-layer="${key}"><image href="${image}" width="600" height="900" ${slot.tint ? `filter="url(#tint-${tint})"` : ""}/></g>`
      : `<g data-layer="${key}">${fallback}</g>`;
  };
  const gradient = (name: string, c: string, contrast = 0.34) =>
    `<linearGradient id="${name}" x1="0" y1="0" x2="1" y2=".15"><stop stop-color="${c}"/><stop offset=".22" stop-color="${c}"/><stop offset=".42" stop-color="white" stop-opacity=".09"/><stop offset=".55" stop-color="${c}"/><stop offset="1" stop-color="black" stop-opacity="${contrast}"/></linearGradient>`;
  const tintFilter = (key: string, c: string) => {
    const rgb = [1, 3, 5].map((i) => parseInt(c.slice(i, i + 2), 16) / 255);
    return `<filter id="tint-${key}" color-interpolation-filters="sRGB"><feColorMatrix type="matrix" values="${rgb[0]} 0 0 0 0 0 ${rgb[1]} 0 0 0 0 0 ${rgb[2]} 0 0 0 0 0 1 0"/></filter>`;
  };
  const folds = Array.from({ length: 12 }, (_, i) => {
    const x = 217 + i * 15;
    return stroke(
      `M${285 + (i - 6) * 4} 396 Q${x + 16} 590 ${x} ${hem - 9}`,
      i % 3 === 0 ? "#ffffff" : "#16251d",
      i % 3 === 0 ? 3 : 2,
      `opacity="${i % 3 === 0 ? ".11" : ".14"}"`,
    );
  }).join("");
  const buttons = Array.from({ length: short ? 5 : 6 }, (_, i) =>
    ellipse(
      id === "ngu-than" || id === "ao-dai"
        ? 326 - Math.max(0, i - 1) * 3.5
        : 300,
      255 + i * 25,
      2.5,
      3,
      accent,
      'stroke="#fff1cb" stroke-width=".5"',
    ),
  ).join("");
  const floral = `<g fill="none" stroke="${accent}" stroke-width="1.2" opacity=".8">${Array.from(
    { length: 7 },
    (_, i) => {
      const y = 465 + i * 36;
      return `<path d="M244 ${y}q-18 -15 -22 0q4 15 22 0q18 -15 22 0q-4 15 -22 0m0 -12q-12 12 0 24q12 -12 0 -24"/><circle cx="244" cy="${y}" r="3"/>`;
    },
  ).join("")}</g>`;
  let garment = `${path(sleeveLeft, color)}${path(sleeveLeft, "url(#cloth)")}${path(sleeveRight, color)}${path(sleeveRight, "url(#cloth)")}
    ${stroke(wide ? "M144 468 Q174 489 224 497 M456 468 Q426 489 376 497" : "M176 466 L207 476 M424 466 L393 476", accent, wide ? 8 : 3)}
    ${path(body, color)}${path(body, "url(#cloth)")}
    <g clip-path="url(#dress-clip)">${folds}${a.fabric === "brocade" ? '<rect x="190" y="220" width="220" height="570" fill="url(#brocade)"/>' : ""}${a.fabric === "linen" ? '<rect x="190" y="220" width="220" height="570" fill="url(#weave)"/>' : ""}${id === "nhat-binh" ? floral : ""}</g>
    ${stroke(`M209 ${hem - 5} Q251 ${hem + 4} 298 ${hem - 7} M303 ${hem - 7} Q351 ${hem + 4} 391 ${hem - 5}`, accent, 1.5)}
    ${stroke("M215 290 Q228 323 216 359 M385 290 Q372 323 384 359 M181 449 L204 430 M419 449 L396 430", "#172820", 2, 'opacity=".16"')}`;
  if (id === "nhat-binh")
    garment +=
      path(
        "M266 219 L278 291 L323 291 L335 220 L318 216 L310 272 L290 272 L282 216Z",
        accent,
      ) +
      path("M281 222 L291 271 L309 271 L318 222Z", safeColor(a.inner)) +
      stroke("M280 282 L322 282", "#f9e8b4", 2) +
      stroke("M300 297 L300 749", accent, 2);
  else if (split)
    garment +=
      path(
        "M281 220 Q264 315 271 380 L238 738 L272 752 L300 402 L328 752 L361 738 L329 380 Q336 315 319 220 L312 352 L288 352Z",
        safeColor(a.inner),
      ) +
      path("M271 376 Q300 387 329 376 L331 394 Q300 404 269 394Z", accent) +
      path("M300 393 L316 405 L335 598 L309 581Z", accent);
  else {
    garment += buttons;
    if (a.collar && !short)
      garment +=
        path("M274 214 Q299 225 326 214 L326 238 Q300 249 274 238Z", color) +
        stroke(
          "M274 214 Q300 225 326 214 M326 219 Q344 251 341 286",
          accent,
          1.4,
        );
    if (short)
      garment +=
        path(
          "M278 220 L300 273 L322 220 L312 219 L300 251 L288 219Z",
          safeColor(a.inner),
        ) + stroke("M300 272 L300 470", accent, 1);
  }
  if (id === "nhat-binh" && !a.collar)
    garment = garment.replace(
      path(
        "M266 219 L278 291 L323 291 L335 220 L318 216 L310 272 L290 272 L282 216Z",
        accent,
      ),
      "",
    );
  const hands = `${path("M174 474 L170 502 Q169 516 176 527 L181 523 L178 509 L184 527 Q188 529 189 524 L185 506 L193 522 Q198 523 198 519 L191 501 L202 492 L205 481Z", "url(#skin)")}${path("M426 474 L430 502 Q431 516 424 527 L419 523 L422 509 L416 527 Q412 529 411 524 L415 506 L407 522 Q402 523 402 519 L409 501 L398 492 L395 481Z", "url(#skin)")}`;
  const base = face(male);
  const bottomShape =
    a.bottomType === "skirt"
      ? "M249 455 L350 455 L389 815 Q300 837 215 815Z"
      : "M252 455 L349 455 L359 814 Q336 827 310 815 L299 560 L290 815 Q265 827 241 813Z";
  const footwear =
    a.footwear === "sneakers"
      ? `${path("M239 809 Q264 815 283 807 L288 831 Q266 845 227 835 L226 825Z", safeColor(a.shoes))}${path("M313 807 Q337 815 357 809 L373 825 L371 836 Q336 845 310 831Z", safeColor(a.shoes))}${stroke("M227 834 L287 834 M312 834 L372 834", "#f5f1e5", 7)}`
      : `${path("M244 807 Q263 813 281 809 L284 834 Q261 844 229 833 Q231 819 244 807", safeColor(a.shoes))}${path("M317 809 Q337 813 353 807 Q367 819 371 833 Q339 844 316 834Z", safeColor(a.shoes))}`;
  const accessoryFallback: Record<string, string> = {
    "Khăn vấn": `${path("M252 111 Q250 72 290 67 Q332 60 350 107 L336 116 Q322 81 290 86 Q267 91 265 118Z", accent)}${stroke("M256 99 Q290 57 344 99 M258 108 Q294 66 340 109", "#fff2d0", 2, 'opacity=".35"')}`,
    "Nón lá": `${ellipse(300, 107, 110, 13, "#998451")}${path("M191 106 Q248 76 299 32 Q351 77 409 106 Q302 126 191 106", "url(#straw)")}${Array.from({ length: 6 }, (_, i) => stroke(`M${205 + i * 13} ${102 - i * 10} Q300 ${119 - i * 12} ${395 - i * 13} ${102 - i * 10}`, "#998258", 0.8)).join("")}${stroke("M226 113 Q246 227 300 209 Q354 227 374 113", safeColor(a.inner), 3)}`,
    "Ngọc trai": `<g>${Array.from({ length: 19 }, (_, i) => {
      const t = (i / 18) * Math.PI;
      return ellipse(
        300 + 32 * Math.cos(t),
        224 + 22 * Math.sin(t),
        3.2,
        3.2,
        "url(#pearl)",
      );
    }).join("")}</g>`,
    "Túi cói": `${path("M156 555 L164 501 Q184 481 203 501 L211 555", "none", 'stroke="#a58958" stroke-width="5"')}${path("M142 546 Q180 537 221 546 L215 606 Q181 616 148 606Z", "url(#straw)")}${Array.from({ length: 9 }, (_, i) => stroke(`M148 ${550 + i * 6} L216 ${550 + i * 6}`, "#b59866", 1)).join("")}${stroke("M146 548 L151 602 M158 546 L162 605 M172 544 L175 607 M187 544 L188 607 M201 546 L201 605 M215 548 L212 602", "#e4d2a5", 2)}`,
    "Quạt giấy": `<g transform="rotate(-18 417 519)">${path("M417 523 L365 455 Q414 418 465 455Z", safeColor(a.accent))}${path("M417 523 L370 458 Q414 427 460 458Z", "#f5e9cc", 'opacity=".9"')}${Array.from({ length: 9 }, (_, i) => stroke(`M417 523 L${370 + i * 11} ${458 - Math.sin((i / 8) * Math.PI) * 16}`, "#a58e60", 1)).join("")}${stroke("M417 519 L416 537", "#8b744e", 3)}</g>`,
  };
  const width = a.build === "slim" ? 0.95 : a.build === "broad" ? 1.09 : 1;
  const stature = 0.91 + ((a.height - 150) / 40) * 0.09;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
    <defs>
      ${gradient("cloth", color, a.fabric === "linen" ? 0.18 : 0.25)}
      <radialGradient id="skin" cx="36%" cy="30%" r="80%"><stop stop-color="#fff0d7"/><stop offset=".35" stop-color="${skin}"/><stop offset="1" stop-color="#76523e"/></radialGradient>
      <linearGradient id="hair"><stop stop-color="#181f1c"/><stop offset=".42" stop-color="#4b4537"/><stop offset="1" stop-color="#202421"/></linearGradient>
      <linearGradient id="straw" x2=".4" y2="1"><stop stop-color="#f9ebc5"/><stop offset="1" stop-color="#c4aa72"/></linearGradient>
      <radialGradient id="pearl" cx="30%" cy="25%"><stop stop-color="#ffffff"/><stop offset=".6" stop-color="#e9e0cb"/><stop offset="1" stop-color="#ac9e82"/></radialGradient>
      <radialGradient id="stage"><stop stop-color="#faf8ef"/><stop offset="1" stop-color="#e8e8dc"/></radialGradient>
      <radialGradient id="shadow"><stop stop-color="#334237" stop-opacity=".22"/><stop offset="1" stop-color="#334237" stop-opacity="0"/></radialGradient>
      <pattern id="brocade" width="26" height="36" patternUnits="userSpaceOnUse"><path d="M13 3 Q24 17 13 31 Q2 17 13 3Z M13 11 L18 17 L13 23 L8 17Z" fill="none" stroke="${accent}" stroke-width=".7" opacity=".36"/></pattern>
      <pattern id="weave" width="4" height="4" patternUnits="userSpaceOnUse"><path d="M0 1H4 M1 0V4" stroke="#fff" stroke-opacity=".08" stroke-width=".5"/></pattern>
      <clipPath id="dress-clip">${path(body, "white")}</clipPath>
      ${tintFilter("skin", skin)}${tintFilter("cloth", color)}${tintFilter("accent", accent)}
    </defs>
    <rect width="600" height="900" fill="url(#stage)"/>
    ${background && /^data:image\/(png|jpeg|webp);base64,[A-Za-z0-9+/=]+$/.test(background) ? `<image href="${background}" width="600" height="900" preserveAspectRatio="xMidYMid slice"/><rect width="600" height="900" fill="#f4efe4" opacity=".12"/>` : '<path d="M99 811V327a201 201 0 0 1 402 0v484" fill="none" stroke="#d6d9c9" stroke-width="1"/>'}
    ${ellipse(300, 844, 132, 21, "url(#shadow)")}
    <g transform="translate(300 838) scale(${width * stature} ${stature}) translate(-300 -838)">
      <g data-layer="footwear">${footwear}</g>
      <g data-layer="bottom">${path(bottomShape, safeColor(a.bottom))}${stroke("M275 480 Q267 662 262 811 M328 480 Q340 680 337 811", "#574d39", 2, 'opacity=".15"')}</g>
      ${artLayer(selected.base, base, "skin", "base")}
      <g data-layer="inner" clip-path="url(#dress-clip)">${path("M277 221 L323 221 L334 413 L266 413Z", safeColor(a.inner))}</g>
      ${artLayer(selected.art, garment, "cloth", "outfit")}
      <g data-layer="hands">${hands}</g>
      ${selected.accessories.map(([name, item]) => artLayer(item.art, accessoryFallback[name], "accent", `accessory-${Object.keys(accessoryFallback).indexOf(name)}`)).join("")}
    </g>
  </svg>`;
}
