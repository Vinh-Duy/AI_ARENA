import * as T from "three";
import type { AvatarConfig } from "./avatar";

// Authored mannequin sculpture: fixed hairstyles and quiet, sculpted facial features.
export function sculptHead(skin: T.Material, feminine: boolean) {
  const group = new T.Group();
  group.name = feminine ? "female-fixed-bun" : "male-fixed-side-part";
  group.position.y = 2.38;
  const hair = new T.MeshPhysicalMaterial({
    color: "#241d1a",
    roughness: 0.48,
    sheen: 0.35,
    sheenColor: new T.Color("#665042"),
  });
  const feature = new T.MeshStandardMaterial({
    color: "#78574b",
    roughness: 0.85,
  });
  const strand = new T.MeshStandardMaterial({
    color: "#49382d",
    roughness: 0.7,
  });
  function ellipsoid(mat: T.Material, p: number[], s: number[]) {
    const m = new T.Mesh(new T.SphereGeometry(1, 48, 32), mat);
    m.position.set(...(p as [number, number, number]));
    m.scale.set(...(s as [number, number, number]));
    m.castShadow = true;
    m.receiveShadow = true;
    group.add(m);
    return m;
  }
  function line(points: number[][], mat: T.Material, radius = 0.0018) {
    const curve = new T.CatmullRomCurve3(
      points.map((p) => new T.Vector3(...(p as [number, number, number]))),
    );
    const m = new T.Mesh(new T.TubeGeometry(curve, 32, radius, 6, false), mat);
    group.add(m);
  }
  const face = ellipsoid(skin, [0, 0, 0], [1, 1, 1]);
  const vertices = face.geometry.attributes.position;
  for (let i = 0; i < vertices.count; i++) {
    const x = vertices.getX(i),
      y = vertices.getY(i),
      z = vertices.getZ(i);
    const jaw = y < -0.15 ? 1 - (-y - 0.15) * (feminine ? 0.29 : 0.17) : 1;
    const xx = x * (feminine ? 0.147 : 0.155) * jaw,
      yy = y * 0.198;
    let zz = z * 0.139;
    if (z > 0) {
      // Continuous nose bridge, cheeks and brow, not separate primitive shapes.
      zz +=
        0.04 *
        Math.exp(-Math.pow(xx / 0.02, 2) - Math.pow((yy + 0.017) / 0.042, 2));
      zz +=
        0.01 *
        Math.exp(-Math.pow(xx / 0.033, 2) - Math.pow((yy - 0.031) / 0.05, 2));
      zz +=
        0.008 *
        Math.exp(
          -Math.pow((Math.abs(xx) - 0.065) / 0.035, 2) -
            Math.pow((yy + 0.045) / 0.033, 2),
        );
    }
    vertices.setXYZ(i, xx, yy, zz);
  }
  face.geometry.computeVertexNormals();
  for (const side of [-1, 1]) {
    ellipsoid(skin, [side * 0.146, -0.02, -0.008], [0.022, 0.041, 0.016]);
    line(
      [
        [side * 0.029, 0.014, 0.142],
        [side * 0.056, 0.01, 0.135],
        [side * 0.083, 0.019, 0.12],
      ],
      feature,
      0.0014,
    );
    line(
      [
        [side * 0.028, 0.039, 0.141],
        [side * 0.056, 0.045, 0.135],
        [side * 0.086, 0.039, 0.116],
      ],
      hair,
      0.0024,
    );
  }
  line(
    [
      [-0.032, -0.077, 0.125],
      [0, -0.08, 0.14],
      [0.032, -0.077, 0.125],
    ],
    feature,
    0.0015,
  );
  // A continuous hair cap with a higher forehead and lower back neckline.
  const pos: number[] = [],
    uv: number[] = [],
    idx: number[] = [];
  for (let row = 0; row <= 24; row++)
    for (let col = 0; col <= 64; col++) {
      const phi = (col / 64) * Math.PI * 2;
      const front = Math.max(0, Math.sin(phi));
      const boundary =
        1.83 - front * 0.78 + (feminine ? 0 : 0.11 * Math.cos(phi));
      const theta = (row / 24) * boundary;
      pos.push(
        0.158 * Math.sin(theta) * Math.cos(phi),
        0.21 * Math.cos(theta),
        0.15 * Math.sin(theta) * Math.sin(phi) - 0.008,
      );
      uv.push(col / 64, row / 24);
      if (row && col) {
        const k = row * 65 + col;
        idx.push(k, k - 1, k - 66, k, k - 66, k - 65);
      }
    }
  const cap = new T.BufferGeometry();
  cap.setAttribute("position", new T.Float32BufferAttribute(pos, 3));
  cap.setAttribute("uv", new T.Float32BufferAttribute(uv, 2));
  cap.setIndex(idx);
  cap.computeVertexNormals();
  const capMesh = new T.Mesh(cap, hair);
  capMesh.material.side = T.DoubleSide;
  capMesh.castShadow = true;
  group.add(capMesh);
  if (feminine) {
    ellipsoid(hair, [0, -0.082, -0.144], [0.092, 0.085, 0.066]);
    for (let i = -4; i <= 4; i++)
      line(
        [
          [i * 0.015, 0.17, -0.079],
          [i * 0.025, 0.07, -0.145],
          [i * 0.012, -0.085, -0.204],
        ],
        strand,
        0.0013,
      );
  } else {
    const sweep = ellipsoid(hair, [0.025, 0.159, 0.042], [0.125, 0.063, 0.102]);
    sweep.rotation.z = -0.23;
    for (let i = 0; i < 8; i++) {
      const t = i * 0.009;
      line(
        [
          [-0.105 + t, 0.094, 0.081],
          [-0.069 + t, 0.184, 0.064],
          [0.035 + t, 0.205, -0.022],
          [0.111, 0.112, -0.081],
        ],
        strand,
        0.0015,
      );
    }
  }
  return group;
}

