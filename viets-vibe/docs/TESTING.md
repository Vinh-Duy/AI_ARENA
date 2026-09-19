# Kiểm thử

## Kết quả kiểm tra gần nhất

Ngày 19/09/2026, trên môi trường macOS và Chrome: production build và **15/15 ca E2E** đều qua. Đã xem ảnh chụp desktop/mobile của thư viện, trang chi tiết và studio 3D; kiểm tra cả mặt trước/mặt sau của sáu phom. Các ca kiểm tra đổi dáng/sắc da/lớp đồ, cảnh báo, xoay, xuất PNG, thumbnail và khôi phục lookbook, URL sai cấu hình và WebGL không khả dụng.

Hai ca mới kiểm tra ba phông Hà Nội, lưu/khôi phục phông, áp dụng/hoàn tác bản phối AI, lỗi tải phông và phản hồi AI sai schema. Đã gọi API ứng dụng với Google thật bằng `gemini-flash-latest`: HTTP 200, có nhận xét, lý do theo bối cảnh Văn Miếu và cấu hình đầy đủ để áp dụng. Chưa kiểm tra upload ảnh với Google thật, Docker hoặc workflow CI trên GitHub.

## Tự động

Để bắt lỗi cuộn xuất hiện sau khi route dev tải xong, chạy `PLAYWRIGHT_DEV=1 npm run test:e2e -- --grep 'page links open'`. Ca này bật animation bình thường và theo dõi vị trí cuộn thêm 1,5 giây sau chuyển trang trên desktop/mobile. `data-scroll-behavior="smooth"` trên `html` cho phép Next.js tạm tắt cuộn mượt trong chuyển route; thiếu thuộc tính này đã tái hiện cuộn muộn hơn 1.100px trên dev dù production qua.

Sau khi thay phông ảnh bằng minh họa AI phong cách 3D: production build và lint qua; chạy lại hai ca `Hanoi backdrops` và `broken backdrop` đều qua. Đã xem lại ảnh desktop/mobile với phông mới, cập nhật ảnh demo trong README.

```bash
npm ci
npm run check
npm run build
npm run test:e2e
```

`check` gồm lint, TypeScript và kiểm tra ID, ảnh cục bộ, URL nguồn, đặc điểm, dịp mặc. Kiểm tra nội dung chỉ xác nhận tính đầy đủ cấu trúc, không chứng minh độ chính xác văn hóa hoặc quyền ảnh.

Playwright chạy production build tại cổng 3100, một worker để ổn định ảnh chụp. Trên macOS dùng Chrome cài sẵn nếu có; máy khác dùng Chromium của Playwright (`npx playwright install chromium`) hoặc đặt `PLAYWRIGHT_CHROME_PATH`. Không cần tự chạy dev server cho E2E. Khi thay mã, build lại trước khi chạy.

Các ca kiểm tra bao gồm: responsive, lọc bộ sưu tập, thư viện/tìm kiếm không dấu, trang chi tiết, chọn trang phục, phối và lưu, tải lại lookbook, so sánh/sao lưu, lỗi upload/API và phản hồi Gemini giả lập. Ảnh chụp và trace lỗi nằm trong `test-results/`, không commit.

## Kiểm tra Google thật

1. Cấu hình key/model còn quota, khởi động lại server.
2. Chọn một áo, màu, dịp và phụ kiện; gọi Gemini không có ảnh, kiểm tra lời gợi ý có dùng đúng lựa chọn.
3. Dùng ảnh món đồ không chứa thông tin riêng tư; gọi Gemini, kiểm tra trạng thái chờ và kết quả.
4. Xác nhận key không xuất hiện trong response, URL hoặc bundle client.

E2E không gọi Google thật, không kiểm chứng model/quota của tài khoản. Không đưa key vào fixture hoặc test snapshot.

## Kiểm tra thủ công

Tab qua menu, bộ lọc, studio; kiểm tra focus, đọc nhãn input và chọn file. Bật “Reduce motion” của hệ điều hành. Thử clipboard bị chặn, ảnh sai định dạng, file >5 MB, JSON backup hỏng, quá 30 bản, storage bị chặn. Mở trên Safari/iOS và Chrome/Android trước khi trình bày trên thiết bị thật; bộ tự động hiện tập trung Chromium.
