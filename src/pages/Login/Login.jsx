import { useState } from 'react';
import Icon, { Logo } from '../../components/common/Icon';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { explainError } from '../../services/firebase';

export default function Login() {
  const { status, login } = useAuth();
  const [theme, setTheme] = useTheme();
  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try { await login(name, code); }
    catch (ex) { setError(ex.code ? explainError(ex) : ex.message); setBusy(false); }
  }

  return (
    <main className="login">
      <button className="icon-btn corner" aria-label="Đổi giao diện sáng/tối" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
      <form className="login-card" onSubmit={submit}>
        <Logo size={44} />
        <h1>Vào game cùng cả nhà</h1>
        <p className="lead">Nhập tên bạn muốn hiển thị và mã gia đình.</p>

        {status === 'unconfigured' && (
          <div className="notice error" role="alert">Chưa cấu hình Firebase. Sao chép .env.example thành .env và điền thông tin dự án.</div>
        )}

        <label htmlFor="name">Tên hiển thị</label>
        <input id="name" value={name} onChange={(e) => setName(e.target.value)} maxLength={24} autoComplete="nickname" required autoFocus />

        <label htmlFor="code">Mã vô game</label>
        <input id="code" type="password" value={code} onChange={(e) => setCode(e.target.value)} autoComplete="off" required />

        {error && <p className="hint error" role="alert">{error}</p>}
        <button className="btn primary wide" disabled={busy || status === 'unconfigured'}>{busy ? 'Đang vào…' : 'Vào game'}</button>
        <small className="fine">Tên chỉ để hiển thị. Danh tính của bạn do Firebase cấp (UID) và gắn với trình duyệt này.</small>
      </form>
    </main>
  );
}
