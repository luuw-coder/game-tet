import { useState } from 'react';
import Icon, { Logo } from '../../components/common/Icon';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { explainError } from '../../services/firebase';

export default function Login() {
  const { status, login, register } = useAuth();
  const [theme, setTheme] = useTheme();
  const [mode, setMode] = useState('login');
  const [f, setF] = useState({ username: '', password: '', displayName: '', familyCode: '' });
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const isReg = mode === 'register';
  const set = (k) => (e) => setF((s) => ({ ...s, [k]: e.target.value }));

  function switchMode(m) { setMode(m); setError(''); }

  async function submit(e) {
    e.preventDefault();
    setBusy(true); setError('');
    try {
      if (isReg) await register(f); else await login(f);
    } catch (ex) {
      setError(ex.code ? explainError(ex) : ex.message);
      setBusy(false);
    }
  }

  return (
    <main className="login">
      <button className="icon-btn corner" aria-label="Đổi giao diện sáng/tối" onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
        <Icon name={theme === 'dark' ? 'sun' : 'moon'} />
      </button>
      <form className="login-card" onSubmit={submit}>
        <Logo size={44} />
        <h1>{isReg ? 'Tạo tài khoản' : 'Vào game cùng cả nhà'}</h1>
        <p className="lead">{isReg ? 'Tài khoản lưu lịch sử và thành tích của bạn.' : 'Đăng nhập để tiếp tục chơi.'}</p>

        {status === 'unconfigured' && (
          <div className="notice error" role="alert">Chưa cấu hình Firebase. Hãy kiểm tra src/services/firebaseConfig.js.</div>
        )}

        <label htmlFor="username">Tên đăng nhập</label>
        <input id="username" value={f.username} onChange={set('username')} maxLength={20} autoComplete="username" autoCapitalize="none" required autoFocus />
        <small className="hint-inline">3–20 ký tự: chữ không dấu, số, dấu gạch dưới.</small>

        <label htmlFor="password">Mật khẩu</label>
        <input id="password" type="password" value={f.password} onChange={set('password')} maxLength={128} autoComplete={isReg ? 'new-password' : 'current-password'} required />
        {isReg && <small className="hint-inline">Tối thiểu 8 ký tự. Nếu quên mật khẩu, không có cách khôi phục tự động.</small>}

        {isReg && (
          <>
            <label htmlFor="displayName">Tên hiển thị</label>
            <input id="displayName" value={f.displayName} onChange={set('displayName')} maxLength={24} autoComplete="nickname" required />
            <label htmlFor="familyCode">Mã vào game</label>
            <input id="familyCode" type="password" value={f.familyCode} onChange={set('familyCode')} autoComplete="off" required />
          </>
        )}

        {error && <p className="hint error" role="alert">{error}</p>}
        <button className="btn primary wide" disabled={busy || status === 'unconfigured'}>
          {busy ? 'Đang xử lý…' : isReg ? 'Tạo tài khoản' : 'Đăng nhập'}
        </button>

        <button type="button" className="link" onClick={() => switchMode(isReg ? 'login' : 'register')}>
          {isReg ? 'Đã có tài khoản? Đăng nhập' : 'Chưa có tài khoản? Tạo mới'}
        </button>
      </form>
    </main>
  );
}
