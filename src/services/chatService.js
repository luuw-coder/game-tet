import { collection, doc, query, orderBy, limit, startAfter, onSnapshot, getDocs, writeBatch, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const PAGE_SIZE = 30;
export const MAX_LENGTH = 500;
let lastSent = 0;

export function cleanContent(raw) {
  return String(raw ?? '')
    .replace(/[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2066-\u2069]/g, ' ') // điều khiển + ký tự đảo chiều văn bản
    .replace(/\s+/g, ' ')
    .trim();
}

export function toMessage(d) {
  const x = d.data({ serverTimestamps: 'estimate' });
  return { id: d.id, senderId: x.senderId, senderName: x.senderName, content: x.content, createdAt: x.createdAt?.toDate?.() ?? new Date(), pending: d.metadata.hasPendingWrites };
}

const base = () => collection(db, 'messages');

export const listenLatest = (onSnap, onError) =>
  onSnapshot(query(base(), orderBy('createdAt', 'desc'), limit(PAGE_SIZE)), onSnap, onError);

export async function fetchOlder(cursorDoc) {
  const snap = await getDocs(query(base(), orderBy('createdAt', 'desc'), startAfter(cursorDoc), limit(PAGE_SIZE)));
  return snap.docs;
}

// Tin + users/{uid}.lastMessageAt ghi cùng batch để Rules giới hạn tốc độ (>= 1 giây/tin).
export async function sendMessage(user, raw) {
  const content = cleanContent(raw);
  if (!content) throw new Error('Hãy nhập nội dung tin nhắn.');
  if (content.length > MAX_LENGTH) throw new Error(`Tin nhắn tối đa ${MAX_LENGTH} ký tự.`);
  if (Date.now() - lastSent < 1200) throw new Error('Bạn gửi hơi nhanh, chờ một chút nhé.');
  lastSent = Date.now();
  const batch = writeBatch(db);
  batch.set(doc(base()), { senderId: user.uid, senderName: user.displayName, content, createdAt: serverTimestamp() });
  batch.update(doc(db, 'users', user.uid), { lastMessageAt: serverTimestamp() });
  await batch.commit();
}
