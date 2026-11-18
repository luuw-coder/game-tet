import { CATEGORIES } from '../../services/gameService';

export default function CategoryFilter({ value, onChange }) {
  return (
    <div className="chips" role="group" aria-label="Thể loại">
      {CATEGORIES.map((c) => (
        <button key={c.id} className={`chip ${value === c.id ? 'on' : ''}`} aria-pressed={value === c.id} onClick={() => onChange(c.id)}>
          {c.label}
        </button>
      ))}
    </div>
  );
}
