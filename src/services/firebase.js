// Điểm khởi tạo Firebase DUY NHẤT. Mọi module khác import { auth, db } từ đây.
import { initializeApp } from 'firebase/app';
import { initializeAuth, indexedDBLocalPersistence, browserLocalPersistence } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { firebaseConfig as config } from './firebaseConfig';

export const isFirebaseConfigured = Boolean(config.apiKey && config.projectId && config.appId);

let auth = null;
let db = null;
if (isFirebaseConfigured) {
  const app = initializeApp(config);
  auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
  db = getFirestore(app);
}
export { auth, db };

const MSG = {
  'auth/email-already-in-use': 'Tên đăng nhập này đã có người dùng.',
  'auth/invalid-credential': 'Sai tên đăng nhập hoặc mật khẩu.',
  'auth/invalid-login-credentials': 'Sai tên đăng nhập hoặc mật khẩu.',
  'auth/wrong-password': 'Sai tên đăng nhập hoặc mật khẩu.',
  'auth/user-not-found': 'Sai tên đăng nhập hoặc mật khẩu.',
  'auth/weak-password': 'Mật khẩu quá yếu. Hãy dùng mật khẩu dài hơn.',
  'auth/operation-not-allowed': 'Chưa bật đăng nhập Email/Password trong Firebase Authentication.',
  'auth/network-request-failed': 'Không kết nối được. Kiểm tra mạng rồi thử lại.',
  'auth/too-many-requests': 'Sai quá nhiều lần. Hãy chờ một lúc rồi thử lại.',
};

export function explainError(e) {
  const c = e?.code || '';
  if (MSG[c]) return MSG[c];
  if (c.includes('permission-denied')) return 'Bạn không có quyền thực hiện thao tác này.';
  if (c.includes('unavailable')) return 'Không kết nối được Firebase. Kiểm tra mạng rồi thử lại.';
  if (c.includes('resource-exhausted')) return 'Quá nhiều yêu cầu. Hãy chờ một lúc rồi thử lại.';
  if (c.includes('referer')) return 'API key đang chặn tên miền này. Kiểm tra mục hạn chế API key.';
  return e?.message || 'Đã xảy ra lỗi không xác định.';
}
