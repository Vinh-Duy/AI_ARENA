import * as T from "three";
import type { AvatarConfig } from "./avatar";

// Procedural illustration, not a historical reconstruction or a tailoring model.
export function buildMannequin(
  id: string,
  color: string,
  extras: string[],
  a: AvatarConfig,
) {
  const root = new T.Group();
  const material = (c: string, roughness = 0.72) =>
    new T.MeshStandardMaterial({ color: c, roughness, side: T.DoubleSide });
  const skin = material(a.skin),
    cloth = material(color),
    lining = material(a.inner),
    bottom = material(a.bottom),
    trim = material(a.accent, 0.42),
    shoe = material(a.shoes);
  function mesh(
    geometry: T.BufferGeometry,
    mat: T.Material,
    x = 0,
    y = 0,
    z = 0,
  ) {
    const m = new T.Mesh(geometry, mat);
    m.position.set(x, y, z);
    m.castShadow = true;
    m.receiveShadow = true;
    root.add(m);
    return m;
  }
  function oval(
    mat: T.Material,
    x: number,
    y: number,
    z: number,
    sx: number,
    sy: number,
    sz: number,
  ) {
    const m = mesh(new T.SphereGeometry(1, 32, 24), mat, x, y, z);
    m.scale.set(sx, sy, sz);
    return m;
  }
  function bar(
    mat: T.Material,
    start: number[],
    end: number[],
    r1: number,
    r2 = r1,
  ) {
    const p = new T.Vector3(...start),
      q = new T.Vector3(...end),
      dir = q.clone().sub(p);
    const m = mesh(new T.CylinderGeometry(r2, r1, dir.length(), 24), mat);
    m.position.copy(p).add(q).multiplyScalar(0.5);
    m.quaternion.setFromUnitVectors(new T.Vector3(0, 1, 0), dir.normalize());
    return m;
  }
  // Elliptical rings make continuous fabric surfaces. Partial rings leave actual openings.
  function fabric(
    mat: T.Material,
    rings: number[][],
    start = 0,
    span = Math.PI * 2,
    pleat = 0,
  ) {
    const curve = new T.CatmullRomCurve3(
      rings.map(([y, rx, rz]) => new T.Vector3(rx, y, rz)),
      false,
      "centripetal",
    );
    if (rings.length > 2)
      rings = curve.getPoints(36).map((p) => [p.y, p.x, p.z]);
    const positions: number[] = [],
      indices: number[] = [];
    const n = 64;
    rings.forEach(([y, rx, rz], row) => {
      for (let i = 0; i <= n; i++) {
        const t = start + (span * i) / n;
        const fold = 1 + Math.sin(t * 16) * pleat * (1 - row / rings.length);
        positions.push(Math.cos(t) * rx * fold, y, Math.sin(t) * rz * fold);
        if (row && i) {
          const k = row * (n + 1) + i;
          indices.push(k, k - 1, k - n - 2, k, k - n - 2, k - n - 1);
        }
      }
    });
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
    g.setIndex(indices);
    g.computeVertexNormals();
    return mesh(g, mat);
  }
  const feminine = a.presentation === "feminine";
  const shoulder =
    a.presentation === "masculine" ? 0.37 : feminine ? 0.3 : 0.335;
  const waist = feminine ? 0.215 : 0.255;
  // Mannequin: calm head, neck, arms and complete underbody, with no gender gating of garments.
  oval(skin, 0, 2.38, 0, 0.155, 0.205, 0.145);
  bar(skin, [0, 2.03, 0], [0, 2.24, 0], 0.079);
  const torso = fabric(skin, [
    [1.03, 0.26, 0.15],
    [1.34, waist, 0.13],
    [1.77, shoulder, 0.18],
    [2.03, 0.16, 0.1],
  ]);
  torso.scale.set(0.85, 1, 0.8);
  for (const side of [-1, 1]) {
    bar(skin, [side * 0.14, 0.2, 0], [side * 0.15, 1.11, 0], 0.065, 0.12);
    bar(
      skin,
      [side * shoulder, 1.94, 0],
      [side * 0.53, 1.25, 0.03],
      0.085,
      0.058,
    );
    oval(skin, side * 0.535, 1.18, 0.035, 0.06, 0.11, 0.045);
    const foot = oval(shoe, side * 0.14, 0.125, 0.067, 0.09, 0.073, 0.175);
    if (a.footwear === "sneakers") {
      oval(lining, side * 0.14, 0.084, 0.07, 0.096, 0.028, 0.183);
      for (let j = 0; j < 3; j++)
        bar(
          lining,
          [side * 0.14 - 0.045, 0.184 - j * 0.006, 0.09 + j * 0.024],
          [side * 0.14 + 0.045, 0.184 - j * 0.006, 0.09 + j * 0.024],
          0.005,
        );
    }
    foot.name = "footwear";
  }
  if (a.bottomType === "skirt")
    fabric(
      bottom,
      [
        [0.21, 0.43, 0.28],
        [0.65, 0.36, 0.23],
        [1.22, 0.275, 0.18],
      ],
      0,
      Math.PI * 2,
      0.045,
    );
  else
    for (const side of [-1, 1]) {
      const leg = fabric(bottom, [
        [0.21, 0.12, 0.115],
        [0.7, 0.13, 0.125],
        [1.16, 0.14, 0.15],
      ]);
      leg.position.x = side * 0.142;
    }
  const underlayer = fabric(lining, [
    [0.98, 0.279, 0.18],
    [1.4, waist + 0.025, 0.16],
    [1.83, shoulder + 0.01, 0.195],
    [2.015, 0.12, 0.12],
  ]);
  underlayer.scale.set(0.9, 1, 0.85);
  const wide = id === "ao-tac" || id === "nhat-binh";
  const open = id === "tu-than" || id === "nhat-binh";
  const short = id === "ba-ba";
  const topRings = [
    [1.14, 0.299, 0.203],
    [1.37, waist + (wide ? 0.075 : 0.036), 0.18],
    [1.79, shoulder + 0.035, 0.213],
    [1.98, shoulder - 0.035, 0.14],
    [2.06, 0.107, 0.108],
  ];
  if (open) fabric(cloth, topRings, Math.PI * 0.64, Math.PI * 1.72);
  else fabric(cloth, topRings);
  if (!short) {
    const hem = id === "tu-than" ? 0.38 : id === "ngu-than" ? 0.4 : 0.29;
    const skirtRings = [
      [hem, wide ? 0.48 : 0.38, wide ? 0.29 : 0.24],
      [0.73, 0.35, 0.23],
      [1.14, 0.299, 0.203],
    ];
    if (open) fabric(cloth, skirtRings, Math.PI * 0.64, Math.PI * 1.72, 0.025);
    else {
      fabric(cloth, skirtRings, 0.08, Math.PI - 0.16, 0.017);
      fabric(cloth, skirtRings, Math.PI + 0.08, Math.PI - 0.16, 0.017);
    }
  } else
    fabric(cloth, [
      [0.98, 0.315, 0.215],
      [1.14, 0.299, 0.203],
    ]);
  for (const side of [-1, 1]) {
    // Flared ceremonial sleeves, or fitted everyday sleeves, follow the same arm pose.
    const start = [side * (shoulder - 0.01), 1.89, 0];
    const end = [side * 0.51, 1.31, 0.015];
    oval(
      cloth,
      side * (shoulder - 0.015),
      1.87,
      0,
      wide ? 0.19 : 0.123,
      0.17,
      wide ? 0.19 : 0.125,
    );
    const sleeve = bar(
      cloth,
      start,
      end,
      wide ? 0.19 : 0.109,
      wide ? 0.225 : 0.078,
    );
    const oldGeometry = sleeve.geometry;
    sleeve.geometry = new T.CylinderGeometry(
      wide ? 0.225 : 0.078,
      wide ? 0.19 : 0.109,
      new T.Vector3(...end).distanceTo(new T.Vector3(...start)),
      40,
      1,
      true,
    );
    oldGeometry.dispose();
    if (id === "nhat-binh")
      for (let i = 0; i < 3; i++) {
        bar(
          i % 2 ? lining : trim,
          [side * (0.497 + i * 0.005), 1.35 + i * 0.025, 0.014],
          [side * (0.502 + i * 0.005), 1.367 + i * 0.025, 0.014],
          0.225 - i * 0.006,
        );
      }
  }
  if (a.collar) {
    if (id === "nhat-binh") {
      for (const side of [-1, 1])
        bar(
          trim,
          [side * 0.103, 2.025, 0.12],
          [side * 0.103, 1.55, 0.214],
          0.022,
        );
      bar(trim, [-0.103, 1.55, 0.214], [0.103, 1.55, 0.214], 0.022);
    } else if (id === "tu-than" || short) {
      for (const side of [-1, 1])
        bar(lining, [side * 0.09, 2.025, 0.125], [0, 1.75, 0.225], 0.013);
    } else
      fabric(cloth, [
        [2.035, 0.109, 0.11],
        [2.13, 0.101, 0.1],
      ]);
  }
  if (id === "tu-than") {
    fabric(trim, [
      [1.23, 0.31, 0.215],
      [1.31, 0.3, 0.207],
    ]);
    for (const side of [-1, 1]) {
      const ribbon = mesh(
        new T.BoxGeometry(0.06, 0.58, 0.012),
        trim,
        side * 0.078,
        0.96,
        0.25,
      );
      ribbon.rotation.z = side * 0.09;
    }
  }
  if (["ngu-than", "ao-dai", "ba-ba", "ao-tac"].includes(id)) {
    for (let i = 0; i < 5; i++)
      oval(
        trim,
        short ? 0 : 0.105 + i * 0.025,
        1.99 - i * 0.105,
        0.21,
        0.013,
        0.013,
        0.012,
      );
  }
  if (extras.includes("Khăn vấn")) {
    const hat = mesh(
      new T.TorusGeometry(0.163, 0.043, 16, 64),
      trim,
      0,
      2.49,
      0,
    );
    hat.rotation.x = Math.PI / 2;
  }
  if (extras.includes("Ngọc trai")) {
    for (let i = 0; i < 24; i++) {
      const t = (Math.PI * 2 * i) / 24;
      oval(
        lining,
        Math.cos(t) * 0.15,
        1.98 - Math.sin(t) * 0.1,
        Math.sin(t) * 0.205,
        0.016,
        0.016,
        0.016,
      );
    }
  }
  if (extras.includes("Túi cói")) {
    const bag = mesh(
      new T.CylinderGeometry(0.125, 0.1, 0.23, 32),
      trim,
      -0.55,
      0.96,
      0.055,
    );
    bag.scale.z = 0.6;
    const handle = mesh(
      new T.TorusGeometry(0.085, 0.012, 8, 32),
      trim,
      -0.55,
      1.13,
      0.055,
    );
    handle.scale.x = 0.75;
  }
  if (extras.includes("Quạt giấy")) {
    const fan = new T.Group();
    root.add(fan);
    fan.position.set(0.53, 1.24, 0.1);
    fan.rotation.z = -0.5;
    const shape = new T.Shape();
    shape.moveTo(0, 0);
    shape.absarc(0, 0, 0.26, 0.1, Math.PI - 0.1, false);
    shape.lineTo(0, 0);
    fan.add(new T.Mesh(new T.ShapeGeometry(shape), lining));
    for (let i = 0; i < 9; i++) {
      const t = 0.1 + ((Math.PI - 0.2) * i) / 8;
      const rib = bar(
        trim,
        [0, 0, 0.008],
        [Math.cos(t) * 0.255, Math.sin(t) * 0.255, 0.008],
        0.003,
      );
      root.remove(rib);
      fan.add(rib);
    }
  }
  root.scale.set(
    a.build === "slim" ? 0.87 : a.build === "broad" ? 1.17 : 1,
    a.height / 165,
    a.build === "broad" ? 1.1 : 1,
  );
  return root;
}
export function disposeModel(group: T.Object3D) {
  const materials = new Set<T.Material>();
  group.traverse((o) => {
    if (o instanceof T.Mesh) {
      o.geometry.dispose();
      (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) =>
        materials.add(m),
      );
    }
  });
  materials.forEach((m) => m.dispose());
}