export function clothMaterial(
  color: string,
  kind: NonNullable<AvatarConfig["fabric"]>,
) {
  const data = new Uint8Array(128 * 128 * 4);
  for (let y = 0; y < 128; y++)
    for (let x = 0; x < 128; x++) {
      const weave = Math.sin((x * Math.PI) / 2) * Math.cos((y * Math.PI) / 2);
      const motif =
        kind === "brocade"
          ? Math.sin((x * Math.PI) / 32) * Math.sin((y * Math.PI) / 32)
          : 0;
      const value = Math.round(128 + weave * 35 + motif * 40);
      const i = (y * 128 + x) * 4;
      data[i] = data[i + 1] = data[i + 2] = value;
      data[i + 3] = 255;
    }
  const texture = new T.DataTexture(data, 128, 128);
  texture.wrapS = texture.wrapT = T.RepeatWrapping;
  texture.repeat.set(kind === "brocade" ? 3 : 9, kind === "brocade" ? 5 : 14);
  texture.magFilter = T.LinearFilter;
  texture.minFilter = T.LinearMipmapLinearFilter;
  texture.generateMipmaps = true;
  texture.needsUpdate = true;
  return new T.MeshPhysicalMaterial({
    color,
    side: T.DoubleSide,
    roughness: kind === "linen" ? 0.9 : kind === "brocade" ? 0.65 : 0.55,
    sheen: kind === "linen" ? 0.3 : 1,
    sheenRoughness: kind === "silk" ? 0.65 : 0.8,
    sheenColor: new T.Color(color).lerp(new T.Color("#fff4df"), 0.32),
    bumpMap: texture,
    bumpScale: kind === "linen" ? 0.003 : 0.0015,
    envMapIntensity: 0.3,
  });
}

export function fitMannequin(root: T.Group, a: AvatarConfig) {
  // Distribute stature changes over legs and torso; keep head, hands and shoes proportional.
  const delta = ((a.height - 165) / 165) * 2.58;
  const width = a.build === "slim" ? 0.93 : a.build === "broad" ? 1.12 : 1;
  root.updateMatrixWorld(true);
  const v = new T.Vector3();
  root.traverse((o) => {
    if (!(o instanceof T.Mesh)) return;
    const inverse = o.matrixWorld.clone().invert();
    const positions = o.geometry.attributes.position;
    for (let i = 0; i < positions.count; i++) {
      v.fromBufferAttribute(positions, i).applyMatrix4(o.matrixWorld);
      const y = v.y;
      const leg = T.MathUtils.clamp((y - 0.18) / 1.06, 0, 1);
      const torso = T.MathUtils.clamp((y - 1.24) / 0.89, 0, 1);
      const weight = y > 2.13 ? 0 : 1 - T.MathUtils.smoothstep(y, 1.94, 2.13);
      v.x *= 1 + (width - 1) * weight;
      v.z *= 1 + (width - 1) * 0.6 * weight;
      v.y += delta * (0.62 * leg + 0.38 * torso);
      v.applyMatrix4(inverse);
      positions.setXYZ(i, v.x, v.y, v.z);
    }
    positions.needsUpdate = true;
    o.geometry.computeVertexNormals();
    o.geometry.computeBoundingSphere();
  });
}
