// CẤU HÌNH FIREBASE - sửa ở đây nếu đổi dự án Firebase.
// Đây là cấu hình WEB công khai (ai mở trang web cũng thấy), KHÔNG phải bí mật.
// Bảo mật thật sự nằm ở Firestore Rules và hạn chế API key trong Google Cloud.
// TUYỆT ĐỐI không dán Service Account / Admin SDK private key (file *-adminsdk-*.json) vào đây.
export const firebaseConfig = {
  apiKey: 'AIzaSyAV_r-sgWXEfvsivOvqvv_lOi5DPVJc8Ew',
  authDomain: 'game-d3dda.firebaseapp.com',
  projectId: 'game-d3dda',
  storageBucket: 'game-d3dda.firebasestorage.app',
  messagingSenderId: '596222803020',
  appId: '1:596222803020:web:6e98fcea3a25c5968a88e9',
};
