import { Component } from 'react';

// Bọc từng game/card: lỗi của một mục không làm sập toàn bộ HOME.
export default class ErrorBoundary extends Component {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch(err) { console.error('[ErrorBoundary]', err); }
  render() {
    if (!this.state.failed) return this.props.children;
    return this.props.fallback ?? <div className="notice error" role="alert">Mục này tạm thời không hiển thị được.</div>;
  }
}
