import { Component } from 'react';

// Bọc từng game/card: lỗi của một mục không làm sập toàn bộ HOME.
// fallback có thể là node hoặc hàm (message) => node.
export default class ErrorBoundary extends Component {
  state = { failed: false, msg: '' };
  static getDerivedStateFromError(err) { return { failed: true, msg: String(err?.message ?? err) }; }
  componentDidCatch(err) { console.error('[ErrorBoundary]', err); }
  render() {
    if (!this.state.failed) return this.props.children;
    const { fallback } = this.props;
    if (typeof fallback === 'function') return fallback(this.state.msg);
    return fallback ?? <div className="notice error" role="alert">Mục này tạm thời không hiển thị được.</div>;
  }
}
