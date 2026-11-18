import { useState } from 'react';
import { Link } from 'react-router-dom';
import Icon, { Avatar, Logo } from '../common/Icon';
import AccountMenu from '../UserProfile/AccountMenu';
import { useAuth } from '../../hooks/useAuth';

export default function Navbar({ unread, onOpenChat }) {
  const { user } = useAuth();
  const [menu, setMenu] = useState(false);
  return (
    <header className="nav">
      <div className="nav-in">
        <Link to="/home" className="brand"><Logo /><span>Game Tết</span></Link>
        <div className="nav-right">
          <button className="icon-btn" aria-label={unread ? `${unread} tin nhắn mới` : 'Thông báo'} onClick={onOpenChat}>
            <Icon name="bell" />
            {unread > 0 && <span className="dot" />}
          </button>
          <button className="user-chip" onClick={() => setMenu((m) => !m)} aria-expanded={menu}>
            <Avatar name={user.displayName} /><span>{user.displayName}</span>
          </button>
          <button className="icon-btn" aria-label="Cài đặt" aria-expanded={menu} onClick={() => setMenu((m) => !m)}>
            <Icon name="sliders" />
          </button>
        </div>
        {menu && <AccountMenu onClose={() => setMenu(false)} />}
      </div>
    </header>
  );
}
