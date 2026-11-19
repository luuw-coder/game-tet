import { signInAnonymously, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, explainError } from './firebase';

const NAME_RE = /^[\p{L}\p{N} _.-]{2,24}$/u;
let joining = false; // chặn watchSession "dọn" phiên khi đang tạo hồ sơ

export function validateName(v) {
  const n = String(v ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!NAME_RE.test(n)) throw new Error('Tên dài 2–24 ký tự, gồm chữ, số, khoảng trắng hoặc . _ -');
  return n;
}

// Đăng nhập ẩn danh -> UID riêng do Firebase cấp. Tên hiển thị KHÔNG dùng để xác thực.
// Mã gia đình được Security Rules đối chiếu với config/access; sai mã thì không có hồ sơ.
export async function joinWithCode(name, code) {
  const displayName = validateName(name);
  const familyCode = String(code ?? '').trim();
  if (!familyCode) throw new Error('Hãy nhập mã gia đình.');
  joining = true;
  try {
    const { user } = await signInAnonymously(auth);
    try {
      await setDoc(doc(db, 'members', user.uid), { code: familyCode, joinedAt: serverTimestamp() });
      await setDoc(doc(db, 'users', user.uid), { displayName, createdAt: serverTimestamp(), lastSeen: serverTimestamp() });
    } catch (e) {
      await signOut(auth).catch(() => {});
      if (e?.code === 'permission-denied') throw new Error('Mã gia đình không đúng, hoặc chưa tạo tài liệu config/access trong Firestore.');
      throw e;
    }
    return { uid: user.uid, displayName };
  } finally {
    joining = false;
  }
}

// Khôi phục phiên: Firebase tự giữ UID trong IndexedDB; ở đây nạp lại hồ sơ.
export function watchSession(cb) {
  return onAuthStateChanged(auth, async (u) => {
    if (joining) return;
    if (!u) return cb({ status: 'out', user: null, error: '' });
    try {
      const snap = await getDoc(doc(db, 'users', u.uid));
      if (!snap.exists()) throw Object.assign(new Error('no-profile'), { code: 'permission-denied' });
      updateDoc(doc(db, 'users', u.uid), { lastSeen: serverTimestamp() }).catch(() => {});
      cb({ status: 'in', user: { uid: u.uid, displayName: snap.data().displayName }, error: '' });
    } catch (e) {
      if (e?.code === 'permission-denied') {
        await signOut(auth).catch(() => {}); // phiên không hợp lệ -> về trang đăng nhập
        cb({ status: 'out', user: null, error: '' });
      } else {
        cb({ status: 'error', user: null, error: explainError(e) }); // lỗi mạng: giữ nguyên UID, cho thử lại
      }
    }
  });
}

export async function rename(uid, name) {
  const displayName = validateName(name);
  await updateDoc(doc(db, 'users', uid), { displayName, lastSeen: serverTimestamp() });
  return displayName;
}

export const logout = () => signOut(auth);
