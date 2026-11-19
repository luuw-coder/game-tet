// Tranh minh họa vẽ bằng SVG, đổi màu theo theme. Khóa lấy từ game.thumbnail.
const ART = {
  caro: (<><path className="s" d="M62 14v72M98 14v72M26 38h108M26 62h108" /><path className="s a" d="M37 19l14 14M51 19L37 33M109 67l14 14M123 67l-14 14" /><circle className="s" cx="80" cy="50" r="8" /><circle className="s" cx="44" cy="74" r="8" /></>),
  chess: (<><rect className="s" x="22" y="22" width="26" height="26" rx="3" /><rect className="s" x="112" y="52" width="26" height="26" rx="3" /><circle className="s f" cx="80" cy="32" r="11" /><path className="s f" d="M66 76q2-22 14-24 12 2 14 24z" /><rect className="s" x="58" y="76" width="44" height="9" rx="3" /></>),
  drawing: (<><path className="s a" d="M18 66C34 22 52 22 60 50S86 86 102 46s26-18 40-6" /><path className="s" d="M108 82l22-22 7 7-22 22-10 3z" /></>),
  puzzle: (<><rect className="s" x="26" y="26" width="48" height="48" rx="7" /><rect className="s" x="86" y="26" width="48" height="48" rx="7" /><circle className="s f" cx="80" cy="50" r="9" /><circle className="s" cx="50" cy="82" r="5" /></>),
  action: (<path className="s f" d="M92 8L50 56h27l-9 36 42-52H84z" />),
  multi: (<><path className="s" d="M60 34h40M50 45v10M110 45v10M60 66h40" /><circle className="s f" cx="50" cy="34" r="10" /><circle className="s" cx="110" cy="34" r="10" /><circle className="s" cx="50" cy="66" r="10" /><circle className="s" cx="110" cy="66" r="10" /></>),
};

export default function GameArt({ name }) {
  return (
    <svg className="art" viewBox="0 0 160 100" preserveAspectRatio="xMidYMid meet" aria-hidden="true">
      {ART[name] ?? ART.puzzle}
    </svg>
  );
}
