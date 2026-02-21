import './TopBar.css';

const TopBar = ({ title, onMenuClick }) => {
  let admin = {};
  try {
    admin = JSON.parse(localStorage.getItem('adminUser') || '{}');
  } catch {
    admin = {};
  }

  return (
    <header className="topbar">
      <button className="menu-toggle" type="button" onClick={onMenuClick}>
        ☰
      </button>
      <h1>{title}</h1>
      <div className="admin-pill">
        <span>{admin?.name?.charAt(0)?.toUpperCase() || 'A'}</span>
        <small>{admin?.name || 'Admin'}</small>
      </div>
    </header>
  );
};

export default TopBar;
