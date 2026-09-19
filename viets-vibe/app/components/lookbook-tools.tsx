"use client";
import { useRef, useState } from "react";
import { Download, Upload, Columns2 } from "lucide-react";
import { garments, type SavedLook } from "../lib/heritage";
import { parseLooks, readLooks, writeLooks } from "../lib/lookbook";
export function LookbookTools({ looks }: { looks: SavedLook[] }) {
  const upload = useRef<HTMLInputElement>(null);
  const [message, setMessage] = useState("");
  const [leftId, setLeftId] = useState("");
  const [rightId, setRightId] = useState("");
  const left = looks.find((l) => l.id === leftId) || looks[0];
  const right =
    looks.find((l) => l.id === rightId && l.id !== left?.id) ||
    looks.find((l) => l.id !== left?.id);
  function download() {
    const url = URL.createObjectURL(
      new Blob([JSON.stringify({ version: 1, looks }, null, 2)], {
        type: "application/json",
      }),
    );
    const a = document.createElement("a");
    a.href = url;
    a.download = "viets-vibe-lookbook.json";
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setMessage("Đã tạo bản sao lookbook. File không chứa ảnh cá nhân.");
  }
  async function restore(file?: File) {
    if (!file) return;
    try {
      if (file.size > 10_000_000)
        throw new Error("Chọn file JSON nhỏ hơn 10 MB.");
      const payload: unknown = JSON.parse(await file.text());
      if (
        !payload ||
        typeof payload !== "object" ||
        !("version" in payload) ||
        payload.version !== 1 ||
        !("looks" in payload) ||
        !Array.isArray(payload.looks)
      )
        throw new Error("Đây chưa phải bản sao lookbook hợp lệ.");
      const restored = parseLooks(JSON.stringify(payload.looks));
      if (!restored.length || restored.length !== payload.looks.length)
        throw new Error("File có bản phối không hợp lệ hoặc không có dữ liệu.");
      const current = readLooks();
      const existing = new Set(current.map((l) => l.id));
      const incoming = restored.filter((l) => {
        if (existing.has(l.id)) return false;
        existing.add(l.id);
        return true;
      });
      if (current.length + incoming.length > 30)
        throw new Error(
          "Lookbook tối đa 30 bản. Hãy xóa bớt một số bản phối trước khi nhập.",
        );
      writeLooks([...incoming, ...current]);
      setMessage(`Đã nhập ${incoming.length} bản phối mới; bỏ qua bản đã có.`);
    } catch (error) {
      setMessage(
        error instanceof SyntaxError
          ? "Không đọc được JSON. Hãy dùng file xuất từ Việt’s Vibe."
          : error instanceof Error
            ? error.message
            : "Chưa thể nhập lookbook.",
      );
    }
  }
  return (
    <div className="lookbook-tools">
      <div className="backup-actions">
        <button
          className="button button-outline"
          onClick={download}
          disabled={!looks.length}
        >
          <Download size={15} /> Xuất bản sao
        </button>
        <button
          className="button button-outline"
          onClick={() => upload.current?.click()}
        >
          <Upload size={15} /> Nhập bản sao
        </button>
        <input
          className="sr-only"
          aria-label="Nhập file lookbook"
          type="file"
          accept=".json,application/json"
          ref={upload}
          onChange={(e) => {
            void restore(e.target.files?.[0]);
            e.target.value = "";
          }}
        />
        <p>Mang bộ sưu tập sang một thiết bị khác.</p>
      </div>
      {message && (
        <p role="status" className="status-message">
          {message}
        </p>
      )}
      {left && right && (
        <details className="compare-panel">
          <summary>
            <Columns2 size={17} /> Đặt hai bản phối cạnh nhau <span>+</span>
          </summary>
          <div className="compare-selects">
            {[
              {
                label: "Bản phối thứ nhất",
                value: left.id,
                other: right.id,
                set: setLeftId,
              },
              {
                label: "Bản phối thứ hai",
                value: right.id,
                other: left.id,
                set: setRightId,
              },
            ].map((option) => (
              <label key={option.label}>
                {option.label}
                <select
                  value={option.value}
                  onChange={(e) => option.set(e.target.value)}
                >
                  {looks
                    .filter((l) => l.id !== option.other)
                    .map((l, i) => (
                      <option key={l.id} value={l.id}>
                        {i + 1}.{" "}
                        {garments.find((g) => g.id === l.garment)?.name} ·{" "}
                        {l.color} · {l.vibe}
                      </option>
                    ))}
                </select>
              </label>
            ))}
          </div>
          <div className="compare-table-wrap">
            <table>
              <caption>So sánh các lựa chọn đã lưu</caption>
              <thead>
                <tr>
                  <th scope="col">Chi tiết</th>
                  <th scope="col">Bản phối 1</th>
                  <th scope="col">Bản phối 2</th>
                </tr>
              </thead>
              <tbody>
                {[
                  {
                    label: "Trang phục",
                    value: (l: SavedLook) =>
                      garments.find((g) => g.id === l.garment)?.name,
                  },
                  { label: "Màu chủ đạo", value: (l: SavedLook) => l.color },
                  { label: "Sự kiện", value: (l: SavedLook) => l.occasion },
                  { label: "Phong cách", value: (l: SavedLook) => l.vibe },
                  {
                    label: "Phụ kiện",
                    value: (l: SavedLook) =>
                      l.accessories.join(", ") || "Không có",
                  },
                ].map((row) => (
                  <tr key={row.label}>
                    <th scope="row">{row.label}</th>
                    <td>{row.value(left)}</td>
                    <td>{row.value(right)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </div>
  );
}
