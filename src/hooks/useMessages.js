import { useCallback, useEffect, useRef, useState } from 'react';
import { isFirebaseConfigured, explainError } from '../services/firebase';
import { listenLatest, fetchOlder, sendMessage, toMessage, PAGE_SIZE } from '../services/chatService';

export function useMessages(user, open) {
  const [byId, setById] = useState(() => new Map());
  const [status, setStatus] = useState(isFirebaseConfigured ? 'connecting' : 'offline');
  const [error, setError] = useState('');
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [unread, setUnread] = useState(0);
  const cursor = useRef(null);
  const openRef = useRef(open);
  const uid = user?.uid;

  useEffect(() => { openRef.current = open; if (open) setUnread(0); }, [open]);

  useEffect(() => {
    if (!uid || !isFirebaseConfigured) return undefined;
    let first = true;
    const stop = listenLatest(
      (snap) => {
        const changed = snap.docChanges().filter((c) => c.type !== 'removed').map((c) => c.doc);
        setById((prev) => { const m = new Map(prev); changed.forEach((d) => m.set(d.id, toMessage(d))); return m; });
        if (first) { cursor.current = snap.docs[snap.docs.length - 1] ?? null; setHasMore(snap.size >= PAGE_SIZE); }
        else if (!openRef.current && !snap.metadata.hasPendingWrites) {
          const n = snap.docChanges().filter((c) => c.type === 'added' && c.doc.data().senderId !== uid).length;
          if (n) setUnread((u) => u + n);
        }
        first = false; setStatus('ready'); setError('');
      },
      (e) => { setStatus('error'); setError(explainError(e)); }
    );
    return stop;
  }, [uid]);

  const loadMore = useCallback(async () => {
    if (!cursor.current || loadingMore) return;
    setLoadingMore(true);
    try {
      const docs = await fetchOlder(cursor.current);
      setById((prev) => { const m = new Map(prev); docs.forEach((d) => m.set(d.id, toMessage(d))); return m; });
      if (docs.length) cursor.current = docs[docs.length - 1];
      setHasMore(docs.length >= PAGE_SIZE);
    } catch (e) { setError(explainError(e)); } finally { setLoadingMore(false); }
  }, [loadingMore]);

  const send = useCallback((text) => sendMessage(user, text), [user]);
  const messages = [...byId.values()].sort((a, b) => a.createdAt - b.createdAt);
  return { messages, status, error, hasMore, loadingMore, loadMore, send, unread };
}
