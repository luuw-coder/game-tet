import { useEffect, useRef, useState } from 'react';
import Icon, { Avatar } from '../common/Icon';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { explainError } from '../../services/firebase';

export default function AccountMenu({ onClose }) {
  const { user, rename, logout } = useAuth();
  const [theme, setTheme] = useTheme();
  const [name, setName] = useState(user.displayName);
  const [busy, setBusy] = useState(false);
  const [msg, setMsg] = useState({ type: '', text: '' });
  const ref = useRef(null);

  useEffect(() => {
    const away = (e) => { if (ref.current && !ref.current.contains(e.target) && !e.target.closest('.nav-right')) onClose(); };
    const esc = (e) => e.key === 'Escape' && onClose();
    document.addEventListener('mousedown', away);
    document.addEventListener('keydown', esc);
    return () => { document.removeEventListener('mousedown', away); document.removeEventListener('keydown', esc); };
  }, [onClose]);

  async function save(e) {
    e.preventDefault();
    setBusy(true); setMsg({ type: '', text: '' });
    try { await rename(name); setMsg({ type: 'ok', text: 'Đã đổi tên hiển thị.' }); }
    catch (ex) { setMsg({ type: 'error', text: ex.code ? explainError(ex) : ex.message }); }
    finally { setBusy(false); }
  }

  return (
    <div className="menu" ref={ref} role="dialog" aria-label="Tài khoản và cài đặt">
      <div className="menu-head">
        <Avatar name={user.displayName} size="lg" />
        <div>
          <strong>{user.displayName}</strong>
          <small>Mã người dùng: {user.uid.slice(0, 8)}</small>
        </div>
      </div>
      <form onSubmit={save} className="menu-sec">
        <label htmlFor="rename">Tên hiển thị</label>
        <div className="row">
          <input id="rename" value={name} maxLength={24} onChange={(e) => setName(e.target.value)} autoComplete="off" />
          <button className="btn primary" disabled={busy || name.trim() === user.displayName}>{busy ? 'Đang lưu…' : 'Lưu'}</button>
        </div>
        {msg.text && <p className={`hint ${msg.type}`} role="status">{msg.text}</p>}
      </form>
      <div className="menu-sec">
        <span className="label">Giao diện</span>
        <div className="seg" role="group" aria-label="Giao diện">
          <button className={theme === 'light' ? 'on' : ''} onClick={() => setTheme('light')}><Icon name="sun" size={15} /> Sáng</button>
          <button className={theme === 'dark' ? 'on' : ''} onClick={() => setTheme('dark')}><Icon name="moon" size={15} /> Tối</button>
        </div>
      </div>
      <button className="btn menu-out" onClick={logout}><Icon name="logout" size={16} /> Đăng xuất</button>
    </div>
  );
}
