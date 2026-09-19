# Việt’s Vibe — Nếp xưa. Chất mới.

Ứng dụng **Việt phục Remix** dành cho học sinh, sinh viên: hiểu trang phục truyền thống, phối theo gu cá nhân và lưu lại những bản phối có câu chuyện. AI sử dụng **Google Gemini** qua API phía server.

![Studio Việt’s Vibe: chọn trang phục, màu và phụ kiện, xoay ma-nơ-canh 3D và xem gợi ý phối](docs/images/studio.png)

## Bài toán & giải pháp

Người trẻ quan tâm Việt phục nhưng chưa dễ nhận diện từng loại áo, chọn dịp sử dụng hoặc phối phụ kiện phù hợp. Việt’s Vibe kết nối **khám phá → hiểu bối cảnh → thử phối → lưu & chia sẻ** trong một trải nghiệm.

Bản hiện tại là một proof of concept hoàn chỉnh cho luồng này; chưa phải nền tảng thử đồ bằng ảnh hoặc kho tư liệu đã được chuyên gia thẩm định.

## Tính năng đã có

- Thư viện **6 nhóm**: áo dài, áo tấc, Nhật Bình, áo ngũ thân, áo tứ thân, áo bà ba.
- Tìm kiếm có hoặc không dấu, lọc theo vùng, trang chi tiết với đặc điểm nhận diện, dịp mặc, nguồn tư liệu và ghi công ảnh.
- Studio **3D xoay 360°**: chỉnh dáng, chiều cao minh họa, sắc da; chọn áo, quần/váy, giày, phụ kiện và màu từng lớp. Có góc trước/bên/sau, zoom, tự xoay và tải PNG. Không cần API key.
- Gợi ý hài hòa màu theo sắc độ và lưu ý văn hóa theo quy tắc có giải thích; đối chiếu ảnh thật ngay cạnh mô hình.
- Google Gemini tư vấn theo các lựa chọn; có thể gửi kèm ảnh món đồ JPG/PNG/WebP, tối đa 5 MB.
- Lưu tối đa 30 bản phối với cấu hình và ảnh mockup 3D trên trình duyệt, phối tiếp, so sánh hai bản, xóa/hoàn tác, xuất/nhập bản sao JSON.
- Chia sẻ liên kết các lựa chọn phối đồ; không đưa ảnh cá nhân hoặc API key vào URL.
- Responsive, menu mobile, hỗ trợ giảm chuyển động, trang 404/lỗi, hướng dẫn sử dụng và quyền riêng tư.

## Chạy nhanh

Yêu cầu: Node.js 22 LTS, npm và kết nối mạng khi cài dependency/build lần đầu (Google Fonts).

```bash
cd viets-vibe
nvm use                         # tùy chọn, nếu đã cài nvm
npm ci
cp .env.example .env.local
npm run dev
```

Mở **http://localhost:3000**. Chưa có key vẫn dùng được thư viện, studio cơ bản và lookbook.

## Cấu hình Google Gemini

Trong `.env.local`:

```env
GEMINI_API_KEY=your_google_ai_studio_key
GEMINI_MODEL=gemini-2.5-flash
```

Lấy key tại [Google AI Studio](https://aistudio.google.com/apikey). Có thể đổi `GEMINI_MODEL` theo [model khả dụng](https://ai.google.dev/gemini-api/docs/models) của Google project. Khởi động lại server sau khi thay env. Không dùng tiền tố `NEXT_PUBLIC_` cho key, không commit `.env.local`.

**Tạo bản phối của tôi** sử dụng gợi ý đã biên soạn. **Gợi ý sâu hơn cùng Gemini** gọi Google và có nhãn riêng. Ảnh chỉ gửi khi chọn Gemini; ma-nơ-canh được dựng bằng Three.js, không phải ảnh do AI sinh. Chưa mô phỏng vải hay dự đoán độ vừa vặn.

## Kiểm tra & build

```bash
npm run check                  # ESLint + TypeScript + kiểm tra dữ liệu/ảnh
npm run build                  # production build
npm run test:e2e                # tự mở production server ở cổng 3100
npm run start                  # chạy production ở cổng 3000
```

E2E dùng Chrome có sẵn trên macOS; máy khác cài `npx playwright install chromium`, hoặc đặt `PLAYWRIGHT_CHROME_PATH`. Chạy build trước E2E. Test Gemini dùng phản hồi giả lập, không phát sinh request đến Google. Kiểm tra gọi Google thật cần API key và quota riêng.

`npm run format` định dạng mã; `npm run format:check` kiểm tra. Nếu môi trường hạn chế cổng nội bộ của Turbopack, dùng `npm run build -- --webpack`.

## Cấu trúc

```text
app/
  heritage/                  Thư viện, tìm kiếm, trang chi tiết [slug]
  mix-match/                 Studio
  lookbook/                  Bộ sưu tập cá nhân
  api/style/                 Google Gemini API phía server
  lib/heritage.ts            Nội dung, ảnh, nguồn dẫn, lựa chọn phối
  lib/lookbook.ts            Kiểm tra dữ liệu & localStorage
  components/                Điều hướng, thẻ trang phục, công cụ lookbook
  about/, credits/, privacy/ Thông tin dự án và nội dung biên tập
public/images/               Ảnh cục bộ, không phụ thuộc hotlink lúc demo
tests/                       Kiểm thử E2E
scripts/                     Kiểm tra tính đầy đủ của nội dung
```

## Tài liệu bàn giao

| Tài liệu                               | Nội dung                                       |
| -------------------------------------- | ---------------------------------------------- |
| [Demo & pitch](docs/DEMO.md)           | Kịch bản 3 phút, Q&A và tiêu chí Audition      |
| [Kiến trúc](docs/ARCHITECTURE.md)      | Luồng dữ liệu, API, lưu trữ và giới hạn        |
| [Triển khai](docs/DEPLOYMENT.md)       | Node server, Docker, env và checklist vận hành |
| [Nội dung & hình ảnh](docs/CONTENT.md) | Nguồn, ghi công, cách thêm trang phục          |
| [Kiểm thử](docs/TESTING.md)            | Chạy kiểm tra, E2E, kiểm tra thủ công          |
| [Roadmap](docs/ROADMAP.md)             | Phạm vi hiện tại và các bước tiếp theo         |
| [Changelog](CHANGELOG.md)              | Các thay đổi chính                             |

## Phạm vi và dữ liệu

Lookbook dùng localStorage, không đồng bộ tài khoản. Xuất bản sao trước khi xóa dữ liệu trình duyệt. Không có thanh toán, đăng nhập, cơ sở dữ liệu người dùng hoặc tạo ảnh AI trong bản hiện tại.

Thư viện giới thiệu một số trang phục của người Việt (Kinh), không đại diện cho mọi dân tộc. Nguồn lịch sử tách khỏi ảnh thực hành đương đại. Quyền ảnh thuộc chủ sở hữu; ghi nguồn không thay thế giấy phép. Cần xác nhận quyền sử dụng hoặc thay bằng ảnh của nhóm trước khi phát hành công khai.

Stack: Three.js · Next.js 16 App Router · React 19 · TypeScript · Tailwind CSS 4 · Framer Motion · Lucide · Google Gen AI SDK.
