# ChatGPT × Remotion Workflow Kit

Bộ tài liệu và dự án mẫu giúp người không chuyên học cách dùng ChatGPT để tạo video motion bằng Remotion.

Bạn không cần biết code. Bạn cũng không cần tự mở Terminal: hãy mở thư mục này bằng Codex/ChatGPT, sau đó dùng các prompt có sẵn để AI chuẩn bị môi trường, chạy preview, sửa video và render.

## Trong repository có gì?

```text
chatgpt-remotion-workflow-kit/
├── README.md                 Hướng dẫn bắt đầu
├── QUY-TRINH.md              Quy trình từ ý tưởng đến video
├── DIEU-KIEN-MAY.md          Máy tính và phần chuẩn bị
├── KINH-NGHIEM.md            Bài học thực tế, lỗi thường gặp
├── docs/
│   ├── huong-dan.html        Giáo trình mở bằng trình duyệt
│   ├── netflix-reel-production-guide.html
│   └── 7-buoc-tao-video.md
├── prompts/                  Prompt có thể sao chép vào ChatGPT
├── workflow/                 Mẫu brief, beat map và checklist
├── AGENTS.md                 Chỉ dẫn để AI tự vận hành dự án
└── project/                  Dự án Remotion hoàn chỉnh
    ├── public/assets/        Toàn bộ ảnh, audio, logo
    ├── src/                  Mã nguồn và các scene
    ├── package.json
    └── bun.lock
```

## Bắt đầu mà không dùng Terminal

1. Tải repository về máy bằng nút **Code → Download ZIP** trên GitHub.
2. Giải nén thư mục.
3. Mở Codex hoặc ChatGPT có quyền làm việc với file trên máy.
4. Chọn thư mục `chatgpt-remotion-workflow-kit` làm workspace.
5. Sao chép prompt dưới đây:

> Hãy đọc README.md và QUY-TRINH.md trong thư mục này. Tôi là người không chuyên và không muốn dùng Terminal. Hãy tự kiểm tra máy, cài phần cần thiết cho project, mở dự án Remotion trong thư mục project và gửi tôi link preview bản ReelVI. Không thay đổi nội dung dự án ở bước này.

AI sẽ tự thực hiện phần kỹ thuật. Khi preview mở, bạn chỉ cần xem video và mô tả điều muốn sửa bằng tiếng Việt.

Nếu chỉ muốn xem giáo trình, mở file `docs/huong-dan.html` bằng trình duyệt. File này trình bày toàn bộ quy trình bằng ngôn ngữ dành cho người mới.

Muốn xem đầy đủ asset, voice-over, prompt tổng và prompt riêng cho từng scene của video Netflix, mở [Production Guide online](https://sonlovinbot.github.io/remotion-netflix-reel-project/).

## Xem video thành phẩm

Xem video tiếng Việt hoàn chỉnh trên [YouTube Shorts](https://youtube.com/shorts/CcbWg6tQWvM). Video cũng được nhúng ngay trong Production Guide để học viên vừa xem vừa đối chiếu asset và prompt.

## Xem những composition nào?

- `ReelVI`: bản tiếng Việt đầy đủ và CTA.
- `Reel`: bản tiếng Anh.
- `CTA`: riêng phần giới thiệu và lời mời Zoom.
- `Scene1` đến `Scene5`: xem riêng từng cảnh.

## Bài thực hành đầu tiên

Sao chép prompt này vào ChatGPT:

> Trong Scene 1, hãy đổi một headline theo nội dung tôi cung cấp. Giữ nguyên hình, audio, thời lượng và tất cả scene khác. Sau khi sửa, render một frame đúng thời điểm headline xuất hiện để tôi kiểm tra, rồi gửi lại link preview.

## Lưu ý về asset và bản quyền

Repo giữ nguyên asset của dự án mẫu để phục vụ học tập và tái tạo quy trình. Trước khi dùng cho quảng cáo hoặc sản phẩm thương mại, bạn cần tự xác minh quyền sử dụng hình ảnh, logo, âm thanh và nhân vật.

## Dành cho người hướng dẫn kỹ thuật

Các thao tác cài và chạy đã được lưu trong `project/package.json`. Người học không cần sử dụng trực tiếp. Nếu cần kiểm tra thủ công, dự án dùng Bun và Remotion 4.0.409.
