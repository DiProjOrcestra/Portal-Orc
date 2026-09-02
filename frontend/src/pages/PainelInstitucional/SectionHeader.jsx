import { EditIcon } from './icons';
import './SectionHeader.css';

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