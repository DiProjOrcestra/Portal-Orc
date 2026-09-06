import { EditIcon } from './icons';
import './SectionHeader.css';

// Edit shortcut is only shown to TOPS/Direx per RN11 (UC-14 FA-A2), but wiring
// that up to real auth/roles and the UC-15 edit flow is out of scope here —
// so for now the button is rendered but inert. Planejamento Estratégico
// (UC-16) hides it entirely via `showEdit`, since editing there happens per
// objetivo card instead of at the section level.
export default function SectionHeader({ icon: Icon, title, showEdit = true }) {
  return (
    <div className="section-header">
      <h1 className="section-header__title">
        <Icon className="section-header__icon" aria-hidden="true" />
        {title}
      </h1>
      {showEdit && (
        <button
          type="button"
          className="section-header__edit"
          aria-label="Editar conteúdo"
          title="Edição disponível em breve"
          disabled
        >
          <EditIcon />
        </button>
      )}
    </div>
  );
}
