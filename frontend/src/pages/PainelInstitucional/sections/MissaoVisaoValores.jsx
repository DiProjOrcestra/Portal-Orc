import { useEffect, useState } from 'react';
import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import { CloverIcon, SunIcon, ShieldIcon, HeartIcon, CheckIcon, AlertIcon } from '../icons';
import { MVV_DATA } from '../mockData';
import { createMvv, getMvv, updateMvv } from '../../../services/institutionalService';
import './MissaoVisaoValores.css';

// Never leave `draft` null: the React Compiler auto-memoizes the callbacks
// below by their `draft.*` property reads, and it generates those checks
// unconditionally on every render (not just while actually editing) - a
// null draft crashes the whole component on first paint, not just on use.
function buildDraft(data) {
  return {
    quote: data?.quote ?? '',
    missao: data?.missao ?? '',
    visao: data?.visao ?? '',
    valoresText: data?.valores?.text ?? '',
    tags: data?.valores?.tags ? [...data.valores.tags] : [],
  };
}

export default function MissaoVisaoValores() {
  const [mvvData, setMvvData] = useState(MVV_DATA);
  const [hasRemoteMvv, setHasRemoteMvv] = useState(false);
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(() => buildDraft(MVV_DATA));
  const [error, setError] = useState(null);
  const [confirmingSave, setConfirmingSave] = useState(false);
  const [confirmingCancel, setConfirmingCancel] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    getMvv()
      .then((response) => {
        if (!active || !response) return;
        const data = {
          quote: response.quote,
          missao: response.mission,
          visao: response.vision,
          valores: { text: response.valuesText, tags: response.values ?? [] },
        };
        setMvvData(data);
        setHasRemoteMvv(true);
      })
      .catch(() => setHasRemoteMvv(false));

    return () => {
      active = false;
    };
  }, []);

  if (
    !mvvData?.quote ||
    !mvvData?.missao ||
    !mvvData?.visao ||
    !mvvData?.valores?.text ||
    !mvvData?.valores?.tags?.length
  ) {
    return (
      <section>
        <SectionHeader icon={CloverIcon} title="Missão, Visão e Valores" />
        <EmptyState message="O conteúdo de Missão, Visão e Valores ainda não foi configurado." />
      </section>
    );
  }

  const { quote, missao, visao, valores } = mvvData;

  const startEditing = () => {
    setDraft(buildDraft(mvvData));
    setError(null);
    setEditing(true);
  };

  const cancelEditing = () => {
    setEditing(false);
    setDraft(buildDraft(mvvData));
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
  // Validar aqui só decide se abre o pop-up de confirmação - a gravação em si
  // só acontece se o usuário confirmar (ver confirmSave).
  const saveEditing = () => {
    const trimmedTags = draft.tags.map((tag) => tag.trim());

    if (!draft.quote.trim() || !draft.missao.trim() || !draft.visao.trim() || !draft.valoresText.trim()) {
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
    const trimmedTags = draft.tags.map((tag) => tag.trim());
    const payload = {
      quote: draft.quote.trim(),
      mission: draft.missao.trim(),
      vision: draft.visao.trim(),
      valuesText: draft.valoresText.trim(),
      values: trimmedTags,
    };

    setSaving(true);
    try {
      const response = hasRemoteMvv ? await updateMvv(payload) : await createMvv(payload);
      const data = response
        ? {
            quote: response.quote,
            missao: response.mission,
            visao: response.vision,
            valores: { text: response.valuesText, tags: response.values ?? [] },
          }
        : { quote: payload.quote, missao: payload.mission, visao: payload.vision, valores: { text: payload.valuesText, tags: trimmedTags } };
      setMvvData(data);
      setHasRemoteMvv(true);
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
            <button type="button" className="mvv-btn mvv-btn--ghost" onClick={startConfirmCancel}>
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

      {confirmingSave && (
        <div className="mvv-modal-scrim" onClick={cancelConfirmSave}>
          <div
            className="mvv-modal"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="mvv-confirm-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mvv-modal__icon">
              <CheckIcon />
            </span>
            <h2 id="mvv-confirm-modal-title" className="mvv-modal__title">
              Salvar alterações?
            </h2>
            <p className="mvv-modal__message">
              Tem certeza que deseja salvar as alterações em Missão, Visão e Valores? O conteúdo exibido a todos os
              membros será atualizado.
            </p>
            <div className="mvv-modal__actions">
              <button type="button" className="mvv-btn mvv-btn--ghost" onClick={cancelConfirmSave}>
                Cancelar
              </button>
              <button type="button" className="mvv-btn" onClick={confirmSave} autoFocus>
                Confirmar
              </button>
            </div>
          </div>
        </div>
      )}

      {confirmingCancel && (
        <div className="mvv-modal-scrim" onClick={closeConfirmCancel}>
          <div
            className="mvv-modal mvv-modal--danger"
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="mvv-cancel-modal-title"
            onClick={(e) => e.stopPropagation()}
          >
            <span className="mvv-modal__icon mvv-modal__icon--danger">
              <AlertIcon />
            </span>
            <h2 id="mvv-cancel-modal-title" className="mvv-modal__title">
              Cancelar edição?
            </h2>
            <p className="mvv-modal__message">
              As alterações feitas não serão salvas. Tem certeza que deseja sair sem salvar?
            </p>
            <div className="mvv-modal__actions">
              <button type="button" className="mvv-btn mvv-btn--ghost" onClick={closeConfirmCancel}>
                Continuar editando
              </button>
              <button type="button" className="mvv-btn mvv-btn--danger" onClick={confirmCancel} autoFocus>
                Sim, cancelar
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
