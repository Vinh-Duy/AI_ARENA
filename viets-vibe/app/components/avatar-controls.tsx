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
            Mẫu người
            <select
              aria-label="Dáng trình bày"
              value={
                value.presentation === "neutral"
                  ? "feminine"
                  : value.presentation
              }
              onChange={(e) =>
                patch({
                  presentation: e.target.value as AvatarConfig["presentation"],
                })
              }
            >
              <option value="feminine">Nữ · tóc búi thấp</option>
              <option value="masculine">Nam · tóc ngắn rẽ ngôi</option>
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
            <span className="height-ticks">
              <span>150 cm</span>
              <span>170 cm</span>
              <span>190 cm</span>
            </span>
          </label>
          <div
            className="height-presets"
            role="group"
            aria-label="Chiều cao nhanh"
          >
            {[155, 165, 175, 185].map((height) => (
              <button
                type="button"
                key={height}
                aria-pressed={value.height === height}
                onClick={() => patch({ height })}
              >
                {height} cm
              </button>
            ))}
          </div>
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
        <p>
          Tóc cố định theo mẫu. Chiều cao thay đổi tỉ lệ thân và chân, giữ phom
          đầu. Mọi trang phục đều có thể thử trên cả hai mẫu.
        </p>
      </details>
      <details open className="studio-disclosure">
        <summary>
          <span>LAYER BY LAYER</span>
          <b>02 / Các lớp trang phục</b>
        </summary>
        <div className="avatar-inputs">
          <label className="fabric-select">
            Chất liệu bề mặt
            <select
              aria-label="Chất liệu bề mặt"
              value={value.fabric || "silk"}
              onChange={(e) =>
                patch({ fabric: e.target.value as AvatarConfig["fabric"] })
              }
            >
              <option value="silk">Lụa · mềm, ánh nhẹ</option>
              <option value="linen">Đũi · thớ mộc, lì</option>
              <option value="brocade">Gấm · vân dệt nổi</option>
            </select>
          </label>
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
        <p>
          Bề mặt và nếp rủ được minh họa bằng ánh sáng 3D; chưa mô phỏng chuyển
          động vải hay độ vừa theo số đo.
        </p>
      </details>
    </div>
  );
}
