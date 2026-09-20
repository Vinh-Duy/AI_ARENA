import * as T from "three";
import type { AvatarConfig } from "./avatar";
import { clothMaterial, fitMannequin, sculptHead } from "./mannequin-detail";

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
  const skin = new T.MeshPhysicalMaterial({
      color: a.skin,
      roughness: 0.82,
      specularIntensity: 0.3,
      clearcoat: 0,
      clearcoatRoughness: 0.7,
    }),
    cloth = clothMaterial(color, a.fabric || "silk"),
    lining = clothMaterial(a.inner, "silk"),
    bottom = clothMaterial(a.bottom, a.fabric === "linen" ? "linen" : "silk"),
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
      uvs: number[] = [],
      indices: number[] = [];
    const n = 64;
    rings.forEach(([y, rx, rz], row) => {
      for (let i = 0; i <= n; i++) {
        const t = start + (span * i) / n;
        const weight = 1 - row / (rings.length - 1);
        const fold =
          1 +
          (Math.sin(t * 12 + y * 0.7) + 0.35 * Math.sin(t * 23 - y)) *
            pleat *
            weight;
        positions.push(Math.cos(t) * rx * fold, y, Math.sin(t) * rz * fold);
        uvs.push(i / n, row / (rings.length - 1));
        if (row && i) {
          const k = row * (n + 1) + i;
          indices.push(k, k - 1, k - n - 2, k, k - n - 2, k - n - 1);
        }
      }
    });
    const g = new T.BufferGeometry();
    g.setAttribute("position", new T.Float32BufferAttribute(positions, 3));
    g.setAttribute("uv", new T.Float32BufferAttribute(uvs, 2));
    g.setIndex(indices);
    g.computeVertexNormals();
    return mesh(g, mat);
  }
  const feminine = a.presentation !== "masculine";
  const shoulder =
    a.presentation === "masculine" ? 0.37 : feminine ? 0.3 : 0.335;
  const waist = feminine ? 0.215 : 0.255;
  // Mannequin: calm head, neck, arms and complete underbody, with no gender gating of garments.
  root.add(sculptHead(skin, feminine));
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
      [side * shoulder, 1.87, 0],
      [side * 0.53, 1.25, 0.03],
      0.062,
      0.042,
    );
    oval(skin, side * 0.535, 1.195, 0.035, 0.044, 0.074, 0.025);
    for (let finger = 0; finger < 4; finger++) {
      const x = side * (0.509 + finger * 0.015);
      bar(
        skin,
        [x, 1.16, 0.041],
        [x + side * 0.008, 1.079 + Math.abs(1.5 - finger) * 0.014, 0.054],
        0.008,
        0.006,
      );
      oval(
        skin,
        x + side * 0.008,
        1.079 + Math.abs(1.5 - finger) * 0.014,
        0.054,
        0.006,
        0.008,
        0.006,
      );
    }
    bar(
      skin,
      [side * 0.505, 1.2, 0.047],
      [side * 0.486, 1.144, 0.069],
      0.013,
      0.008,
    );
    const foot = oval(shoe, side * 0.14, 0.105, 0.067, 0.081, 0.055, 0.162);
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
      const leg = fabric(
        bottom,
        [
          [0.165, 0.12, 0.115],
          [0.52, 0.117, 0.115],
          [0.78, 0.125, 0.12],
          [1.16, 0.14, 0.15],
        ],
        0,
        Math.PI * 2,
        0.023,
      );
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
  const stitching = material(
    new T.Color(color).multiplyScalar(0.72).getStyle(),
    1,
  );
  function seam(points: number[][], radius = 0.0025) {
    return mesh(
      new T.TubeGeometry(
        new T.CatmullRomCurve3(
          points.map((p) => new T.Vector3(...(p as [number, number, number]))),
        ),
        40,
        radius,
        5,
        false,
      ),
      stitching,
    );
  }
  for (const side of [-1, 1]) {
    seam(
      [
        [side * 0.106, 2.046, 0.09],
        [side * (shoulder - 0.075), 1.958, 0.134],
        [side * (shoulder + 0.013), 1.81, 0.153],
        [side * (shoulder + 0.005), 1.72, 0.139],
      ],
      0.002,
    );
  }
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
      fabric(cloth, skirtRings, 0.045, Math.PI - 0.09, 0.033);
      fabric(cloth, skirtRings, Math.PI + 0.045, Math.PI - 0.09, 0.033);
    }
  } else
    fabric(cloth, [
      [0.98, 0.315, 0.215],
      [1.14, 0.299, 0.203],
    ]);
  for (const side of [-1, 1]) {
    // Flared ceremonial sleeves, or fitted everyday sleeves, follow the same arm pose.
    const start = [side * (shoulder - 0.015), 1.875, 0];
    const end = [side * 0.51, 1.31, 0.015];
    oval(
      cloth,
      side * (shoulder - 0.025),
      1.885,
      0,
      wide ? 0.17 : 0.12,
      0.135,
      wide ? 0.165 : 0.119,
    );
    const sleeve = bar(
      cloth,
      start,
      end,
      wide ? 0.19 : 0.109,
      wide ? 0.225 : 0.078,
    );
    const oldGeometry = sleeve.geometry;
    const length = new T.Vector3(...end).distanceTo(new T.Vector3(...start));
    sleeve.geometry = new T.CylinderGeometry(
      wide ? 0.225 : 0.067,
      wide ? 0.17 : 0.118,
      length,
      48,
      20,
      true,
    );
    const sleevePositions = sleeve.geometry.attributes.position;
    for (let i = 0; i < sleevePositions.count; i++) {
      const y = sleevePositions.getY(i),
        t = (y + length / 2) / length;
      const angle = Math.atan2(
        sleevePositions.getZ(i),
        sleevePositions.getX(i),
      );
      const fold =
        1 +
        Math.sin(angle * 8 + t * 2) * 0.045 * Math.sin(Math.PI * t) +
        Math.sin(t * 35 + angle * 0.7) *
          0.035 *
          Math.exp(-Math.pow((t - 0.57) / 0.22, 2));
      sleevePositions.setXYZ(
        i,
        sleevePositions.getX(i) * fold,
        y,
        sleevePositions.getZ(i) * fold,
      );
    }
    sleeve.geometry.computeVertexNormals();
    oldGeometry.dispose();
    // A narrow fabric cuff follows the sleeve axis instead of a floating trim ring.
    const cuff = mesh(
      new T.CylinderGeometry(
        wide ? 0.225 : 0.071,
        wide ? 0.222 : 0.073,
        0.026,
        48,
        1,
        true,
      ),
      cloth,
      ...(end as [number, number, number]),
    );
    cuff.quaternion.copy(sleeve.quaternion);
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
  if (extras.includes("Nón lá")) {
    const straw = clothMaterial("#d4bd83", "linen");
    const ribs = material("#987443", 0.94);
    const hat = mesh(
      new T.ConeGeometry(0.365, 0.235, 96, 12, true),
      straw,
      0,
      2.57,
      0,
    );
    hat.name = "non-la";
    // Open underside, fine concentric bamboo rings and a fabric chin strap.
    for (let i = 1; i <= 9; i++) {
      const radius = (0.365 * i) / 9;
      const ring = mesh(
        new T.TorusGeometry(radius, 0.0018, 5, 96),
        ribs,
        0,
        2.6875 - (0.235 * i) / 9,
        0,
      );
      ring.rotation.x = Math.PI / 2;
    }
    for (const side of [-1, 1]) {
      const curve = new T.CatmullRomCurve3([
        new T.Vector3(side * 0.22, 2.45, 0),
        new T.Vector3(side * 0.13, 2.23, 0.075),
        new T.Vector3(0, 2.19, 0.08),
      ]);
      mesh(new T.TubeGeometry(curve, 24, 0.006, 6, false), lining);
    }
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
  fitMannequin(root, a);
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
  const textures = new Set<T.Texture>();
  materials.forEach((m) => {
    for (const value of Object.values(m))
      if (value instanceof T.Texture) textures.add(value);
    m.dispose();
  });
  textures.forEach((t) => t.dispose());
}
