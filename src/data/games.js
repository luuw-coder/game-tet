// Nơi DUY NHẤT đăng ký trò chơi. Thêm game = thêm một object (và `load` khi đã có code).
// status: 'available' | 'coming-soon'. Chỉ 'available' mới vào được.
// load: () => import('../games/caro')  -> component game, nạp lười, tách bundle riêng.
// popularity: thứ hạng tạm do ban quản trị đặt, chưa phải số liệu thật.
export const GAMES = [
  { id: 'caro', name: 'Cờ caro', slug: 'caro', description: 'Nối năm quân liên tiếp trước khi đối thủ kịp chặn.', category: 'Trí tuệ', thumbnail: 'caro', status: 'coming-soon', playerMin: 2, playerMax: 2, route: '/caro', createdAt: '2026-11-01', popularity: 90 },
  { id: 'chess', name: 'Cờ vua', slug: 'chess', description: 'Đối đầu trên bàn 64 ô, từng nước đi đều đáng suy nghĩ.', category: 'Trí tuệ', thumbnail: 'chess', status: 'coming-soon', playerMin: 2, playerMax: 2, route: '/chess', createdAt: '2026-11-03', popularity: 80 },
  { id: 'drawing', name: 'Vẽ đoán hình', slug: 'drawing', description: 'Một người vẽ, cả nhà đoán xem đó là gì.', category: 'Sáng tạo', thumbnail: 'drawing', status: 'coming-soon', playerMin: 2, playerMax: 8, route: '/drawing', createdAt: '2026-11-10', popularity: 95 },
  { id: 'puzzle', name: 'Trò chơi giải đố', slug: 'puzzle', description: 'Những câu đố ngắn, vừa chơi một mình vừa thi cùng nhau.', category: 'Giải trí', thumbnail: 'puzzle', status: 'coming-soon', playerMin: 1, playerMax: 4, route: '/puzzle', createdAt: '2026-11-12', popularity: 60 },
  { id: 'action', name: 'Trò chơi hành động', slug: 'action', description: 'Phản xạ nhanh, nhịp chơi dồn dập.', category: 'Hành động', thumbnail: 'action', status: 'coming-soon', playerMin: 1, playerMax: 4, route: '/action', createdAt: '2026-11-14', popularity: 70 },
  { id: 'multiplayer', name: 'Trò chơi nhiều người', slug: 'multiplayer', description: 'Cả nhà tụ họp và chơi cùng một lúc.', category: 'Nhiều người chơi', thumbnail: 'multi', status: 'coming-soon', playerMin: 3, playerMax: 8, route: '/multiplayer', createdAt: '2026-11-16', popularity: 85 },
];
