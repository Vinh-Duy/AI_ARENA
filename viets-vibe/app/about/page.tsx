import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowUpRight,
  BookOpen,
  Palette,
  Bookmark,
  Sparkles,
} from "lucide-react";
import { Header, Footer } from "../components/site";
export const metadata: Metadata = {
  title: "Về Việt’s Vibe — Việt phục Remix",
  description:
    "Một không gian để người trẻ tìm hiểu Việt phục và tạo bản phối cá nhân cùng Google Gemini.",
};
const faqs = [
  [
    "Mình chưa biết gì về Việt phục, bắt đầu ở đâu?",
    "Vào thư viện, chọn một chiếc áo bạn thích và đọc ba đặc điểm nhận diện. Trang chi tiết có nguồn tham khảo cùng nút chuyển thẳng sang phòng phối đồ.",
  ],
  [
    "Có cần tài khoản để dùng không?",
    "Không. Bạn có thể khám phá, phối và lưu ngay. Lookbook nằm trên trình duyệt hiện tại; hãy xuất bản sao nếu muốn chuyển sang thiết bị khác.",
  ],
  [
    "Tạo bản phối và Gemini khác nhau thế nào?",
    "Tạo bản phối dùng nội dung đã biên soạn theo lựa chọn của bạn. Gemini gợi ý linh hoạt hơn và có thể tham khảo ảnh bạn tải lên. Gợi ý AI được ghi nhãn riêng, cần đối chiếu khi dùng trong nghi lễ.",
  ],
  [
    "Ảnh xem trước có phải ảnh mình đang mặc bộ đồ không?",
    "Đây là ma-nơ-canh 3D minh họa: bạn chỉnh dáng, màu da, các lớp đồ và xoay 360°. Mô hình chưa đo độ vừa vặn hoặc mô phỏng chất vải, cũng không phải ảnh bạn đang mặc đồ. Ảnh tư liệu luôn có sẵn để đối chiếu.",
  ],
  [
    "Vì sao thư viện chưa có trang phục của mọi dân tộc?",
    "Phiên bản đầu tập trung vào sáu nhóm trang phục người Việt (Kinh). Mở rộng cần tư liệu và sự tham gia của cộng đồng sở hữu văn hóa, không chỉ thêm tên và ảnh.",
  ],
  [
    "Mình có thể mặc cách tân đến lễ hội không?",
    "Tùy bối cảnh và quy định nơi tổ chức. Ứng dụng phân biệt ý tưởng phối hiện đại với quy cách lễ phục; khi chưa chắc, ưu tiên hỏi đơn vị tổ chức hoặc người có chuyên môn.",
  ],
];
export default function About() {
  return (
    <>
      <Header />
      <main className="section-wrap about-page">
        <div className="about-intro">
          <span className="eyebrow">VIỆT PHỤC REMIX · DÀNH CHO THẾ HỆ MỚI</span>
          <h1>
            Di sản được sống tiếp.
            <br />
            <em>Từ những lựa chọn nhỏ.</em>
          </h1>
          <p>
            Việt’s Vibe bắt đầu từ một câu hỏi gần gũi: thích Việt phục, nhưng
            mặc thế nào cho đúng dịp, hợp gu và vẫn tôn trọng câu chuyện phía
            sau?
          </p>
          <Link href="/heritage" className="button button-primary">
            Bắt đầu từ một chiếc áo <ArrowUpRight size={17} />
          </Link>
        </div>
        <div className="journey-grid">
          {[
            {
              icon: BookOpen,
              title: "Hiểu điều mình mặc",
              text: "Đọc nguồn gốc, nhận diện phom áo và tìm một bối cảnh phù hợp.",
              n: "01",
            },
            {
              icon: Palette,
              title: "Phối theo chất riêng",
              text: "Chọn màu, phong cách, phụ kiện. Thử gợi ý biên soạn hoặc sáng tạo cùng Gemini.",
              n: "02",
            },
            {
              icon: Bookmark,
              title: "Giữ lại cảm hứng",
              text: "Lưu bản phối, so sánh lựa chọn và chia sẻ liên kết với bạn bè.",
              n: "03",
            },
          ].map((item) => (
            <article key={item.n}>
              <span>
                {item.n}
                <item.icon size={23} strokeWidth={1} />
              </span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
        <section className="about-principle">
          <Sparkles size={25} strokeWidth={1} />
          <h2>
            AI gợi mở.
            <br />
            <em>Văn hóa cần sự thấu hiểu.</em>
          </h2>
          <p>
            Gemini giúp kết nối lựa chọn cá nhân thành lời gợi ý dễ áp dụng.
            Nguồn tư liệu, ghi công ảnh và những điều chưa chắc chắn luôn có chỗ
            riêng. Thư viện không tự nhận đã được chuyên gia thẩm định.
          </p>
          <Link href="/credits" className="text-link">
            Đọc nguyên tắc biên tập <ArrowUpRight size={15} />
          </Link>
        </section>
        <section className="faq-section">
          <span className="eyebrow">TRƯỚC KHI BẮT ĐẦU</span>
          <h2>
            Có thể bạn đang <em>thắc mắc.</em>
          </h2>
          {faqs.map(([q, a]) => (
            <details key={q}>
              <summary>
                {q}
                <span>+</span>
              </summary>
              <p>{a}</p>
            </details>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
