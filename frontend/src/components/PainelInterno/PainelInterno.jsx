import { CompassIcon } from '../../pages/PainelInstitucional/icons';
import './PainelInterno.css';

const NAV_ITEMS = [
  { key: 'mvv', label: 'Missão, Visão e Valores' },
  { key: 'golden-circle', label: 'Golden Circle' },
  { key: 'planejamento', label: 'Planejamento estratégico' },
  { key: 'planos-acao', label: 'Planos de ação' },
];

// Only MVV and Golden Circle are implemented (UC-14); the other two sections
// are shown per the design but aren't wired to any content yet.
const ENABLED_KEYS = new Set(['mvv', 'golden-circle']);

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
          {NAV_ITEMS.map((item) => {
            const enabled = ENABLED_KEYS.has(item.key);
            return (
              <li key={item.key}>
                <button
                  type="button"
                  className={`painel-interno__item ${active === item.key ? 'painel-interno__item--active' : ''}`}
                  onClick={() => enabled && onSelect(item.key)}
                  disabled={!enabled}
                  aria-current={active === item.key ? 'true' : undefined}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}
