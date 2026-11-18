import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { HashRouter } from 'react-router-dom';
import '@fontsource/be-vietnam-pro/400.css';
import '@fontsource/be-vietnam-pro/500.css';
import '@fontsource/be-vietnam-pro/700.css';
import './styles/theme.css';
import './styles/global.css';
import App from './App.jsx';
import ErrorBoundary from './components/common/ErrorBoundary.jsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ErrorBoundary fallback={(msg) => (
      <div className="splash"><div className="notice error" role="alert"><p>Trang gặp lỗi: {msg}</p><button className="btn" onClick={() => window.location.reload()}>Tải lại</button></div></div>
    )}>
      <HashRouter>
        <App />
      </HashRouter>
    </ErrorBoundary>
  </StrictMode>
);
