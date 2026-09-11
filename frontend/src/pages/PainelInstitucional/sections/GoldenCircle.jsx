import { useState } from 'react';
import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import { TargetIcon, CheckIcon, AlertIcon } from '../icons';
import { GOLDEN_CIRCLE_DATA } from '../mockData';
import './GoldenCircle.css';

const REQUIRED_NUMBERS = [1, 2, 3];

// Never leave `draft` null: the React Compiler can auto-memoize callbacks by
// individual property reads (e.g. `draft.missao` in MissaoVisaoValores) and
// generate those checks unconditionally on every render, not just while
// actually editing - a null draft would crash the whole component on first
// paint. Keeping it always a valid array sidesteps that regardless of how
// saveEditing/updateDraftField end up being written later.
function buildDraft() {
  return (GOLDEN_CIRCLE_DATA ?? []).map((item) => ({ ...item }));
}

export default function GoldenCircle() {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(buildDraft);
  const [error, setError] = useState(null);
  const [confirmingSave, setConfirmingSave] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);

  const hasAllItems = REQUIRED_NUMBERS.every((number) => {
    const item = GOLDEN_CIRCLE_DATA?.find((candidate) => candidate.number === number);
    return item?.label && item?.text;
  });

  if (!hasAllItems) {
    return (
      <section>
        <SectionHeader icon={TargetIcon} title="Golden Circle" />
        <EmptyState message="O conteúdo do Golden Circle ainda não foi configurado." />
      </section>
    );
  }

  const startEditing = () => {
    setDraft(buildDraft());
    setError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDraft(buildDraft());
    setError(null);
  };

  const updateDraftField = (number, field, value) => {
    setDraft((prev) => prev.map((item) => (item.number === number ? { ...item, [field]: value } : item)));
    setError(null);
  };

  // FE-E1: rótulo e texto de cada um dos 3 itens são obrigatórios. Validar
  // aqui só decide se abre o pop-up de confirmação - a gravação em si só
  // acontece se o usuário confirmar (ver confirmSave).
  const saveEditing = () => {
    const hasBlankField = draft.some((item) => !item.label.trim() || !item.text.trim());

    if (hasBlankField) {
      setError('Esse campo não pode ser vazio.');
      return;
    }

    setConfirmingSave(true);
  };

  const cancelConfirmSave = () => setConfirmingSave(false);

  const startConfirmCancel = () => setConfirmingCancel(true);
  const closeConfirmCancel = () => setConfirmingCancel(false);
  const confirmCancel = () => {
    setConfirmingCancel(false);
    cancelEditing();
  };

  // Sem endpoint de institucional ainda (ver mockData.js), a "gravação" é
  // direto no array GOLDEN_CIRCLE_DATA importado - dura enquanto a página não
  // recarrega.
  const confirmSave = () => {
    draft.forEach((item) => {
      const original = GOLDEN_CIRCLE_DATA.find((candidate) => candidate.number === item.number);
      original.label = item.label.trim();
      original.text = item.text.trim();
    });

    setConfirmingSave(false);
    cancelEditing();
  };

  return (
    <section>
      <SectionHeader icon={TargetIcon} title="Golden Circle" onEdit={editing ? undefined : startEditing} />

      {editing ? (
        <div className="gc-edit-form">
          {draft.map((item) => (
            <div key={item.number} className="gc-edit-item">
              <p className="gc-edit-label">{item.number}. Rótulo</p>
              <input
                type="text"
                className="gc-edit-input"
                value={item.label}
                onChange={(e) => updateDraftField(item.number, 'label', e.target.value)}
              />

              <p className="gc-edit-label">{item.number}. Texto</p>
              <textarea
                className="gc-edit-textarea"
                value={item.text}
                onChange={(e) => updateDraftField(item.number, 'text', e.target.value)}
                rows={3}
              />
            </div>
          ))}

          {error && <p className="gc-edit-error">{error}</p>}

          <div className="gc-edit-actions">
            <button type="button" className="gc-btn gc-btn--ghost" onClick={startConfirmCancel}>
              Cancelar
            </button>
            <button type="button" className="gc-btn" onClick={saveEditing}>
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <div className="gc-grid">
          <div className="gc-diagram" aria-hidden="true">
            <span className="gc-diagram__ring gc-diagram__ring--1" />
            <span className="gc-diagram__ring gc-diagram__ring--2" />
            <span className="gc-diagram__ring gc-diagram__ring--3" />
            <div className="gc-diagram__labels">
              <span className="gc-diagram__labels-1">O que?</span>
              <span className="gc-diagram__labels-2">Como?</span>
              <span className="gc-diagram__labels-3">Por quê?</span>
            </div>
          </div>

          {GOLDEN_CIRCLE_DATA.map((item) => (
            <article key={item.number} className={`gc-card gc-card--${item.number}`}>
              <h2 className="gc-card__title">
                {item.number}. {item.label}
              </h2>
              <p className="gc-card__text">{item.text}</p>
            </article>
          ))}
        </div>
      )}

      {confirmingSave && (
        <div className="gc-modal-scrim" onClick={cancelConfirmSave}>
          <div
            className="gc-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="gc-confirm-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="gc-modal__icon">
              <CheckIcon />
            </span>
            <h2 id="gc-confirm-modal-title" className="gc-modal__title">
              Salvar alterações?
            </h2>
            <p className="gc-modal__message">
              Tem certeza que deseja salvar as alterações no Golden Circle? O conteúdo exibido a todos os membros
              será atualizado.
            </p>
            <div className="gc-modal__actions">
              <button type="button" className="gc-btn gc-btn--ghost" onClick={cancelConfirmSave}>
                Cancelar
              </button>
              <button type="button" className="gc-btn" onClick={confirmSave} autoFocus>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmingCancel && (
        <div className="gc-modal-scrim" onClick={closeConfirmCancel}>
          <div
            className="gc-modal gc-modal--danger"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="gc-cancel-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="gc-modal__icon gc-modal__icon--danger">
              <AlertIcon />
            </span>
            <h2 id="gc-cancel-modal-title" className="gc-modal__title">
              Cancelar edição?
            </h2>
            <p className="gc-modal__message">
              As alterações feitas não serão salvas. Tem certeza que deseja sair sem salvar?
            </p>
            <div className="gc-modal__actions">
              <button type="button" className="gc-btn gc-btn--ghost" onClick={closeConfirmCancel}>
                Continuar editando
              </button>
              <button type="button" className="gc-btn gc-btn--danger" onClick={confirmCancel} autoFocus>
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
