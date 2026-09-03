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

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M5 5l14 14M19 5 5 19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const BurgerIcon = () => (
  <>
    <span />
    <span />
    <span />
  </>
);

const GridIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <rect x="3.5" y="3.5" width="7" height="5.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13.5" y="3.5" width="7" height="9.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="3.5" y="12" width="7" height="8.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
    <rect x="13.5" y="16" width="7" height="4.5" rx="1.6" stroke="currentColor" strokeWidth="1.6" />
  </svg>
);

const PlusIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M12 4.5v15M4.5 12h15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
  </svg>
);

const ChevronDownIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" {...props}>
    <path d="M5.5 9 12 15.5 18.5 9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const LogoutIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M10.5 4.5h-4a1.5 1.5 0 0 0-1.5 1.5v12a1.5 1.5 0 0 0 1.5 1.5h4" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" />
    <path d="M13 8.2 17.3 12 13 15.8M17.3 12H9.3" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function Header({
  userName = 'Nome Sobrenome',
  userRole = 'Cargo',
  active = 'cadastro',
  onNavigate,
  sections,
  activeSection,
  onSelectSection,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [painelExpanded, setPainelExpanded] = useState(false);

  const closeMenu = () => {
    setMenuOpen(false);
    setPainelExpanded(false);
  };

  const goTo = (key) => {
    onNavigate?.(key);
    closeMenu();
  };

  const nav = (
    <nav className="header__nav" aria-label="Navegação principal">
      {NAV_ITEMS.map((item) => (
        <button
          key={item.key}
          type="button"
          className={`header__tab ${active === item.key ? 'header__tab--active' : ''}`}
          onClick={() => goTo(item.key)}
        >
          {item.label}
        </button>
      ))}
    </nav>
  );

  return (
    <>
      <header className="header">
      <div className="header__bar">
        <img src={logo} alt="Orc'estra" className="header__logo" />

        <button
          type="button"
          className="header__burger"
          aria-label={menuOpen ? 'Fechar menu' : 'Abrir menu'}
          aria-expanded={menuOpen}
          onClick={() => (menuOpen ? closeMenu() : setMenuOpen(true))}
        >
          {menuOpen ? <CloseIcon /> : <BurgerIcon />}
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
      </header>

      {menuOpen && (
        <>
          <div className="header__mobile-scrim" onClick={closeMenu} aria-hidden="true" />
          <div className="header__mobile-overlay">
          <button type="button" className="header__mobile-close" aria-label="Fechar menu" onClick={closeMenu}>
            <CloseIcon />
          </button>
          <img src={logo} alt="Orc'estra" className="header__mobile-logo" />

          <nav className="header__mobile-nav" aria-label="Navegação principal">
            <div className="header__mobile-item-group">
              <button
                type="button"
                className="header__mobile-item"
                aria-expanded={sections ? painelExpanded : undefined}
                onClick={() => {
                  if (sections) {
                    setPainelExpanded((open) => !open);
                  } else {
                    goTo('painel');
                  }
                }}
              >
                <GridIcon className="header__mobile-item-icon" />
                Painel informativo
                {sections && (
                  <ChevronDownIcon
                    className={`header__mobile-item-chevron ${painelExpanded ? 'header__mobile-item-chevron--open' : ''}`}
                  />
                )}
              </button>

              {sections && painelExpanded && (
                <ul className="header__mobile-subnav">
                  {sections.map((section) => (
                    <li key={section.key}>
                      <button
                        type="button"
                        className={`header__mobile-subitem ${
                          activeSection === section.key ? 'header__mobile-subitem--active' : ''
                        }`}
                        disabled={!section.enabled}
                        onClick={() => {
                          onSelectSection?.(section.key);
                          goTo('painel');
                        }}
                      >
                        {section.label}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <button type="button" className="header__mobile-item" onClick={() => goTo('cadastro')}>
              <PlusIcon className="header__mobile-item-icon" />
              Cadastrar membro
            </button>
          </nav>

          <div className="header__mobile-footer">
            <div className="header__mobile-profile">
              <span className="header__avatar header__avatar--mobile" aria-hidden="true">
                <AvatarIcon />
              </span>
              <p>Perfil</p>
            </div>
            <button type="button" className="header__mobile-logout" aria-label="Sair" title="Sair">
              <LogoutIcon />
            </button>
          </div>
          </div>
        </>
      )}
    </>
  );
}
