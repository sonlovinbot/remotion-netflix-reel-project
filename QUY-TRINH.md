# Quy trình ChatGPT × Remotion

## Bức tranh đơn giản

- **Bạn** đưa ra mục tiêu và kiểm duyệt nội dung.
- **ChatGPT** viết, chia cảnh, điều phối asset và sửa dự án.
- **Remotion** ghép hình, chữ, audio và hiệu ứng thành video.

## Giai đoạn 1 — Chốt nội dung

### Bước 1: Viết brief

Brief cần có chủ đề, người xem, mục tiêu, thời lượng, ngôn ngữ và phong cách.

### Bước 2: Duyệt kịch bản

Kiểm tra kỹ:

- Câu mở đầu có thu hút không?
- Chỉ có một thông điệp chính không?
- Tên người, tên thương hiệu và con số có đúng không?
- Câu cuối có yêu cầu hành động rõ không?

Không nên làm hình khi kịch bản còn thay đổi lớn.

## Giai đoạn 2 — Chuẩn bị nguyên liệu

### Bước 3: Thu voice-over

Voice-over quyết định độ dài video và điểm đổi cảnh. Nên đọc từng ý rõ ràng, ngắt nhẹ giữa hai câu.

### Bước 4: Chuẩn bị asset

Đặt asset trong `project/public/assets`. Chia thư mục theo scene để dễ tìm. Nếu một nhân vật xuất hiện nhiều lần, dùng một ảnh làm tham chiếu nhận diện.

## Giai đoạn 3 — Dựng preview

### Bước 5: Chia scene theo audio

ChatGPT đo thời lượng audio, tìm khoảng nghỉ và đặt điểm chuyển cảnh giữa các câu. Mỗi scene chỉ nên truyền tải một ý.

### Bước 6: Xem preview

Preview là bản video có thể tua từng frame. Hãy xem:

- 3 giây đầu.
- Điểm đổi scene.
- Thời điểm headline xuất hiện.
- Caption có đúng lời đọc không.
- Cảnh cuối và CTA.

## Giai đoạn 4 — Sửa có kiểm soát

Một yêu cầu sửa tốt gồm ba phần:

1. **Chỗ nào:** Scene 2, thời điểm 8 giây…
2. **Sửa gì:** đổi 50 nghìn tỷ thành 50 triệu đô.
3. **Giữ gì:** giữ nguyên animation và các scene còn lại.

Sau mỗi sửa quan trọng, yêu cầu ChatGPT render một frame tĩnh để kiểm tra. Cách này nhanh hơn render cả video.

## Giai đoạn 5 — Render

Khi preview đã đúng, yêu cầu ChatGPT:

> Render composition ReelVI, sau đó kiểm tra file có hình, có tiếng, đúng kích thước 1080 × 1920 và báo đường dẫn kết quả.

Video xuất ra không được commit lên Git. `.gitignore` đã loại bỏ các file MP4 và thư mục `out`.

## Tạo phiên bản ngôn ngữ mới

Không ghi đè bản cũ. Tạo composition mới, ví dụ:

- `Reel`: bản tiếng Anh.
- `ReelVI`: bản tiếng Việt.

Mỗi phiên bản cần audio, caption và thời lượng scene riêng. Animation có thể dùng chung và tự co giãn theo scene.
