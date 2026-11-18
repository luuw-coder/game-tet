import { Link } from 'react-router-dom';
import GameArt from './GameArt';
import { playersLabel, statusLabel } from '../../services/gameService';

export default function GameCard({ game }) {
  const available = game.status === 'available';
  return (
    <article className="card">
      <div className="card-art">
        <GameArt name={game.thumbnail} />
        <span className={`status ${available ? 'on' : ''}`}>{statusLabel(game.status)}</span>
      </div>
      <div className="card-body">
        <h3>{game.name}</h3>
        <p>{game.description}</p>
        <ul className="meta">
          <li>{game.category}</li>
          <li>{playersLabel(game)}</li>
        </ul>
      </div>
      {available ? (
        <Link className="btn primary" to={game.route}>Chơi ngay</Link>
      ) : (
        <button className="btn" disabled aria-disabled="true">Sắp ra mắt</button>
      )}
    </article>
  );
}
