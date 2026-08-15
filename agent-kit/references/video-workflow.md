# Quy trình dựng video Remotion

## Thứ tự bắt buộc

1. Khóa brief.
2. Kiểm tra dữ liệu.
3. Duyệt kịch bản.
4. Chuẩn bị hoặc đo voice-over.
5. Tạo beat map.
6. Tạo asset map và prompt từng scene.
7. Dựng từng scene độc lập.
8. Ghép scene theo audio.
9. Đồng bộ caption.
10. Duyệt frame quan trọng.
11. Render bản cuối.

## Quy tắc Remotion

- Đặt asset trong `public/` và dùng `staticFile()`.
- Dùng `Img`, `Audio` và các component Remotion để tài nguyên được chờ tải trước khi render.
- Dùng `Composition` để đăng ký kích thước, fps và thời lượng.
- Dùng `Series` cho các scene nối tiếp. Dùng `Sequence` cho nội dung xuất hiện trễ hoặc bị giới hạn thời lượng.
- Premount các sequence có tài nguyên nặng khi cần.
- Dùng `useCurrentFrame`, `interpolate`, `spring` và `useVideoConfig` cho chuyển động.
- Clamp interpolation khi giá trị không được vượt phạm vi.
- Không dùng CSS animation, `setTimeout`, thời gian hệ thống hoặc giá trị ngẫu nhiên không xác định.

## Audio và caption

- Voice-over quyết định timeline. Không ép audio chạy nhanh để vừa timeline cũ nếu người dùng không yêu cầu.
- Khi thay audio, đo lại thời lượng, khoảng nghỉ, điểm cắt, caption và tổng số frame.
- Giữ audio chạy liên tục trên timeline chính khi câu chuyện được thu thành một file.
- Caption phải có timestamp thực. Không chia đều theo số từ.

## Asset

- Không ghi đè asset tốt. Tạo `-v2`, `-v3` khi thử biến thể.
- Ghi rõ scene, vai trò, kích thước, nguồn, quyền sử dụng và trạng thái duyệt trong asset map.
- Nhân vật lặp lại phải có ảnh nhận diện tham chiếu.
- Kiểm tra viền nền trong suốt và crop trên đúng khung 9:16.

## Duyệt

- Duyệt ít nhất một frame cho mỗi scene.
- Kiểm tra ba giây đầu, mọi điểm cắt, headline, số liệu, tên riêng, caption và CTA.
- Chỉ render toàn bộ khi người dùng đã duyệt nội dung, hình, audio và CTA.
