import { useEffect, useState } from 'react';
import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import { TargetIcon, CheckIcon, AlertIcon } from '../icons';
import { GOLDEN_CIRCLE_DATA } from '../mockData';
import { createGoldenCircle, getGoldenCircle, updateGoldenCircle } from '../../../services/institutionalService';
import './GoldenCircle.css';

const REQUIRED_NUMBERS = [1, 2, 3];

// Never leave `draft` null: the React Compiler can auto-memoize callbacks by
// individual property reads (e.g. `draft.missao` in MissaoVisaoValores) and
// generate those checks unconditionally on every render, not just while
// actually editing - a null draft would crash the whole component on first
// paint. Keeping it always a valid array sidesteps that regardless of how
// saveEditing/updateDraftField end up being written later.
function buildDraft(data) {
  return (data ?? []).map((item) => ({ ...item }));
}

export default function GoldenCircle() {
  const [goldenCircleData, setGoldenCircleData] = useState(GOLDEN_CIRCLE_DATA);
  const [hasRemoteGoldenCircle, setHasRemoteGoldenCircle] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => buildDraft(GOLDEN_CIRCLE_DATA));
  const [error, setError] = useState(null);
  const [confirmingSave, setConfirmingSave] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    getGoldenCircle()
      .then((response) => {
        if (!active || !response?.length) return;
        setGoldenCircleData(response);
        setHasRemoteGoldenCircle(true);
      })
      .catch(() => setHasRemoteGoldenCircle(false));

    return () => {
      active = false;
    };
  }, []);

  const hasAllItems = REQUIRED_NUMBERS.every((number) => {
    const item = goldenCircleData?.find((candidate) => candidate.number === number);
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
    setDraft(buildDraft(goldenCircleData));
    setError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDraft(buildDraft(goldenCircleData));
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

  const confirmSave = async () => {
    setSaving(true);

    try {
      const requests = draft.map((item) => {
        const payload = { number: item.number, label: item.label.trim(), text: item.text.trim() };
        return hasRemoteGoldenCircle ? updateGoldenCircle(item.number, payload) : createGoldenCircle(payload);
      });
      const response = await Promise.all(requests);
      const savedItems = response.some(Boolean)
        ? response.filter(Boolean)
        : draft.map((item) => ({ ...item, label: item.label.trim(), text: item.text.trim() }));
      setGoldenCircleData(savedItems);
      setHasRemoteGoldenCircle(true);
      setConfirmingSave(false);
      cancelEditing();
    } catch (saveError) {
      setError(saveError.message);
    } finally {
      setSaving(false);
    }
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

          {goldenCircleData.map((item) => (
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
