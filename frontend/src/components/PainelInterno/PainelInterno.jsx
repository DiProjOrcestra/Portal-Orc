import { CompassIcon } from '../../pages/PainelInstitucional/icons';
import { PAINEL_INTERNO_ITEMS } from './painelInternoItems';
import './PainelInterno.css';

export default function PainelInterno({ active, onSelect }) {
  return (
    <nav className="painel-interno" aria-label="Painel interno">
      <div className="painel-interno__glow-layer" aria-hidden="true">
        <div className="painel-interno__glow painel-interno__glow--top" />
        <div className="painel-interno__glow painel-interno__glow--top2" />
        <div className="painel-interno__glow painel-interno__glow--bottom" />
      </div>

      <div className="painel-interno__content">
        <p className="painel-interno__title">
          <CompassIcon className="painel-interno__title-icon" aria-hidden="true" />
          Painel interno
        </p>
        <ul className="painel-interno__list">
          {PAINEL_INTERNO_ITEMS.map((item) => (
            <li key={item.key}>
              <button
                type="button"
                className={`painel-interno__item ${active === item.key ? 'painel-interno__item--active' : ''}`}
                onClick={() => item.enabled && onSelect(item.key)}
                disabled={!item.enabled}
                aria-current={active === item.key ? 'true' : undefined}
              >
                {item.label}
              </button>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  );
}
