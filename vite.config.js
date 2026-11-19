import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { createHash } from 'node:crypto';

// Chèn Content-Security-Policy khi build (GitHub Pages không cho đặt header). Tùy chọn, mặc định tắt.
// Hash của script inline (script chọn theme) được tính tự động.
const csp = () => ({
  name: 'inject-csp',
  apply: (_, env) => env.command === 'build' && process.env.ENABLE_CSP === '1', // mặc định TẮT; bật bằng ENABLE_CSP=1
  transformIndexHtml: {
    order: 'post',
    handler(html) {
      const hashes = [...html.matchAll(/<script>([\s\S]*?)<\/script>/g)].map(
        (m) => `'sha256-${createHash('sha256').update(m[1]).digest('base64')}'`
      );
      const policy = [
        "default-src 'self'",
        `script-src 'self' ${hashes.join(' ')}`,
        "style-src 'self'",
        "img-src 'self' data:",
        "font-src 'self' data:",
        "connect-src 'self' https://*.googleapis.com https://*.firebaseio.com wss://*.firebaseio.com",
        "object-src 'none'",
        "base-uri 'self'",
        "form-action 'self'",
      ].join('; ');
      return html.replace('</title>', `</title>\n    <meta http-equiv="Content-Security-Policy" content="${policy}">`);
    },
  },
});

// base './' + HashRouter: chạy đúng trên mọi tên repo, tải lại trang con không bị 404.
export default defineConfig({ base: './', plugins: [react(), csp()] });
