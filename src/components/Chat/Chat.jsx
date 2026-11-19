import { useEffect, useRef, useState } from 'react';
import Icon from '../common/Icon';
import { MAX_LENGTH } from '../../services/chatService';

const fmt = (d) => {
  const same = d.toDateString() === new Date().toDateString();
  const t = d.toLocaleTimeString('vi-VN', { hour: '2-digit', minute: '2-digit' });
  return same ? t : `${d.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit' })} ${t}`;
};

export default function Chat({ open, onClose, chat, user }) {
  const { messages, status, error, hasMore, loadingMore, loadMore, send } = chat;
  const [text, setText] = useState('');
  const [sending, setSending] = useState(false);
  const [err, setErr] = useState('');
  const list = useRef(null);
  const stick = useRef(true);

  useEffect(() => {
    if (open && stick.current && list.current) list.current.scrollTop = list.current.scrollHeight;
  }, [messages, open, status]);

  if (!open) return null;

  const onScroll = () => {
    const el = list.current;
    stick.current = el.scrollHeight - el.scrollTop - el.clientHeight < 80;
  };
  async function older() {
    const el = list.current; const prev = el.scrollHeight;
    stick.current = false;
    await loadMore();
    requestAnimationFrame(() => { el.scrollTop += el.scrollHeight - prev; });
  }
  async function submit(e) {
    e.preventDefault();
    if (sending) return;
    setErr(''); setSending(true);
    try { await send(text); setText(''); stick.current = true; }
    catch (ex) { setErr(ex.code ? 'Không gửi được. Có thể bạn gửi quá nhanh hoặc mất kết nối.' : ex.message); }
    finally { setSending(false); }
  }

  const offline = status === 'offline';
  return (
    <section className="chat" aria-label="Tin nhắn">
      <header className="chat-head">
        <strong>Tin nhắn</strong>
        <button className="icon-btn" aria-label="Đóng tin nhắn" onClick={onClose}><Icon name="close" /></button>
      </header>

      <div className="chat-list" ref={list} onScroll={onScroll} aria-live="polite">
        {offline && <div className="notice">Chưa kết nối Firebase. Hãy kiểm tra src/services/firebaseConfig.js.</div>}
        {status === 'connecting' && <div className="chat-empty"><span className="spinner" /> Đang kết nối…</div>}
        {status === 'error' && <div className="notice error" role="alert">{error}</div>}
        {status === 'ready' && hasMore && (
          <button className="btn small" onClick={older} disabled={loadingMore}>{loadingMore ? 'Đang tải…' : 'Tải tin cũ hơn'}</button>
        )}
        {status === 'ready' && messages.length === 0 && (
          <div className="chat-empty">Chưa có tin nhắn nào. Hãy gửi lời chào đầu tiên cho cả nhà.</div>
        )}
        {messages.map((m) => (
          <div key={m.id} className={`msg ${m.senderId === user.uid ? 'mine' : ''} ${m.pending ? 'pending' : ''}`}>
            <div className="msg-meta"><b>{m.senderId === user.uid ? 'Bạn' : m.senderName}</b><time>{m.pending ? 'Đang gửi' : fmt(m.createdAt)}</time></div>
            <p>{m.content}</p>
          </div>
        ))}
      </div>

      <form className="chat-form" onSubmit={submit}>
        {err && <p className="hint error" role="alert">{err}</p>}
        <div className="row">
          <input value={text} onChange={(e) => setText(e.target.value)} maxLength={MAX_LENGTH} placeholder="Nhập tin nhắn" aria-label="Nội dung tin nhắn" disabled={offline || status === 'error'} autoComplete="off" />
          <button className="btn primary icon" aria-label="Gửi" disabled={sending || !text.trim() || offline || status !== 'ready'}><Icon name="send" size={16} /></button>
        </div>
      </form>
    </section>
  );
}
