# ZAD Agency Website

Website của ZAD Agency, dựng từ file Figma "Website ZAD Agency" (khung desktop 1440px).

Dự án dùng **Next.js 16** (App Router, TypeScript). Toàn bộ nội dung (chữ, dự án, đội ngũ, liên hệ) nằm trong các file **JSON** ở thư mục `data/`, nên sửa nội dung không cần đụng vào code.

## Chạy dự án

Cần Node.js 20.9 trở lên.

```bash
npm install
npm run dev        # chạy thử ở http://localhost:3000
npm run build      # build bản production
npm start          # chạy bản đã build
npm run typecheck  # kiểm tra TypeScript
```

Deploy lên Vercel không cần cấu hình thêm: import repo và bấm Deploy. Nên đặt biến môi trường `NEXT_PUBLIC_SITE_URL` là tên miền thật (ví dụ `https://zad.agency`) để ảnh chia sẻ mạng xã hội (`public/images/og-image.jpg`) có đường dẫn đúng. Nếu chưa đặt, web tự dùng tên miền chính Vercel cấp cho project.

## Các trang

| Đường dẫn | Trang trong Figma | File |
| --- | --- | --- |
| `/` | Home Page + Intro Loading | `app/page.tsx` |
| `/about` | About | `app/about/page.tsx` |
| `/work` | Work (có bộ lọc theo dịch vụ) | `app/work/page.tsx` |
| `/contact` | Contact | `app/contact/page.tsx` |

## Sửa nội dung (thư mục `data/`)

| File | Nội dung |
| --- | --- |
| `site.json` | Email, số điện thoại, địa chỉ, link mạng xã hội, menu, chữ ở footer |
| `home.json` | Hero, 4 dịch vụ (tiêu đề, mô tả), video mục Dịch vụ, tiêu đề "Câu chuyện chúng tôi viết", logo khách hàng |
| `projects.json` | Danh sách dự án và các nhóm lọc ở trang Work |
| `team.json` | Đội ngũ: tên, chức danh, ảnh |
| `about.json` | Trang About: đoạn giới thiệu, slider ảnh, số liệu thành tựu, hệ sinh thái 100B, tuyển dụng |
| `pages.json` | Chữ ở đầu trang Work và trang Contact, ảnh trang Contact (`photo`, `photoFocus` chỉnh phần ảnh được giữ lại) |

**Thêm một dự án:** chép ảnh vào `public/images/projects/` (nên đặt tên theo `id` của dự án, JPG rộng khoảng 2400px), rồi thêm một dòng vào `projects.json`:

```json
{ "id": "ten-du-an", "title": "Tên dự án", "image": "/images/projects/ten-du-an.jpg", "categories": ["brand", "ads"] }
```

- `categories` nhận một hoặc nhiều giá trị: `brand`, `print`, `web`, `ads`.
- Thêm `"featured": 1` đến `7` nếu muốn dự án hiện ở mục "Dự án nổi bật" trên trang chủ. Số nhỏ đứng trước.
- Lưới dự án tự xếp theo mẫu bố cục trong Figma, không cần chỉnh layout.

**Video và logo:** các trường dưới đây đang để trống, chỉ cần điền đường dẫn file là web tự dùng.

| Trường | Tác dụng |
| --- | --- |
| `home.json` → `hero.video` | Video nền toàn màn hình của hero (đang dùng video Wistia `zzsyb2n1je`). `mp4` là bản 1080p cho máy tính, `mp4Mobile` là bản 720p cho điện thoại, `poster` là ảnh hiện trong lúc tải. Đặt `"video": null` thì dùng ảnh vòng tròn trong Figma. |
| `home.json` → `hero.showreel` | Video slide dự án, thay cho câu tiêu đề sau `hero.showreelAfter` giây (mặc định 10). |
| `home.json` → `services.video` | Video dọc chạy ở ô bên trái mục Dịch vụ (đang dùng video Wistia `8y8dg9k8gm`, bản 540p). `mp4` là link video, `poster` là ảnh hiện trong lúc tải. Đặt `"video": null` thì các ảnh trong `services.reel` chạy ngẫu nhiên. |
| `home.json` → `clients.items[].logo` | Logo màu của khách hàng (PNG nền trong suốt, tỉ lệ ô 264x99). Trên nền xanh, logo hiện màu trắng; rê chuột thì ô chuyển trắng và logo hiện màu thật. |
| `team.json` + `about.json` → `team.initialVisible` | Số người hiện sẵn (10 = 2 hàng). Thêm người vào `team.json` thì nút mũi tên tự hiện để mở rộng. |

Video có thể để trong `public/videos/` hoặc dùng link mp4 trực tiếp. Với video Wistia: mở `https://fast.wistia.com/embed/medias/<id>.json`, lấy link của bản `1080p` và `720p` trong danh sách `assets`, đổi đuôi `.bin` thành `.mp4`. Nếu thay video trên Wistia thì các link này đổi theo, cần cập nhật lại.

**Ảnh đội ngũ:** trường `focus` (ví dụ `"57%"`) chỉnh điểm căn giữa theo chiều ngang khi ảnh bị cắt.

