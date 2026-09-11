import { useState } from 'react';
import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import { TargetIcon } from '../icons';
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

  // FE-E1: rótulo e texto de cada um dos 3 itens são obrigatórios.
  // Sem endpoint de institucional ainda (ver mockData.js), a "gravação" é
  // direto no array GOLDEN_CIRCLE_DATA importado - dura enquanto a página não
  // recarrega.
  const saveEditing = () => {
    const trimmed = draft.map((item) => ({
      ...item,
      label: item.label.trim(),
      text: item.text.trim(),
    }));

    if (trimmed.some((item) => !item.label || !item.text)) {
      setError('Esse campo não pode ser vazio.');
      return;
    }

    trimmed.forEach((item) => {
      const original = GOLDEN_CIRCLE_DATA.find((candidate) => candidate.number === item.number);
      original.label = item.label;
      original.text = item.text;
    });

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
            <button type="button" className="gc-btn gc-btn--ghost" onClick={cancelEditing}>
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
    </section>
  );
}
