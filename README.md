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

Deploy lên Vercel không cần cấu hình thêm: import repo và bấm Deploy. Nên đặt biến môi trường `NEXT_PUBLIC_SITE_URL` là tên miền thật (ví dụ `https://zad.agency`) để ảnh chia sẻ mạng xã hội có đường dẫn đúng.

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
| `home.json` | Hero, 4 dịch vụ (tiêu đề, mô tả, ảnh), tiêu đề "Câu chuyện chúng tôi viết", logo khách hàng |
| `projects.json` | Danh sách dự án và các nhóm lọc ở trang Work |
| `team.json` | Đội ngũ: tên, chức danh, ảnh |
| `about.json` | Trang About: đoạn giới thiệu, slider ảnh, số liệu thành tựu, hệ sinh thái 100B, tuyển dụng |
| `pages.json` | Chữ ở đầu trang Work và trang Contact |

**Thêm một dự án:** chép ảnh vào `public/images/`, rồi thêm một dòng vào `projects.json`:

```json
{ "id": "ten-du-an", "title": "Tên dự án", "image": "/images/ten-anh.jpg", "categories": ["brand", "ads"] }
```

- `categories` nhận một hoặc nhiều giá trị: `brand`, `print`, `web`, `ads`.
- Thêm `"featured": 1` đến `7` nếu muốn dự án hiện ở mục "Dự án nổi bật" trên trang chủ. Số nhỏ đứng trước.
- Lưới dự án tự xếp theo mẫu bố cục trong Figma, không cần chỉnh layout.

**Ảnh đội ngũ:** trường `focus` (ví dụ `"57%"`) chỉnh điểm căn giữa theo chiều ngang khi ảnh bị cắt.

## Cấu trúc code

```
app/            layout, các trang, globals.css (toàn bộ giao diện)
components/     Header + menu, Intro, accordion dịch vụ, lưới dự án, lightbox, slider...
lib/            đọc dữ liệu JSON (content.ts) và thuật toán xếp lưới dự án (workLayout.ts)
data/           nội dung dạng JSON
public/images/  ảnh xuất từ Figma (Next.js tự tối ưu sang WebP/AVIF khi hiển thị)
public/fonts/   Inter (hỗ trợ tiếng Việt)
```

## Tính năng

- Intro loading màn hình xanh với logo ZAD, chỉ hiện một lần mỗi phiên trình duyệt (bấm vào để bỏ qua).
- Header ẩn khi cuộn xuống, hiện lại khi cuộn lên. Menu toàn màn hình mở từ icon góc phải.
- Accordion dịch vụ ở trang chủ, ảnh bên trái đổi theo dịch vụ đang mở.
- Card dự án: vòng "View project" chạy theo con trỏ. Bấm vào card để xem ảnh lớn (dùng được phím mũi tên và Esc).
- Trang Work: lọc theo dịch vụ, có thể dẫn link thẳng tới một bộ lọc, ví dụ `/work#brand`.
- Trang About: slider ảnh, số liệu tự đếm lên, vòng tròn thành tựu tự vẽ khi cuộn tới, dòng chữ chạy ngang.
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
