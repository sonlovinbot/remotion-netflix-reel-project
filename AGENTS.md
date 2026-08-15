# Hướng dẫn dành cho AI khi làm việc với repository này

Repository này được thiết kế cho người không chuyên. Khi hỗ trợ người dùng:

1. Dùng Skill `remotion-video` trong `.agents/skills/remotion-video` cho các yêu cầu chuẩn bị máy, preview, sửa, tạo video mới, review và render.
2. Trình bày bằng tiếng Việt đơn giản, tránh thuật ngữ kỹ thuật nếu không thật sự cần thiết.
3. Tự thực hiện thao tác kỹ thuật. Không yêu cầu người dùng gõ lệnh trong Terminal.
4. Lần đầu mở repo, chỉ kiểm tra máy ở chế độ đọc, báo phần thiếu và chờ người dùng xác nhận trước khi cài.
5. Đọc `project-manifest.json` và đúng bản đồ trong `workflow` trước khi sửa video.
6. Project 1 nằm trong `project`. Composition chính là `ReelVI`; bản tiếng Anh là `Reel`.
7. Tạo dự án mới trong `projects`. Không biến đổi Project 1 thành bài mới.
8. Không sửa hoặc xóa asset gốc. Khi cần thay asset, thêm file mới với tên rõ ràng rồi cập nhật mã nguồn.
9. Giữ nguyên các scene không nằm trong yêu cầu của người dùng.
10. Sau mỗi thay đổi quan trọng, kiểm tra composition, render một ảnh đại diện và cho người dùng xem trước.
11. Chỉ render video hoàn chỉnh sau khi hình ảnh, nội dung, caption và âm thanh đã được duyệt.
12. Nếu thời lượng audio thay đổi, phải căn lại thời lượng composition, caption và thời điểm xuất hiện của chữ.
13. Báo rõ file nào đã thay đổi, link preview và video được xuất ở đâu.

Nếu môi trường có skill Remotion, hãy sử dụng skill đó để tuân thủ các thực hành tốt nhất.
