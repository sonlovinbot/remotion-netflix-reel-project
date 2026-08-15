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
├── agent-kit/                Kiểm tra máy, quy trình và tạo Project 2
├── .agents/skills/           Skill tự nhận diện cho Codex
├── .claude/skills/           Skill tự nhận diện cho Claude Code
├── templates/new-project/    Bộ khung cho video tiếp theo
├── project-manifest.json     Bản đồ tổng của Project 1
├── AGENTS.md                 Chỉ dẫn cho Codex và agent tương thích
├── CLAUDE.md                 Chỉ dẫn cho Claude Code
└── project/                  Dự án Remotion hoàn chỉnh
    ├── public/assets/        Toàn bộ ảnh, audio, logo
    ├── src/                  Mã nguồn và các scene
    ├── package.json
    └── bun.lock
```

## Bắt đầu mà không dùng Terminal

1. Tải repository bằng **GitHub Desktop** hoặc nút **Code → Download ZIP** trên GitHub.
2. Nếu dùng ZIP, giải nén thư mục. Nếu dùng GitHub Desktop, chọn **Show in Finder** hoặc **Show in Explorer**.
3. Mở Codex hoặc ChatGPT có quyền làm việc với file trên máy.
4. Chọn thư mục `chatgpt-remotion-workflow-kit` làm workspace.
5. Gõ lệnh phù hợp với agent:

```text
Codex:       $remotion-video setup
Claude Code: /remotion-video setup
```

Hoặc sao chép prompt dưới đây:

> Hãy dùng Skill remotion-video để chuẩn bị dự án. Trước tiên chỉ kiểm tra máy, chưa cài đặt hoặc thay đổi gì. Báo phần đã có, phần còn thiếu, dung lượng dự kiến và thao tác đề xuất, sau đó chờ tôi xác nhận. Khi tôi đồng ý, hãy cài phần còn thiếu, kiểm tra Project 1, mở ReelVI và gửi link preview local.

AI sẽ kiểm tra trước và xin xác nhận. Sau khi được đồng ý, AI tự thực hiện phần kỹ thuật. Khi preview mở, bạn chỉ cần xem video và mô tả điều muốn sửa bằng tiếng Việt.

## Skill có thể làm gì?

- `setup`: kiểm tra máy, xin xác nhận, cài và mở Project 1.
- `preview`: mở Remotion Studio mà không sửa nội dung.
- `doctor`: tìm nguyên nhân khi dự án không chạy.
- `edit`: sửa đúng scene, caption, audio hoặc asset được yêu cầu.
- `new-project`: tạo Project 2 trong thư mục riêng.
- `review`: kiểm tra dữ liệu, hình, tiếng, caption và CTA.
- `render`: xuất một composition đã được duyệt.

Để tạo video khác từ quy trình này:

```text
Codex:       $remotion-video new-project
Claude Code: /remotion-video new-project
```

Nếu chỉ muốn xem giáo trình, mở file `docs/huong-dan.html` bằng trình duyệt. File này trình bày toàn bộ quy trình bằng ngôn ngữ dành cho người mới.

Muốn xem đầy đủ asset, voice-over, prompt tổng và prompt riêng cho từng scene của video Netflix, mở [Production Guide online](https://sonlovinbot.github.io/remotion-netflix-reel-project/).

## Xem video thành phẩm

Xem video tiếng Việt hoàn chỉnh trên [YouTube Shorts](https://youtube.com/shorts/CcbWg6tQWvM). Video cũng được nhúng ngay trong Production Guide để học viên vừa xem vừa đối chiếu asset và prompt.

## Xem những composition nào?

- `ReelVI`: bản tiếng Việt đầy đủ và CTA.
- `Reel`: bản tiếng Anh.
- `CTA`: riêng phần giới thiệu và lời mời Zoom.
- `Scene1` đến `Scene5`: xem riêng từng cảnh.

## Ba hướng học tiếp

1. Xem Project 1 và đối chiếu source với Production Guide.
2. Sửa một chi tiết nhỏ trong một scene rồi kiểm tra bằng frame.
3. Tạo Project 2 bằng template sạch, không sao chép nội dung Netflix.

## Bài thực hành đầu tiên

Sao chép prompt này vào ChatGPT:

> Trong Scene 1, hãy đổi một headline theo nội dung tôi cung cấp. Giữ nguyên hình, audio, thời lượng và tất cả scene khác. Sau khi sửa, render một frame đúng thời điểm headline xuất hiện để tôi kiểm tra, rồi gửi lại link preview.

## Lưu ý về asset và bản quyền

Repo giữ nguyên asset của dự án mẫu để phục vụ học tập và tái tạo quy trình. Trước khi dùng cho quảng cáo hoặc sản phẩm thương mại, bạn cần tự xác minh quyền sử dụng hình ảnh, logo, âm thanh và nhân vật.

## Dành cho người hướng dẫn kỹ thuật

Các thao tác cài và chạy đã được lưu trong `project/package.json`. Người học không cần sử dụng trực tiếp. Nếu cần kiểm tra thủ công, dự án dùng Bun và Remotion 4.0.409.
