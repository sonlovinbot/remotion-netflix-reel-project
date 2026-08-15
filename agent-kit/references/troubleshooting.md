# Chẩn đoán dễ hiểu

## Không có Bun hoặc Node

Báo runtime còn thiếu. Đưa ra phương án cài phù hợp hệ điều hành, dung lượng dự kiến và chờ xác nhận.

## Cài thư viện thất bại

Kiểm tra mạng, dung lượng trống, quyền ghi thư mục và phiên bản runtime. Không xóa lockfile. Không tự đổi phiên bản Remotion.

## Preview không mở

Kiểm tra tiến trình, log đầu ra và cổng đang dùng. Thử một cổng khác từ 3000 đến 3010. Báo lại link mới.

## Asset không hiện

Kiểm tra file tồn tại dưới `public`, đường dẫn phân biệt chữ hoa chữ thường và việc dùng `staticFile()`.

## Audio hoặc caption lệch

Đo lại file audio thật. So sánh tổng thời lượng, điểm nghỉ, scene map và timestamp caption. Không sửa bằng cách đoán.

## Render lỗi

Thử liệt kê composition, render một frame và kiểm tra asset trước. Chỉ render toàn bộ sau khi frame đại diện đạt.

## Máy chậm

Đóng ứng dụng nặng, preview ở độ phân giải thấp hơn nếu cần và render scene nhỏ trước. Không hạ chất lượng bản cuối khi chưa hỏi người dùng.
