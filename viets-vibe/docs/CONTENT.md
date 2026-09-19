# Nội dung và hình ảnh

## Nguồn dữ liệu duy nhất

`app/lib/heritage.ts` chứa nội dung và provenance cho từng trang phục. Các trường `source`/`sourceName` chỉ tư liệu văn hóa; `imageSource`/`imageCredit`/`imageOriginal` chỉ ảnh. `imageNote` phân biệt ảnh đương đại với hiện vật hoặc phục dựng. Trang `/credits` lấy trực tiếp dữ liệu này để hạn chế lệch nguồn.

| Nhóm        | Nguồn văn hóa                                  | Ảnh đang dùng                                     |
| ----------- | ---------------------------------------------- | ------------------------------------------------- |
| Áo dài      | Vietnam Tourism                                | Aaron Joel Santos / Vietnam Tourism               |
| Áo tấc      | Sở Du lịch Huế                                 | Hoa Nghiêm Việt Phục                              |
| Nhật Bình   | Tạp chí Thế giới Di sản                        | Hoa Nghiêm Việt Phục, mẫu hồng pastel             |
| Áo ngũ thân | Vietnam Tourism                                | Hoa Nghiêm Việt Phục, mẫu nam                     |
| Áo tứ thân  | Võ Quang Yến, “Áo tứ thân, khăn mỏ quạ”        | Ảnh đăng trên BBCosplay, tác giả chưa xác minh    |
| Áo bà ba    | Ủy ban Nhà nước về người Việt Nam ở nước ngoài | Ảnh trong bài trên scov.gov.vn, bài ghi nguồn VOV |

Liên kết chính xác được lưu trong từng bản ghi và hiển thị tại `/credits`. Ảnh `editorial.jpg` trên trang chủ: Aaron Joel Santos / Vietnam Tourism. `nhat-binh.jpg` là ảnh tư liệu cũ từ bài trên Thế giới Di sản, không còn là ảnh thẻ mặc định.

## Thêm một loại trang phục

1. Chọn phạm vi, tên gọi và ít nhất một nguồn trực tiếp liên quan; đọc nguồn, không suy nội dung từ tiêu đề.
2. Thêm ID ổn định vào `collection`. Viết mô tả ngắn, nguồn gốc thận trọng và lưu ý cụ thể.
3. Thêm bản ghi `details` cùng ID: `regionGroup`, ba đặc điểm, dịp mặc, gợi ý phối, nguồn ảnh và vị trí hiển thị ảnh.
4. Lưu ảnh vào `public/images`, ghi rõ nguồn và quyền sử dụng; không xóa watermark hoặc giả tác giả.
5. Chạy `npm run check:content`, xem trang chi tiết và studio ở desktop/mobile, kiểm tra phom áo không bị crop gây hiểu nhầm.
6. Cập nhật README, kịch bản demo và kiểm thử khi thay phạm vi. Không đổi ID đã dùng trong lookbook nếu chưa có migration.

## Nguyên tắc biên tập

Không gán biểu tượng, niên đại, địa vị hoặc phẩm cấp khi thiếu căn cứ. Không coi tư liệu bán hàng là nguồn đủ để khẳng định lịch sử. Phân biệt hình ảnh phối hiện đại với phục dựng; ghi rõ sự không chắc chắn và giới hạn phạm vi dân tộc/vùng miền.

Quyền ảnh chưa được cấp cho nhóm chỉ vì ảnh tải được hoặc đã ghi nguồn. Xác minh giấy phép trước khi phát hành công khai; ưu tiên ảnh tự chụp hoặc hợp tác có thỏa thuận với tác giả. Không áp dụng giấy phép mã nguồn cho ảnh bên thứ ba.
