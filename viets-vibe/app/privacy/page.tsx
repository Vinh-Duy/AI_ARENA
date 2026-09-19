import type { Metadata } from "next";
import { Header, Footer } from "../components/site";
export const metadata: Metadata = { title: "Quyền riêng tư | Việt’s Vibe" };
export default function Privacy() {
  return (
    <>
      <Header />
      <main className="credits-page section-wrap">
        <span className="eyebrow">DỮ LIỆU CỦA BẠN</span>
        <h1>
          Sáng tạo thoải mái.
          <br />
          <em>Hiểu dữ liệu đi đâu.</em>
        </h1>
        <h2>Lookbook nằm ở đâu?</h2>
        <p>
          Ứng dụng lưu tối đa 30 bản phối trong localStorage của trình duyệt bạn
          đang dùng. Không có tài khoản hoặc đồng bộ đám mây. Xóa dữ liệu trang
          web sẽ xóa lookbook; bạn có thể xuất bản sao JSON rồi nhập lại trên
          thiết bị khác. Bản lưu có thể gồm cấu hình dáng người, sắc da và ảnh
          chụp ma-nơ-canh 3D; đây không phải ảnh cá nhân tải lên.
        </p>
        <h2>Ảnh tải lên được dùng thế nào?</h2>
        <p>
          Ảnh chỉ được hiển thị tạm trong phiên làm việc. Khi bạn chọn “Gợi ý
          sâu hơn cùng Gemini”, ảnh cùng lựa chọn phối đồ được gửi qua máy chủ
          ứng dụng đến Google Gemini để tạo lời gợi ý. Mã ứng dụng không lưu ảnh
          vào cơ sở dữ liệu hoặc lookbook.
        </p>
        <p>
          Việc Google xử lý dữ liệu tuân theo điều khoản của Google và cấu hình
          dịch vụ được sử dụng. Xem{" "}
          <a
            href="https://ai.google.dev/gemini-api/terms"
            target="_blank"
            rel="noreferrer"
          >
            điều khoản Gemini API
          </a>{" "}
          trước khi gửi ảnh có thông tin riêng tư. Bạn vẫn có thể sử dụng phòng
          phối đồ mà không tải ảnh.
        </p>
        <h2>Liên kết chia sẻ chứa gì?</h2>
        <p>
          Liên kết chỉ chứa loại áo, màu sắc, dịp sử dụng, phong cách và phụ
          kiện cùng cấu hình ma-nơ-canh (dáng, chiều cao minh họa, sắc da và các
          lớp màu). Liên kết không chứa ảnh tải lên, API key hoặc nguyên văn
          phản hồi của Gemini. Ai có liên kết đều có thể xem các lựa chọn này.
        </p>
        <h2>Dữ liệu vận hành</h2>
        <p>
          Mã ứng dụng không cài công cụ quảng cáo hoặc phân tích hành vi. Nhà
          cung cấp hosting và Google có thể có nhật ký vận hành riêng. Người
          triển khai cần công bố bổ sung nếu thay đổi cách lưu trữ, thêm
          analytics hoặc bật đồng bộ tài khoản.
        </p>
      </main>
      <Footer />
    </>
  );
}
