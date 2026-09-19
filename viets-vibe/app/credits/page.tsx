import type { Metadata } from "next";
import { legacyPhotoBackdrops } from "../lib/backdrops";
import Link from "next/link";
import { Footer, Header } from "../components/site";
import { garments } from "../lib/heritage";
export const metadata: Metadata = {
  title: "Nguồn tư liệu & hình ảnh | Việt’s Vibe",
};
export default function Credits() {
  return (
    <>
      <Header />
      <main className="credits-page section-wrap">
        <span className="eyebrow">ĐẰNG SAU MỖI NẾP ÁO</span>
        <h1>
          Sáng tạo từ
          <br />
          <em>sự thấu hiểu.</em>
        </h1>
        <p>
          Thư viện tập trung vào sáu nhóm trang phục người Việt (Kinh). Nội dung
          là bản giới thiệu ngắn có nguồn dẫn, chưa phải tài liệu được hội đồng
          chuyên gia thẩm định và chưa đại diện cho mọi dân tộc Việt Nam.
        </p>
        <h2>Tư liệu và hình ảnh</h2>
        {garments.map((g) => (
          <article key={g.id}>
            <h3>
              <Link href={`/heritage/${g.id}`}>{g.name} ↗</Link>
            </h3>
            <p>{g.story}</p>
            <a href={g.source} target="_blank" rel="noreferrer">
              Tư liệu: {g.sourceName} ↗
            </a>
            <p className="credit-image-note">{g.imageNote}</p>
            <a href={g.imageSource} target="_blank" rel="noreferrer">
              Ảnh: {g.imageCredit} ↗
            </a>
          </article>
        ))}
        <h2 id="hanoi-illustrations">Hà Nội qua nét vẽ 3D</h2>
        <p>
          Phông Hồ Gươm, Văn Miếu và cầu Long Biên trong phòng phối đồ là minh
          họa tạo bằng AI: hình khối giản lược, màu dịu và ánh sáng mềm để hòa
          với ma-nơ-canh. Đây là ảnh nền 2D mang phong cách 3D. Kiến trúc và
          cảnh quan được cách điệu, không dùng làm tư liệu phục dựng hoặc mô tả
          chính xác địa điểm ngoài đời.
        </p>
        <h2>Ảnh phông của bản lưu cũ</h2>
        <p>
          Những thumbnail lưu trước khi đổi sang minh họa có thể vẫn dùng các
          ảnh dưới đây, với giấy phép Creative Commons ghi rõ tại nguồn. Phông
          được cắt khung để vừa canvas và ghép với ma-nơ-canh; không phải ảnh
          chụp người thật tại địa danh.
        </p>
        {legacyPhotoBackdrops
          .filter((b) => b.image)
          .map((b) => (
            <article key={b.id}>
              <h3>{b.name}</h3>
              <p>
                Ảnh: {b.credit} ·{" "}
                <a href={b.licenseUrl} target="_blank" rel="noreferrer">
                  {b.license}
                </a>
              </p>
              <a href={b.source} target="_blank" rel="noreferrer">
                Xem ảnh gốc & giấy phép ↗
              </a>
            </article>
          ))}
        <h2>Ảnh biên tập khác</h2>
        <p>
          Ảnh áo dài trắng với ô lụa trong khu vườn: Aaron Joel Santos /{" "}
          <a
            href="https://vietnam.travel/things-to-do/ao-dai-vietnam"
            target="_blank"
            rel="noreferrer"
          >
            Vietnam Tourism
          </a>
          . Ảnh đoàn người mặc Nhật Bình trong thư mục tư liệu cũ: bài “Áo Nhật
          Bình – Di sản văn hóa quý của Cố đô Huế”, Tạp chí Thế giới Di sản.
        </p>
        <h2>Ghi nguồn là điểm bắt đầu</h2>
        <p>
          Quyền hình ảnh thuộc tác giả và đơn vị sở hữu. Các ảnh được dùng để
          tham khảo trong bản demo; việc ghi nguồn không đồng nghĩa với giấy
          phép tái sử dụng. Nhóm cần xác nhận quyền sử dụng hoặc thay bằng ảnh
          tự chụp trước khi phát hành công khai.
        </p>
        <h2>Nguyên tắc biên tập</h2>
        <p>
          Tách thông tin lịch sử khỏi gợi ý phối hiện đại. Không tự gán niên
          đại, ý nghĩa biểu tượng hoặc phẩm cấp cho một bộ đồ. Khi nguồn có
          nhiều cách lý giải, thể hiện điều chưa chắc thay vì chọn một câu
          chuyện như kết luận duy nhất.
        </p>
        <p>
          Ảnh trong moodboard là ảnh tham khảo, không phải ảnh thử đồ. Gợi ý
          Google Gemini có nhãn riêng và có thể có sai sót; với trang phục nghi
          lễ hoặc phục dựng, đối chiếu tài liệu chuyên môn và hỏi người tổ chức.
        </p>
      </main>
      <Footer />
    </>
  );
}
