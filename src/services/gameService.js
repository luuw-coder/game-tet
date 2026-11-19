import { GAMES } from '../data/games';

export const CATEGORIES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'Trí tuệ', label: 'Trí tuệ' },
  { id: 'Giải trí', label: 'Giải trí' },
  { id: 'Hành động', label: 'Hành động' },
  { id: 'Sáng tạo', label: 'Sáng tạo' },
  { id: 'multi', label: 'Nhiều người chơi' },
];
export const SORTS = [
  { id: 'newest', label: 'Mới nhất' },
  { id: 'popular', label: 'Phổ biến' },
  { id: 'name', label: 'Tên trò chơi' },
];

const fold = (s) => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/đ/g, 'd').toLowerCase();
const valid = (g) => g && g.id && g.slug && g.name && g.route && typeof g.status === 'string';

// Một mục đăng ký hỏng chỉ bị bỏ qua, không làm sập trang HOME.
export const listGames = () => GAMES.filter(valid);
export const getGameBySlug = (slug) => listGames().find((g) => g.slug === slug) ?? null;

export function queryGames(games, { category = 'all', search = '', sort = 'newest' } = {}) {
  const q = fold(search.trim());
  return games
    .filter((g) => (category === 'all' ? true : category === 'multi' ? g.playerMax >= 3 : g.category === category))
    .filter((g) => !q || fold(g.name).includes(q))
    .sort((a, b) =>
      sort === 'name' ? a.name.localeCompare(b.name, 'vi')
      : sort === 'popular' ? (b.popularity ?? 0) - (a.popularity ?? 0)
      : String(b.createdAt).localeCompare(String(a.createdAt)));
}

export function playersLabel(g) {
  if (!g.playerMin || !g.playerMax) return 'Chưa xác định';
  return g.playerMin === g.playerMax ? `${g.playerMin} người` : `${g.playerMin}–${g.playerMax} người`;
}
export const statusLabel = (s) => (s === 'available' ? 'Sẵn sàng' : 'Sắp ra mắt');
