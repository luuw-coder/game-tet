import { Navigate, Route, Routes } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { listGames } from '../services/gameService';
import Login from '../pages/Login/Login';
import Home from '../pages/Home/Home';
import GamePage from '../pages/Game/GamePage';

function Splash({ children }) {
  return <div className="splash">{children ?? <span className="spinner" aria-label="Đang tải" />}</div>;
}

function RequireAuth({ children }) {
  const { status, error } = useAuth();
  if (status === 'loading') return <Splash />;
  if (status === 'error') {
    return (
      <Splash>
        <div className="notice error" role="alert">
          <p>{error}</p>
          <button className="btn" onClick={() => window.location.reload()}>Thử lại</button>
        </div>
      </Splash>
    );
  }
  return status === 'in' ? children : <Navigate to="/" replace />;
}

function PublicOnly({ children }) {
  const { status } = useAuth();
  if (status === 'loading') return <Splash />;
  return status === 'in' ? <Navigate to="/home" replace /> : children;
}

export default function AppRoutes() {
  const games = listGames();
  return (
    <Routes>
      <Route path="/" element={<PublicOnly><Login /></PublicOnly>} />
      <Route path="/home" element={<RequireAuth><Home /></RequireAuth>} />
      {/* /<slug> và /<slug>/:roomId được sinh từ danh sách game: thêm game không phải sửa file này */}
      {games.flatMap((g) => [
        <Route key={g.id} path={`/${g.slug}`} element={<RequireAuth><GamePage /></RequireAuth>} />,
        <Route key={`${g.id}-room`} path={`/${g.slug}/:roomId`} element={<RequireAuth><GamePage /></RequireAuth>} />,
      ])}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
