# Game Tết

Nền tảng nhiều trò chơi cho gia đình. React + Vite, Firebase (Anonymous Auth + Firestore), triển khai GitHub Pages.
Giai đoạn này: đăng nhập, trang HOME, chat realtime, danh mục game, routing. **Chưa có gameplay.**

## Chạy thử
```bash
npm install
npm run dev      # cấu hình Firebase nằm ở src/services/firebaseConfig.js
```

## Thiết lập Firebase (làm một lần)
1. **Authentication → Sign-in method → bật Anonymous.**
2. **Authentication → Settings → Authorized domains → thêm `<tên-github>.github.io`** (localhost có sẵn).
3. **Firestore Database → Create database** (production mode).
4. **Tạo mã gia đình:** Firestore → Start collection `config` → Document ID `access` → field `code` (string) = mã bí mật của bạn (nên ≥ 12 ký tự). Client không đọc được tài liệu này; chỉ Rules dùng nó để đối chiếu.
5. **Đẩy Rules:** `npx firebase-tools login` rồi `npx firebase-tools deploy --only firestore`
   (hoặc dán `firebase/firestore.rules` vào Console → Firestore → Rules → Publish).
6. **Hạn chế API key** (Google Cloud Console → APIs & Services → Credentials → Browser key của dự án):
   - *Application restrictions → Websites:* `https://<tên-github>.github.io/*` và `http://localhost:5173/*`.
   - *API restrictions → Restrict key:* chỉ **Identity Toolkit API**, **Token Service API**, **Cloud Firestore API**.
   - Thiếu API nào thì Console báo lỗi 403 khi chạy; thêm đúng API đó, đừng chọn "Don't restrict".
7. **Ngân sách:** Google Cloud → Billing → Budgets & alerts, đặt cảnh báo để phát hiện lạm dụng sớm.
8. (Khuyến nghị) **App Check** với reCAPTCHA Enterprise để chỉ trình duyệt chạy đúng site mới gọi được Firestore.

## Triển khai GitHub Pages
1. Tạo repo (ví dụ `game-tet`), push mã lên nhánh `main`.
2. Settings → Pages → Source: **GitHub Actions**.
3. Push → workflow `Deploy to GitHub Pages` tự build và đăng. Địa chỉ: `https://<tên-github>.github.io/game-tet/`.
4. Kiểm tra sau deploy: mở `#/`, đăng nhập, tải lại (F5) tại `#/home` và `#/caro` — không được 404; mở Console trình duyệt, không có lỗi CSP/403.

Vite dùng `base: './'` + `HashRouter`, nên URL dạng `/#/home` và tải lại trang con không bị 404 trên GitHub Pages.

## Thêm một trò chơi
Thêm object vào `src/data/games.js`, đặt `status: 'available'` và `load: () => import('../games/ten-game')`.
Route `/<slug>` và `/<slug>/:roomId` được sinh tự động. Mở ghi cho `rooms` trong `firebase/firestore.rules` khi làm multiplayer.

## Mô hình bảo mật
| Lớp | Cách làm |
|---|---|
| Danh tính | Firebase Anonymous Auth cấp UID riêng. Tên hiển thị không dùng để xác thực; hai người trùng tên vẫn là hai UID khác nhau. |
| Cổng vào | Phải nhập đúng mã gia đình mới tạo được `members/{uid}`; mọi quyền đọc/ghi khác đều yêu cầu là thành viên. |
| Dữ liệu | `users` chỉ chủ sở hữu đọc/ghi; `messages` chỉ tạo, không sửa/xóa; `senderName` phải khớp hồ sơ; nội dung ≤ 500 ký tự; `createdAt` do server; ≥ 1 giây giữa 2 tin; `rooms`/`games` khóa ghi; mặc định từ chối. |
| Frontend | React tự escape nội dung; làm sạch ký tự điều khiển/đảo chiều; CSP tùy chọn (build với `ENABLE_CSP=1`, mặc định tắt vì chưa kiểm thử); không có Admin key hay service account. |
| Cấu hình | Một file `src/services/firebaseConfig.js` (công khai), khởi tạo trong `src/services/firebase.js`. |

**Về API key:** `apiKey` của Firebase web là định danh công khai, luôn nằm trong JS gửi cho trình duyệt, **không** phải bí mật. Bảo vệ thật sự đến từ Security Rules, hạn chế key (bước 6), App Check và ngân sách cảnh báo.
Service Account / Admin SDK private key (file JSON `*-adminsdk-*.json`) là bí mật thật sự: không bao giờ đưa vào repo hay frontend (đã nằm trong `.gitignore`).

## Giới hạn đã biết
- Đăng nhập ẩn danh gắn với trình duyệt: xóa dữ liệu trình duyệt hoặc đăng xuất = mất UID cũ, đổi máy = tài khoản mới (tin cũ vẫn giữ tên cũ).
- Mã gia đình bị lộ thì người ngoài vào được: đổi `config/access` để chặn người mới (thành viên cũ vẫn còn quyền, cần xóa `members/{uid}` nếu muốn thu hồi).
- Chưa có kiểm duyệt nội dung chat; chưa có vai trò quản trị.
- Rules chưa có test tự động (nên thêm với Firebase Emulator khi làm phòng chơi).

## Điện thoại
Site dùng được trên điện thoại. Khi để dọc, màn hình nhắc xoay ngang (chỉ cho thiết bị cảm ứng rộng ≤ 820px).
