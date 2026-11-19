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
  // initializeAuth (không dùng getAuth) để không nạp script popup/redirect từ bên ngoài -> CSP chặt hơn.
  auth = initializeAuth(app, { persistence: [indexedDBLocalPersistence, browserLocalPersistence] });
  db = getFirestore(app);
}
export { auth, db };

export function explainError(e) {
  const c = e?.code || '';
  if (c.includes('permission-denied')) return 'Bạn không có quyền thực hiện thao tác này.';
  if (c.includes('unavailable') || c === 'auth/network-request-failed') return 'Không kết nối được Firebase. Kiểm tra mạng rồi thử lại.';
  if (c === 'auth/operation-not-allowed' || c === 'auth/admin-restricted-operation') return 'Chưa bật Anonymous trong Firebase Authentication.';
  if (c === 'auth/too-many-requests' || c.includes('resource-exhausted')) return 'Quá nhiều yêu cầu. Hãy chờ một lúc rồi thử lại.';
  if (c.includes('referer')) return 'API key đang chặn tên miền này. Kiểm tra mục hạn chế API key.';
  return e?.message || 'Đã xảy ra lỗi không xác định.';
}
