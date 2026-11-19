import { AuthProvider } from './hooks/useAuth';
import AppRoutes from './router/routes';
import { Logo } from './components/common/Icon';

export default function App() {
  return (
    <AuthProvider>
      <AppRoutes />
      {/* Chỉ hiện trên điện thoại đang để dọc (xem styles/global.css) */}
      <div className="rotate" role="alert">
        <Logo size={44} />
        <svg viewBox="0 0 64 64" width="64" height="64" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="22" y="8" width="20" height="36" rx="4" /><path d="M14 52h36M44 46l6 6-6 6" /></svg>
        <p>Hãy xoay ngang điện thoại để chơi</p>
      </div>
    </AuthProvider>
  );
}
