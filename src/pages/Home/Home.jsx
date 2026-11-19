import { useMemo, useState } from 'react';
import { useLocation } from 'react-router-dom';
import Navbar from '../../components/Navbar/Navbar';
import Chat from '../../components/Chat/Chat';
import GameCard from '../../components/GameCard/GameCard';
import CategoryFilter from '../../components/CategoryFilter/CategoryFilter';
import ErrorBoundary from '../../components/common/ErrorBoundary';
import ProgressPanel from '../../components/Progress/ProgressPanel';
import Icon from '../../components/common/Icon';
import { useAuth } from '../../hooks/useAuth';
import { useMessages } from '../../hooks/useMessages';
import { SORTS, listGames, queryGames } from '../../services/gameService';

export default function Home() {
  const { user } = useAuth();
  const location = useLocation();
  const [chatOpen, setChatOpen] = useState(false);
  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [sort, setSort] = useState('newest');
  const [notice, setNotice] = useState(location.state?.notice ?? '');
  const chat = useMessages(user, chatOpen);

  const all = useMemo(() => listGames(), []);
  const games = useMemo(() => queryGames(all, { category, search, sort }), [all, category, search, sort]);

  return (
    <>
      <Navbar unread={chat.unread} onOpenChat={() => setChatOpen(true)} />
      <main className="home">
        <div className="home-top">
          <button className="chat-launch" aria-expanded={chatOpen} onClick={() => setChatOpen((o) => !o)}>
            <Icon name="chat" /> Tin nhắn
            {chat.unread > 0 && <span className="badge">{chat.unread > 9 ? '9+' : chat.unread}</span>}
          </button>
          <Chat open={chatOpen} onClose={() => setChatOpen(false)} chat={chat} user={user} />
        </div>

        <section className="hero">
          <h1>Chơi cùng nhau!</h1>
          <p>Một nơi để cả gia đình cùng giải trí.</p>
        </section>

        {notice && (
          <div className="notice" role="status">{notice}<button className="icon-btn" aria-label="Ẩn thông báo" onClick={() => setNotice('')}><Icon name="close" size={16} /></button></div>
        )}

        <div className="toolbar">
          <label className="search">
            <Icon name="search" size={16} />
            <input type="search" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Tìm trò chơi theo tên" aria-label="Tìm trò chơi theo tên" />
          </label>
          <label className="sort">
            <span>Sắp xếp</span>
            <select value={sort} onChange={(e) => setSort(e.target.value)}>
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </label>
        </div>
        <CategoryFilter value={category} onChange={setCategory} />

        {games.length === 0 ? (
          <div className="empty">
            <p>Không có trò chơi nào khớp.</p>
            <button className="btn" onClick={() => { setSearch(''); setCategory('all'); }}>Xóa bộ lọc</button>
          </div>
        ) : (
          <div className="grid">
            {games.map((g) => <ErrorBoundary key={g.id}><GameCard game={g} /></ErrorBoundary>)}
          </div>
        )}

        <section className="progress-sec">
          <h2>Lịch sử & thành tích</h2>
          <ProgressPanel uid={user.uid} />
        </section>
      </main>
    </>
  );
}
