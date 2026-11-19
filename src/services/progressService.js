import { collection, query, orderBy, limit, getDocs, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from './firebase';

export const RESULTS = ['win', 'lose', 'draw'];

const toDate = (v) => v?.toDate?.() ?? null;

export async function listHistory(uid, max = 20) {
  const snap = await getDocs(query(collection(db, 'history', uid, 'entries'), orderBy('playedAt', 'desc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, gameId: d.data().gameId, result: d.data().result, playedAt: toDate(d.data().playedAt) }));
}

export async function listAchievements(uid, max = 50) {
  const snap = await getDocs(query(collection(db, 'achievements', uid, 'items'), orderBy('unlockedAt', 'desc'), limit(max)));
  return snap.docs.map((d) => ({ id: d.id, title: d.data().title, unlockedAt: toDate(d.data().unlockedAt) }));
}

// Dùng khi trò chơi thật kết thúc một ván. Chưa có trò chơi nào gọi hàm này nên lịch sử hiện đang trống.
export function recordResult(uid, { gameId, result }) {
  if (!RESULTS.includes(result)) throw new Error('Kết quả không hợp lệ.');
  return addDoc(collection(db, 'history', uid, 'entries'), {
    gameId: String(gameId).slice(0, 40), result, playedAt: serverTimestamp(),
  });
}