**Carousel trang About:** khung ảnh theo tỉ lệ ngang của Figma (1318x513, điện thoại 4:3) nên ảnh bị cắt bớt trên dưới. Trường `focus` của từng ảnh trong `about.json` → `gallery` (ví dụ `"50% 15%"`, số sau là chiều dọc) chọn phần ảnh được giữ lại; số nhỏ hơn giữ phần phía trên.

## Cấu trúc code

```
app/            layout, các trang, globals.css (toàn bộ giao diện)
components/     Header + menu, Intro, accordion dịch vụ, lưới dự án, lightbox, slider...
lib/            đọc dữ liệu JSON (content.ts) và thuật toán xếp lưới dự án (workLayout.ts)
data/           nội dung dạng JSON
public/images/  ảnh (projects/ là thumbnail dự án; Next.js tự tối ưu sang WebP/AVIF khi hiển thị)
public/fonts/   Inter (hỗ trợ tiếng Việt)
```

## Tính năng

- Intro loading màn hình xanh với logo ZAD, chỉ hiện một lần mỗi phiên trình duyệt (bấm vào để bỏ qua).
- Hero: rê chuột vào cụm chữ nào thì chỉ cụm đó đổi thành chữ trắng trên nền xanh.
- "Câu chuyện" chạy vào từ bên trái, "Chúng tôi viết" chạy vào từ bên phải khi cuộn tới section này; hiệu ứng tự chạy trọn trong khoảng 3 giây (chỉnh thời gian ở `.story__title` trong `app/globals.css`).
- Dấu cộng dưới lưới dự án (trang chủ): cuộn tới thì dấu cộng dừng giữa màn hình, hình tròn xanh và dấu cộng phóng to dần cho tới khi màn hình chuyển hẳn sang xanh ZAD, nối liền vào mục Khách hàng nền xanh (tham khảo theme Adon). Chỉnh độ dài cuộn bằng biến `--zoom-travel` trong `app/globals.css`.
- Hero trên máy tính giữ đúng tỉ lệ 16:9 của video để không bị cắt; trên điện thoại hero phủ kín màn hình.
- Header ẩn khi cuộn xuống, hiện lại khi cuộn lên. Menu toàn màn hình mở từ icon góc phải.
- Mục Dịch vụ: ô bên trái luôn chạy video (hoặc ảnh ngẫu nhiên nếu chưa có video), rê chuột hay chọn dịch vụ nào cũng không đổi.
- Card dự án: vòng "View project" chạy theo con trỏ. Bấm vào card để xem ảnh lớn (dùng được phím mũi tên và Esc).
- Trang Work: lọc theo dịch vụ, có thể dẫn link thẳng tới một bộ lọc, ví dụ `/work#brand`.
- Trang About: carousel ảnh trượt ngang có chấm điều hướng (tự chuyển ảnh cho tới khi người xem bấm chấm hoặc vuốt, sau đó đứng yên ở ảnh đã chọn); 3 vòng tròn thành tựu hiện lần lượt từ nhỏ đến lớn, cách nhau 0,7 giây, kèm số đếm lên; thẻ hệ sinh thái đổi sang xanh nhạt khi rê chuột; dòng chữ "Tư duy thiết kế..." chạy ngang, đọc xuôi từ trái sang phải.
- Hiệu ứng xuất hiện khi cuộn tới (fade up on scroll) dùng chung một nhịp chậm khoảng 2 giây. Chỉnh cho cả web ở các biến `--reveal-move`, `--reveal-fade`, `--reveal-distance` đầu phần "Scroll reveal" trong `app/globals.css`.
- Cuộn mượt có quán tính trên máy tính (thư viện Lenis, `components/SmoothScroll.tsx`): con lăn chuột trôi êm thay vì nhảy từng nấc. Độ trôi chỉnh bằng `lerp` (nhỏ hơn = trôi lâu hơn). Điện thoại giữ cuộn gốc của máy.
- Chuyển trang bằng vòng xanh ZAD loang ra từ chỗ bấm, phủ màn hình rồi tan dần khi trang mới hiện (`components/PageTransition.tsx`).
- Hiệu ứng hiện ra bắt đầu khi phần tử còn cách mép dưới màn hình một đoạn (12% chiều cao màn hình), nên cuộn nhanh không phải chờ khoảng trống.
- Responsive cho desktop, tablet và mobile. Tôn trọng cài đặt "giảm chuyển động" của hệ điều hành.

## Font chữ

Font thương hiệu là **VL Funnel Sans** (theo brand guide). Font này không có bản web công khai, nên site đang dùng **Inter** làm font dự phòng vì Inter hỗ trợ đầy đủ tiếng Việt.

Để dùng đúng VL Funnel Sans, chép các file `.woff2` vào `public/fonts/` rồi thêm vào đầu `app/globals.css`:

```css
@font-face {
  font-family: "VL Funnel Sans";
  src: url("/fonts/VLFunnelSans-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
/* lặp lại cho Light (300), Medium (500), SemiBold (600) */
```

CSS đã khai báo `font-family: "VL Funnel Sans", "Inter", ...` nên font mới sẽ tự được dùng ngay.
