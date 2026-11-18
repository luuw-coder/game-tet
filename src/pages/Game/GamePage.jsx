import { Suspense, lazy, useMemo } from 'react';
import { Navigate, useLocation, useParams } from 'react-router-dom';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import { getGameBySlug } from '../../services/gameService';

// Dùng chung cho /<slug> và /<slug>/:roomId. Game chưa phát hành bị đẩy về HOME.
export default function GamePage() {
  const { pathname } = useLocation();
  const slug = pathname.split('/')[1];
  const { roomId } = useParams();
  const game = getGameBySlug(slug);
  const Game = useMemo(() => (game?.status === 'available' && game.load ? lazy(game.load) : null), [game]);

  if (!game) return <Navigate to="/home" replace />;
  if (!Game) return <Navigate to="/home" replace state={{ notice: `${game.name} sắp ra mắt, chưa thể vào chơi.` }} />;
  return (
    <ErrorBoundary fallback={<div className="splash"><div className="notice error">Trò chơi gặp lỗi. Hãy quay lại trang chủ.</div></div>}>
      <Suspense fallback={<div className="splash"><span className="spinner" /></div>}>
        <Game roomId={roomId} />
      </Suspense>
    </ErrorBoundary>
  );
}
