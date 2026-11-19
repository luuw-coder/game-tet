import {
  createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut, onAuthStateChanged, deleteUser,
} from 'firebase/auth';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db, explainError } from './firebase';

// Tên đăng nhập được đổi thành email nội bộ để dùng Email/Password của Firebase.
// Domain không cần tồn tại thật, không gửi mail, nên KHÔNG có chức năng quên mật khẩu.
export const EMAIL_DOMAIN = 'gametet.app';
const USER_RE = /^[a-z0-9_]{3,20}$/;
const NAME_RE = /^[\p{L}\p{N} _.-]{2,24}$/u;
let busy = false; // khi đang đăng ký, bỏ qua sự kiện đăng nhập để tránh "dọn" phiên giữa chừng

export const toEmail = (username) => `${username}@${EMAIL_DOMAIN}`;

export function validateUsername(v) {
  const u = String(v ?? '').trim().toLowerCase();
  if (!USER_RE.test(u)) throw new Error('Tên đăng nhập 3–20 ký tự, chỉ gồm chữ không dấu, số và dấu gạch dưới.');
  return u;
}
export function validatePassword(v) {
  const p = String(v ?? '');
  if (p.length < 8 || p.length > 128) throw new Error('Mật khẩu từ 8 đến 128 ký tự.');
  return p;
}
export function validateDisplayName(v) {
  const n = String(v ?? '').normalize('NFC').replace(/\s+/g, ' ').trim();
  if (!NAME_RE.test(n)) throw new Error('Tên hiển thị 2–24 ký tự, gồm chữ, số, khoảng trắng hoặc . _ -');
  return n;
}

async function loadProfile(uid) {
  const snap = await getDoc(doc(db, 'users', uid));
  if (!snap.exists()) throw Object.assign(new Error('no-profile'), { code: 'permission-denied' });
  const d = snap.data();
  return { uid, displayName: d.displayName, username: d.username };
}

// Tạo tài khoản: Auth -> members (mã gia đình) -> users (hồ sơ). Lỗi giữa chừng thì xóa tài khoản vừa tạo.
export async function register({ username, password, displayName, familyCode }) {
  const u = validateUsername(username);
  const p = validatePassword(password);
  const name = validateDisplayName(displayName);
  const code = String(familyCode ?? '').trim();
  if (!code) throw new Error('Hãy nhập mã gia đình.');

  busy = true;
  let user = null;
  try {
    ({ user } = await createUserWithEmailAndPassword(auth, toEmail(u), p));
    await setDoc(doc(db, 'members', user.uid), { code, joinedAt: serverTimestamp() });
    await setDoc(doc(db, 'users', user.uid), {
      displayName: name, username: u, createdAt: serverTimestamp(), lastSeen: serverTimestamp(),
    });
    return { uid: user.uid, displayName: name, username: u };
  } catch (e) {
    if (user) await deleteUser(user).catch(() => signOut(auth).catch(() => {}));
    if (e?.code === 'permission-denied') throw new Error('Mã gia đình không đúng.');
    throw e;
  } finally {
    busy = false;
  }
}

export async function login({ username, password }) {
  const u = validateUsername(username);
  const p = String(password ?? '');
  if (!p) throw new Error('Hãy nhập mật khẩu.');

  busy = true;
  try {
    const { user } = await signInWithEmailAndPassword(auth, toEmail(u), p);
    return await loadProfile(user.uid);
  } catch (e) {
    await signOut(auth).catch(() => {});
    if (e?.code === 'permission-denied') throw new Error('Tài khoản này chưa có hồ sơ. Hãy tạo tài khoản mới.');
    throw e;
  } finally {
    busy = false;
  }
}

// Khôi phục phiên khi tải lại trang. Tài khoản ẩn danh cũ bị đăng xuất để chuyển sang hệ thống mới.
export function watchSession(cb) {
  return onAuthStateChanged(auth, async (u) => {
    if (busy) return;
    if (!u || u.isAnonymous) {
      if (u?.isAnonymous) await signOut(auth).catch(() => {});
      return cb({ status: 'out', user: null, error: '' });
    }
    try {
      const user = await loadProfile(u.uid);
      updateDoc(doc(db, 'users', u.uid), { lastSeen: serverTimestamp() }).catch(() => {});
      cb({ status: 'in', user, error: '' });
    } catch (e) {
      if (e?.code === 'permission-denied') {
        await signOut(auth).catch(() => {});
        cb({ status: 'out', user: null, error: '' });
      } else {
        cb({ status: 'error', user: null, error: explainError(e) });
      }
    }
  });
}

export async function rename(uid, name) {
  const displayName = validateDisplayName(name);
  await updateDoc(doc(db, 'users', uid), { displayName, lastSeen: serverTimestamp() });
  return displayName;
}

export const logout = () => signOut(auth);
