import { useEffect, useState } from 'react';
import { listAchievements, listHistory } from '../../services/progressService';
import { explainError } from '../../services/firebase';

const RESULT_LABEL = { win: 'Thắng', lose: 'Thua', draw: 'Hòa' };
const fmt = (d) => (d ? d.toLocaleString('vi-VN', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' }) : '');

export default function ProgressPanel({ uid }) {
  const [data, setData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let alive = true;
    Promise.all([listHistory(uid), listAchievements(uid)])
      .then(([history, achievements]) => alive && setData({ history, achievements }))
      .catch((e) => alive && setError(explainError(e)));
    return () => { alive = false; };
  }, [uid]);

  if (error) return <div className="notice error" role="alert">{error}</div>;
  if (!data) return <p className="muted"><span className="spinner" /> Đang tải lịch sử…</p>;

  return (
    <div className="panels">
      <section className="panel">
        <h3>Lịch sử chơi</h3>
        {data.history.length === 0 ? (
          <p className="muted">Chưa có ván nào được ghi lại. Lịch sử sẽ hiện ở đây khi trò chơi được mở.</p>
        ) : (
          <ul className="list">
            {data.history.map((h) => (
              <li key={h.id}><span>{h.gameId}</span><b>{RESULT_LABEL[h.result] ?? h.result}</b><time>{fmt(h.playedAt)}</time></li>
            ))}
          </ul>
        )}
      </section>
      <section className="panel">
        <h3>Thành tích</h3>
        {data.achievements.length === 0 ? (
          <p className="muted">Chưa có thành tích nào.</p>
        ) : (
          <ul className="list">
            {data.achievements.map((a) => (
              <li key={a.id}><span>{a.title}</span><time>{fmt(a.unlockedAt)}</time></li>
            ))}
          </ul>
        )}
      </section>
    </div>
  );
}
