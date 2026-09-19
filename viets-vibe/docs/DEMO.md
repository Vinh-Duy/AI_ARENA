# Kịch bản demo & pitch

## Thông điệp

“Việt’s Vibe giúp người trẻ đi từ thích một bộ Việt phục đến hiểu và phối nó theo cách của mình, với Google Gemini đồng hành và tư liệu văn hóa luôn ở cạnh.”

Đối tượng: học sinh, sinh viên chọn trang phục cho kỷ yếu, Tết, lễ hội hoặc hoạt động văn hóa. Nhu cầu chính là nhận diện áo, chọn bối cảnh, phối dễ thực hiện và có lưu ý phù hợp.

## Demo 3 phút

| Thời gian | Thao tác                    | Điều cần nói                                                                                               |
| --------- | --------------------------- | ---------------------------------------------------------------------------------------------------------- |
| 0:00–0:25 | Trang chủ                   | Nêu khó khăn khi người trẻ muốn mặc Việt phục mà chưa biết bắt đầu từ đâu.                                 |
| 0:25–0:55 | Thư viện, tìm `ngu than`    | Tìm không dấu, lọc vùng, mở chi tiết và chỉ nguồn tư liệu.                                                 |
| 0:55–1:40 | Chọn dịp Tết, chuyển studio | Chỉnh dáng/sắc da, đổi áo và màu từng lớp; xoay mặt sau. Bỏ cổ Nhật Bình để minh họa cảnh báo rồi bật lại. |
| 1:40–2:10 | Gợi ý cùng Gemini           | Cho thấy prompt nhận đầy đủ lựa chọn và lưu ý văn hóa; nếu mất kết nối, bản phối cơ bản vẫn dùng được.     |
| 2:10–2:40 | Lưu 2 bản, mở lookbook      | Tải PNG góc đang xem, lưu mockup rồi “Phối tiếp” để khôi phục 3D.                                          |
| 2:40–3:00 | Nêu bước tiếp theo          | Biên tập cùng chuyên gia, thử đồ qua model ảnh Google, đồng bộ lookbook.                                   |

## Gắn với tiêu chí Audition

- **Execution / Feasibility — 50%:** trình diễn luồng thật; có fallback không cần key, trạng thái lỗi và dữ liệu lưu lại sau khi tải trang.
- **Vision — 30%:** giải thích bài toán khám phá và tự tin sử dụng; mở rộng thư viện cần hợp tác với người nghiên cứu và cộng đồng văn hóa.
- **Creativity — 20%:** kết hợp canvas 3D tương tác với lời gợi ý Gemini và ngữ cảnh văn hóa; trình bày rõ đâu là AI, đâu là nội dung biên soạn.

## Q&A dự kiến

**AI làm gì?** Gợi ý cách phối từ lựa chọn và ảnh tham khảo nếu có. Ma-nơ-canh 3D chạy bằng Three.js, không dùng AI; Gemini chưa tạo ảnh hoặc thử đồ lên ảnh người.

**Thông tin văn hóa có chắc chắn không?** Có nguồn dẫn, tránh diễn giải biểu tượng không có căn cứ. Chưa được chuyên gia thẩm định toàn bộ; phục dựng hoặc nghi lễ cần kiểm tra chuyên môn.

**Nếu API hết quota?** Thư viện, bản phối cơ bản, lưu và so sánh vẫn chạy. UI báo Gemini chưa phản hồi, không giả lời AI.

**Dữ liệu lưu ở đâu?** Trình duyệt hiện tại; có xuất/nhập JSON. Ảnh cá nhân không nằm trong bản sao hoặc link chia sẻ.

**Vì sao mới sáu nhóm?** Ưu tiên phạm vi có thể biên tập và kiểm thử được. Không đồng nhất sáu nhóm của người Việt (Kinh) với toàn bộ văn hóa trang phục Việt Nam.

## Trước giờ trình bày

Chạy `npm run check`, `npm run build`, `npm run test:e2e`. Chuẩn bị key Google còn quota và một ảnh món đồ không chứa dữ liệu riêng tư. Thử trước luồng Gemini thật. Chuẩn bị hai bản phối để so sánh, nhưng cũng tạo ít nhất một bản trực tiếp. Không khẳng định số người dùng, độ chính xác hoặc quan hệ hợp tác chưa được chứng minh.
