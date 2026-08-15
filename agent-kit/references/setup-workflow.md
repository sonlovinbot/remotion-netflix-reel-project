# Quy trình chuẩn bị máy

## Mục tiêu

Đưa một bản repository mới tải về đến trạng thái mở được Remotion Studio, nhưng luôn báo cáo và xin xác nhận trước khi cài đặt.

## Kiểm tra chỉ đọc

Kiểm tra theo thứ tự:

1. Hệ điều hành và loại chip.
2. RAM và dung lượng trống.
3. Git.
4. Bun và Node.js.
5. Cấu trúc repository, `project/package.json` và `project/bun.lock`.
6. Asset, audio, source và composition mong đợi.
7. `project/node_modules` đã tồn tại chưa.
8. Cổng local từ 3000 đến 3010.

Chạy `doctor.mjs` bằng Bun hoặc Node nếu một trong hai đã có. Doctor không được sửa file hoặc cài gì.

## Cách báo cáo

Dùng ba nhóm:

- Sẵn sàng.
- Còn thiếu.
- Đề xuất thực hiện.

Nêu dung lượng tải dự kiến. Cài dependencies Remotion thường có thể cần vài trăm MB. Không hứa thời gian chính xác.

Kết thúc báo cáo bằng một câu hỏi xác nhận rõ ràng. Ví dụ: "Bạn có đồng ý để tôi cài Bun cho tài khoản hiện tại và cài thư viện trong thư mục project không?"

## Sau khi được xác nhận

1. Nếu Bun chưa có, cài theo phương án chính thức phù hợp hệ điều hành và ưu tiên phạm vi người dùng.
2. Không dùng quyền quản trị nếu có phương án an toàn không cần quyền quản trị.
3. Trong `project`, cài đúng phiên bản từ `bun.lock` bằng `bun install --frozen-lockfile`.
4. Chạy `bun run lint`.
5. Chạy `bunx remotion compositions src/index.ts` và xác nhận có `Reel`, `ReelVI`, `CTA`, `Scene1` đến `Scene5`.
6. Chọn cổng trống từ 3000 đến 3010, sau đó chạy Remotion Studio.
7. Trả link local và nói rõ chọn composition `ReelVI`.

## Trạng thái hoàn tất

Báo:

- Phần nào đã cài.
- Kiểm tra nào đã đạt.
- Link preview.
- Cách dừng preview nếu người dùng hỏi.
- Ba lựa chọn tiếp theo: xem Project 1, sửa một scene, hoặc tạo Project 2.
