import { useState } from 'react';
import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import { CloverIcon, SunIcon, ShieldIcon, HeartIcon } from '../icons';
import { MVV_DATA } from '../mockData';
import './MissaoVisaoValores.css';

// Never leave `draft` null: the React Compiler auto-memoizes the callbacks
// below by their `draft.*` property reads, and it generates those checks
// unconditionally on every render (not just while actually editing) - a
// null draft crashes the whole component on first paint, not just on use.
function buildDraft() {
  return {
    quote: MVV_DATA?.quote ?? '',
    missao: MVV_DATA?.missao ?? '',
    visao: MVV_DATA?.visao ?? '',
    valoresText: MVV_DATA?.valores?.text ?? '',
    tags: MVV_DATA?.valores?.tags ? [...MVV_DATA.valores.tags] : [],
  };
}

export default function MissaoVisaoValores() {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(buildDraft);
  const [error, setError] = useState(null);

  if (
    !MVV_DATA?.quote ||
    !MVV_DATA?.missao ||
    !MVV_DATA?.visao ||
    !MVV_DATA?.valores?.text ||
    !MVV_DATA?.valores?.tags?.length
  ) {
    return (
      <section>
        <SectionHeader icon={CloverIcon} title="Missão, Visão e Valores" />
        <EmptyState message="O conteúdo de Missão, Visão e Valores ainda não foi configurado." />
      </section>
    );
  }

  const { quote, missao, visao, valores } = MVV_DATA;

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

  const updateDraft = (field, value) => {
    setDraft((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const addTag = () => setDraft((prev) => ({ ...prev, tags: [...prev.tags, ''] }));
  const updateTag = (index, value) => {
    setDraft((prev) => ({ ...prev, tags: prev.tags.map((tag, i) => (i === index ? value : tag)) }));
    setError(null);
  };
  const removeTag = (index) => setDraft((prev) => ({ ...prev, tags: prev.tags.filter((_, i) => i !== index) }));

  // FE-E1: nenhum campo pode ficar vazio, e é preciso ao menos um valor.
  // Sem endpoint de institucional ainda (ver mockData.js), a "gravação" é
  // direto no objeto MVV_DATA importado - dura enquanto a página não recarrega.
  const saveEditing = () => {
    const trimmedQuote = draft.quote.trim();
    const trimmedMissao = draft.missao.trim();
    const trimmedVisao = draft.visao.trim();
    const trimmedValoresText = draft.valoresText.trim();
    const trimmedTags = draft.tags.map((tag) => tag.trim());

    if (!trimmedQuote || !trimmedMissao || !trimmedVisao || !trimmedValoresText) {
      setError('Esse campo não pode ser vazio.');
      return;
    }
    if (trimmedTags.length === 0) {
      setError('Adicione ao menos um valor.');
      return;
    }
    if (trimmedTags.some((tag) => !tag)) {
      setError('Nenhum valor pode ficar vazio.');
      return;
    }

    MVV_DATA.quote = trimmedQuote;
    MVV_DATA.missao = trimmedMissao;
    MVV_DATA.visao = trimmedVisao;
    MVV_DATA.valores.text = trimmedValoresText;
    MVV_DATA.valores.tags = trimmedTags;

    cancelEditing();
  };

  return (
    <section>
      <SectionHeader icon={CloverIcon} title="Missão, Visão e Valores" onEdit={editing ? undefined : startEditing} />

      {editing ? (
        <div className="mvv-edit-form">
          <p className="mvv-edit-label">Citação</p>
          <textarea
            className="mvv-edit-textarea"
            value={draft.quote}
            onChange={(e) => updateDraft('quote', e.target.value)}
            rows={2}
          />

          <p className="mvv-edit-label">Visão</p>
          <textarea
            className="mvv-edit-textarea"
            value={draft.visao}
            onChange={(e) => updateDraft('visao', e.target.value)}
            rows={3}
          />

          <p className="mvv-edit-label">Missão</p>
          <textarea
            className="mvv-edit-textarea"
            value={draft.missao}
            onChange={(e) => updateDraft('missao', e.target.value)}
            rows={3}
          />

          <p className="mvv-edit-label">Texto dos valores</p>
          <textarea
            className="mvv-edit-textarea"
            value={draft.valoresText}
            onChange={(e) => updateDraft('valoresText', e.target.value)}
            rows={3}
          />

          <p className="mvv-edit-label">Valores (ao menos um é obrigatório)</p>
          <div className="mvv-tag-form-list">
            {draft.tags.map((tag, index) => (
              <div key={index} className="mvv-tag-form-row">
                <input
                  type="text"
                  className="mvv-edit-input"
                  value={tag}
                  onChange={(e) => updateTag(index, e.target.value)}
                  placeholder="Descreva o valor..."
                />
                <button
                  type="button"
                  className="mvv-tag-form-remove"
                  aria-label={`Remover valor ${index + 1}`}
                  onClick={() => removeTag(index)}
                  disabled={draft.tags.length === 1}
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button type="button" className="mvv-btn mvv-btn--ghost mvv-tag-add-btn" onClick={addTag}>
            + Adicionar valor
          </button>

          {error && <p className="mvv-edit-error">{error}</p>}

          <div className="mvv-edit-actions">
            <button type="button" className="mvv-btn mvv-btn--ghost" onClick={cancelEditing}>
              Cancelar
            </button>
            <button type="button" className="mvv-btn" onClick={saveEditing}>
              Salvar
            </button>
          </div>
        </div>
      ) : (
        <>
          <p className="mvv-quote">{quote}</p>

          <div className="mvv-grid">
            <article className="mvv-card mvv-card--visao">
              <span className="mvv-card__badge">
                <SunIcon />
                Visão:
              </span>
              <p className="mvv-card__text">{visao}</p>
            </article>

            <article className="mvv-card mvv-card--missao">
              <span className="mvv-card__badge">
                <ShieldIcon />
                Missão:
              </span>
              <p className="mvv-card__text">{missao}</p>
            </article>

            <article className="mvv-card mvv-card--valores">
              <span className="mvv-card__badge">
                <HeartIcon />
                Valores:
              </span>
              <p className="mvv-card__text">{valores.text}</p>
              <ul className="mvv-tags">
                {valores.tags.map((tag) => (
                  <li key={tag} className="mvv-tags__tag">
                    {tag}
                  </li>
                ))}
              </ul>
            </article>
          </div>
        </>
      )}
    </section>
  );
}
