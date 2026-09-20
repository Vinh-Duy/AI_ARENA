# Triển khai

## Node server

Từ `viets-vibe`, dùng Node 22:

```bash
npm ci
npm run check
npm run build
npm run start
```

Build cần mạng tải Google Fonts. Runtime cần HTTPS ra Google để gọi Gemini. Cấu hình `GEMINI_API_KEY` bằng biến môi trường bí mật; `GEMINI_MODEL` tùy chọn. Khởi động lại server khi thay env.

`GEMINI_FALLBACK_MODEL` mặc định `gemini-flash-lite-latest`: thử một lần khi model chính trả 503/504 hoặc timeout. Không thử lại lỗi key, quyền, model không tồn tại hoặc quota. Model chính có 22 giây, dự phòng 25 giây; client chờ tối đa 60 giây. Response thành công có trường `model` để xác định model đã trả lời.

Model mặc định hiện là `gemini-flash-latest`. Trong lần kiểm tra local, `gemini-2.5-flash` trả 404 khi generateContent, trong khi alias Flash trả lời được. Nếu deployment đã đặt model cũ, sửa biến `GEMINI_MODEL` ở Vercel/Render và redeploy; thay `.env.local` không tự cập nhật biến trên hosting. Alias có thể đổi model theo thời gian, nên kiểm tra lại quota và model trước buổi demo. API báo riêng lỗi quyền truy cập, model không khả dụng, quota và timeout; không log key hoặc nội dung ảnh.

Với nền tảng hỗ trợ Next.js: đặt **Root Directory = viets-vibe**, install `npm ci`, build `npm run build`. Không dùng static export vì `/api/style` cần server. Đặt timeout nền tảng đủ cho request Gemini (ứng dụng đặt timeout khoảng 55–60 giây).

## Docker

Từ thư mục `viets-vibe`:

```bash
docker build -t viets-vibe .
docker run --rm -p 3000:3000 --env-file .env.local viets-vibe
```

Dockerfile bật `BUILD_STANDALONE=1` để tạo output standalone của Next.js, chạy bằng user không phải root. Bản build Node thông thường dùng `next start`. `.dockerignore` loại `.env.local`; truyền key lúc chạy, không đưa key vào build args hoặc image. Cấu hình Docker chưa được chạy kiểm thử trong môi trường hiện tại; cần smoke test ở hạ tầng triển khai.

## Trước khi mở công khai

- Kiểm tra Google key, model khả dụng, quota và ngân sách; thêm rate limit ở gateway để endpoint public không dùng quota ngoài dự kiến.
- Xác nhận quyền sử dụng ảnh hoặc thay bằng ảnh tự chụp; hiện tại là ảnh tham khảo cho demo.
- Kiểm tra trên HTTPS: clipboard, tải ảnh, request Gemini, lỗi khi mất mạng, lưu và khôi phục lookbook.
- Công bố thay đổi quyền riêng tư nếu thêm analytics, đăng nhập hoặc database.
- Không ghi request body/ảnh/key vào log. Rà chính sách log của hosting.

## Xử lý sự cố

| Hiện tượng                          | Kiểm tra                                                                     |
| ----------------------------------- | ---------------------------------------------------------------------------- |
| Gemini chưa sẵn sàng                | Key tồn tại phía server, restart sau khi đổi env.                            |
| Gemini trả lỗi chung                | Quota, quyền model, kết nối Google và log server; không gửi log chứa bí mật. |
| Font không tải khi build            | Cho phép truy cập Google Fonts hoặc tự host font có giấy phép phù hợp.       |
| Turbopack lỗi môi trường            | Thử `npm run build -- --webpack`.                                            |
| Không thấy lookbook ở thiết bị khác | Lookbook chưa đồng bộ; xuất JSON và nhập trên thiết bị mới.                  |
| Không sao chép được link            | Dùng HTTPS; UI hiển thị đường dẫn để tự sao chép khi clipboard bị chặn.      |
