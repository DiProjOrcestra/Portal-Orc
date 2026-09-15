import { EditIcon } from './icons';
import './SectionHeader.css';

// Edit shortcut is only shown to TOPS/Direx per RN11 (UC-14 FA-A2), but wiring
// that up to real auth/roles is out of scope here (no login flow exists on
// this branch yet) - so the button just calls `onEdit` when the caller
// provides one (UC-15), and stays inert otherwise. Planejamento Estratégico
// (UC-16/17) hides it entirely via `showEdit`, since editing there happens
// per objetivo card instead of at the section level, and instead passes its
// own `action` (the "Adicionar objetivo" button) into this same slot.
export default function SectionHeader({ icon: Icon, title, showEdit = true, onEdit, action }) {
  return (
    <div className="section-header">
      <h1 className="section-header__title">
        <Icon className="section-header__icon" aria-hidden="true" />
        {title}
      </h1>
      {(action || showEdit) && (
        <div className="section-header__actions">
          {action}
          {showEdit && (
            <button
              type="button"
              className="section-header__edit"
              aria-label="Editar conteúdo"
              title={onEdit ? 'Editar conteúdo' : 'Edição disponível em breve'}
              onClick={onEdit}
              disabled={!onEdit}
            >
              <EditIcon />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
