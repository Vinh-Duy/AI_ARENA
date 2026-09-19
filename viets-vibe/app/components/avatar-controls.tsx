"use client";
import { skinTones, type AvatarConfig } from "../lib/avatar";
export function AvatarControls({
  value,
  onChange,
}: {
  value: AvatarConfig;
  onChange: (next: AvatarConfig) => void;
}) {
  const patch = (next: Partial<AvatarConfig>) =>
    onChange({ ...value, ...next });
  return (
    <div className="avatar-customize">
      <details open className="studio-disclosure">
        <summary>
          <span>NGƯỜI MẪU CỦA BẠN</span>
          <b>01 / Dáng & sắc da</b>
        </summary>
        <div className="avatar-inputs">
          <label>
            Dáng trình bày
            <select
              aria-label="Dáng trình bày"
              value={value.presentation}
              onChange={(e) =>
                patch({
                  presentation: e.target.value as AvatarConfig["presentation"],
                })
              }
            >
              <option value="neutral">Trung tính</option>
              <option value="feminine">Nữ tính</option>
              <option value="masculine">Nam tính</option>
            </select>
          </label>
          <label>
            Phom người
            <select
              aria-label="Phom người"
              value={value.build}
              onChange={(e) =>
                patch({ build: e.target.value as AvatarConfig["build"] })
              }
            >
              <option value="slim">Thanh mảnh</option>
              <option value="regular">Cân đối</option>
              <option value="broad">Đầy đặn</option>
            </select>
          </label>
          <label className="height-control">
            Chiều cao minh họa <output>{value.height} cm</output>
            <input
              aria-label="Chiều cao minh họa"
              type="range"
              min="150"
              max="190"
              value={value.height}
              onChange={(e) => patch({ height: Number(e.target.value) })}
            />
          </label>
          <div className="skin-control">
            <span>Sắc da</span>
            <div>
              {skinTones.map((skin, i) => (
                <button
                  key={skin}
                  aria-label={`Sắc da ${i + 1}`}
                  aria-pressed={skin === value.skin}
                  style={{ background: skin }}
                  onClick={() => patch({ skin })}
                />
              ))}
            </div>
          </div>
        </div>
        <p>Mọi trang phục đều có thể thử trên mọi dáng người.</p>
      </details>
      <details open className="studio-disclosure">
        <summary>
          <span>LAYER BY LAYER</span>
          <b>02 / Các lớp trang phục</b>
        </summary>
        <div className="avatar-inputs">
          <label>
            Lớp thân dưới
            <select
              aria-label="Lớp thân dưới"
              value={value.bottomType}
              onChange={(e) =>
                patch({
                  bottomType: e.target.value as AvatarConfig["bottomType"],
                })
              }
            >
              <option value="trousers">Quần dài</option>
              <option value="skirt">Váy dài</option>
            </select>
          </label>
          <label>
            Giày
            <select
              aria-label="Giày"
              value={value.footwear}
              onChange={(e) =>
                patch({ footwear: e.target.value as AvatarConfig["footwear"] })
              }
            >
              <option value="flats">Giày bệt</option>
              <option value="sneakers">Sneaker</option>
            </select>
          </label>
        </div>
        <div className="layer-colors">
          {(
            [
              ["inner", "Lớp trong"],
              ["bottom", "Quần / váy"],
              ["accent", "Phụ kiện & viền"],
              ["shoes", "Giày"],
            ] as const
          ).map(([key, label]) => (
            <label key={key}>
              <input
                type="color"
                aria-label={`Màu ${label.toLowerCase()}`}
                value={value[key]}
                onChange={(e) => patch({ [key]: e.target.value })}
              />
              <span>{label}</span>
            </label>
          ))}
        </div>
        <label className="collar-toggle">
          <input
            type="checkbox"
            checked={value.collar}
            onChange={(e) => patch({ collar: e.target.checked })}
          />{" "}
          Giữ chi tiết cổ áo
        </label>
      </details>
    </div>
  );
}
