import { useState } from 'react';
import logo from '../../assets/logo-orcestra.png';
import './Header.css';

const NAV_ITEMS = [
  { key: 'painel', label: 'Painel informativo' },
  { key: 'cadastro', label: 'Cadastrar membro' },
];

const AvatarIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <circle cx="12" cy="8.2" r="3.4" stroke="#01571E" strokeWidth="1.7" />
    <path
      d="M4.6 19.3c1.55-3.1 4.28-4.65 7.4-4.65s5.85 1.55 7.4 4.65"
      stroke="#01571E"
      strokeWidth="1.7"
      strokeLinecap="round"
    />
  </svg>
);

export default function Header({
  userName = 'Nome Sobrenome',
  userRole = 'Cargo',
  active = 'cadastro',
  onNavigate,
}) {
  const [menuOpen, setMenuOpen] = useState(false);

  const nav = (
    <nav className="header__nav" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`header__tab ${active === item.key ? 'header__tab--active' : ''}`}
          onClick={() => {
            onNavigate?.(item.key);
            setMenuOpen(false);
          }}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <header className="header">
      <div className="header__bar">
        <img src={logo} alt="Orc'estra" className="header__logo" />

        <button
          type="button"
          className="header__burger"
          aria-label="Abrir menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="header__profile">
          <div className="header__profile-text">
            <p className="header__profile-name">{userName}</p>
            <p className="header__profile-role">{userRole}</p>
          </div>
          <span className="header__avatar" aria-hidden="true">
            <AvatarIcon />
          </span>
        </div>
      </div>

      <div className="header__nav-row">{nav}</div>

      {menuOpen && (
        <div className="header__mobile-menu">
          {nav}
          <div className="header__mobile-profile">
            <span className="header__avatar" aria-hidden="true">
              <AvatarIcon />
            </span>
            <div>
              <p className="header__profile-name">{userName}</p>
              <p className="header__profile-role">{userRole}</p>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
