# ZAD Agency Website

Website của ZAD Agency, dựng từ file Figma "Website ZAD Agency" (khung desktop 1440px).

Site tĩnh gồm HTML, CSS và JavaScript thuần. Không cần build và không phụ thuộc thư viện ngoài, nên deploy được lên mọi hosting tĩnh (Vercel, Netlify, GitHub Pages, cPanel...).

## Các trang

| File | Trang trong Figma |
| --- | --- |
| `index.html` | Home Page + Intro Loading |
| `about.html` | About |
| `work.html` | Work (có bộ lọc theo dịch vụ) |
| `contact.html` | Contact |

## Chạy thử trên máy

```bash
python3 -m http.server 8000
# mở http://localhost:8000
```

## Cấu trúc

```
assets/
  css/style.css   toàn bộ giao diện (màu, font, layout, responsive)
  css/fonts.css   khai báo font Inter tự host
  js/main.js      intro, menu, accordion, lightbox, bộ lọc Work, slider, đếm số
  img/            ảnh xuất từ Figma (đã nén)
  fonts/          Inter (hỗ trợ tiếng Việt)
```

## Tính năng

- Intro loading màn hình xanh với logo ZAD, chỉ hiện ở lần đầu mở trang trong mỗi phiên (bấm vào để bỏ qua).
- Header ẩn khi cuộn xuống, hiện lại khi cuộn lên. Menu toàn màn hình mở từ icon góc phải.
- Accordion dịch vụ ở trang chủ, ảnh bên trái đổi theo dịch vụ đang mở.
- Card dự án: vòng "View project" chạy theo con trỏ. Bấm vào card để xem ảnh lớn (lightbox, dùng được phím mũi tên và Esc).
- Trang Work: lọc theo All / Brand identity / Packaging / Print / Website / App / Advertising. Có thể dẫn link thẳng tới một bộ lọc, ví dụ `work.html#brand`.
- Trang About: slider ảnh, số liệu tự đếm lên, vòng tròn thành tựu tự vẽ khi cuộn tới, dòng chữ chạy ngang.
- Responsive cho desktop, tablet và mobile. Tôn trọng cài đặt "giảm chuyển động" của hệ điều hành.

## Chỉnh sửa nội dung

- **Thêm hoặc sửa dự án ở trang Work:** sửa mảng `PROJECTS` ở đầu `assets/js/main.js`. Mỗi dự án có `title`, `img` (tên file trong `assets/img/`) và `cat` (một hoặc nhiều giá trị `brand`, `print`, `web`, `ads`). Lưới tự xếp theo mẫu bố cục trong Figma.
- **Dự án nổi bật ở trang chủ:** sửa trực tiếp trong `index.html`, phần `<div class="works">`.
- **Link mạng xã hội:** hiện đang trỏ tới trang chủ Behance, Facebook, Instagram. Tìm `behance.net`, `facebook.com`, `instagram.com` trong các file HTML và thay bằng link trang của ZAD.

## Font chữ

Font thương hiệu là **VL Funnel Sans** (theo brand guide). Font này không có bản web công khai, nên site đang dùng **Inter** làm font dự phòng vì Inter hỗ trợ đầy đủ tiếng Việt.

Để dùng đúng VL Funnel Sans:

1. Chép các file `.woff2` của VL Funnel Sans vào `assets/fonts/`.
2. Thêm vào đầu `assets/css/fonts.css`:

```css
@font-face {
  font-family: "VL Funnel Sans";
  src: url("../fonts/VLFunnelSans-Regular.woff2") format("woff2");
  font-weight: 400;
  font-display: swap;
}
/* lặp lại cho Light (300), Medium (500), SemiBold (600) */
```

CSS đã khai báo `font-family: "VL Funnel Sans", "Inter", ...` nên font mới sẽ tự được dùng ngay.
