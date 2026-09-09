import { useEffect, useState } from 'react';
import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import DateField from '../../../components/ui/DateField';
import { DocumentIcon, GearIcon, TargetIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon, TrashIcon } from '../icons';
import { PLANEJAMENTO_DATA, CICLO_TATICO_DATA } from '../mockData';
import { getObjectives, createObjective, updateObjective, deleteObjective } from '../../../services/objectiveService';
import { maskDate, isValidDate, maskedToIso, isoToMasked } from '../../../utils/formatters';
import './PlanejamentoEstrategico.css';

const MONTH_NAMES = [
  'Janeiro',
  'Fevereiro',
  'Março',
  'Abril',
  'Maio',
  'Junho',
  'Julho',
  'Agosto',
  'Setembro',
  'Outubro',
  'Novembro',
  'Dezembro',
];

function getMonthGrid(year, month) {
  const firstWeekday = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const cells = Array(firstWeekday).fill(null);
  for (let day = 1; day <= daysInMonth; day += 1) cells.push(day);
  return cells;
}

// Decorative-only fields (progress, deadline, KRs) aren't part of the
// backend's Objective model (see mockData.js), so they're kept here instead,
// keyed by the real id - the only way to have them survive a reload without
// touching the backend.
const EXTRAS_STORAGE_KEY = 'portal-orc:planejamento-objetivo-extras';

function loadStoredExtras() {
  try {
    const raw = localStorage.getItem(EXTRAS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveStoredExtra(id, extra) {
  try {
    const all = loadStoredExtras();
    all[id] = extra;
    localStorage.setItem(EXTRAS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // localStorage unavailable (private mode, etc.) - the extras just won't
    // survive a reload, which is fine for this decorative-only data.
  }
}

function removeStoredExtra(id) {
  try {
    const all = loadStoredExtras();
    delete all[id];
    localStorage.setItem(EXTRAS_STORAGE_KEY, JSON.stringify(all));
  } catch {
    // Nothing to clean up if storage isn't available in the first place.
  }
}

// Falls back to the static mockData slots (by list position) for objetivos
// created before this storage existed.
function mergeWithMockExtras(objectives) {
  const stored = loadStoredExtras();
  return objectives.map((objective, index) => {
    const extra = stored[objective.id] ?? PLANEJAMENTO_DATA[index] ?? {};
    return {
      id: objective.id,
      numero: index + 1,
      descricao: objective.description,
      progresso: extra.progresso ?? 0,
      prazo: extra.prazo ?? null,
      resultadosChave: extra.resultadosChave ?? [],
    };
  });
}

// prazo (deadline) is kept in the same DD/MM/AAAA masked format the
// DateField/register-form pair already use; blank means no deadline set.
function isBlankOrValidDate(masked) {
  return !masked.trim() || isValidDate(masked);
}

// Shared by the create panel and the per-objetivo edit form so both offer
// the same fields (descrição, prazo, KRs) without duplicating the markup.
function ObjetivoFormFields({
  descricao,
  onDescricaoChange,
  descricaoPlaceholder,
  prazo,
  onPrazoChange,
  prazoFieldName,
  krs,
  onKrChange,
  onAddKr,
  onRemoveKr,
}) {
  return (
    <>
      <textarea
        className="pe-card__textarea"
        value={descricao}
        onChange={(e) => onDescricaoChange(e.target.value)}
        rows={4}
        placeholder={descricaoPlaceholder}
        autoFocus
      />

      <div className="pe-card__prazo-field">
        <DateField
          name={prazoFieldName}
          label="Prazo (opcional)"
          value={prazo}
          onChange={(e) => onPrazoChange(maskDate(e.target.value))}
          required={false}
        />
      </div>

      <p className="pe-card__edit-label">Resultados-chave (ao menos um é obrigatório)</p>
      <div className="pe-kr-form-list">
        {krs.map((texto, index) => (
          <div key={index} className="pe-kr-form-row">
            <span className="pe-kr__badge">KR {index + 1}</span>
            <textarea
              className="pe-card__textarea pe-kr-form-textarea"
              value={texto}
              onChange={(e) => onKrChange(index, e.target.value)}
              rows={2}
              placeholder="Descreva o resultado-chave..."
            />
            <button
              type="button"
              className="pe-kr-form-remove"
              aria-label={`Remover KR ${index + 1}`}
              onClick={() => onRemoveKr(index)}
              disabled={krs.length === 1}
            >
              ×
            </button>
          </div>
        ))}
      </div>
      <button type="button" className="pe-btn pe-btn--ghost pe-kr-add-btn" onClick={onAddKr}>
        + Adicionar KR
      </button>
    </>
  );
}

export default function PlanejamentoEstrategico() {
  const [viewDate, setViewDate] = useState(() => new Date());

  const [objectives, setObjectives] = useState(null);
  const [loadError, setLoadError] = useState(null);

  const [editingId, setEditingId] = useState(null);
  const [draftText, setDraftText] = useState('');
  const [draftPrazo, setDraftPrazo] = useState('');
  const [draftKrs, setDraftKrs] = useState([]);
  const [editError, setEditError] = useState(null);
  const [saving, setSaving] = useState(false);

  const [deletingId, setDeletingId] = useState(null);
  const [deleteError, setDeleteError] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const [creating, setCreating] = useState(false);
  const [newText, setNewText] = useState('');
  const [newPrazo, setNewPrazo] = useState('');
  const [newKrs, setNewKrs] = useState([]);
  const [createError, setCreateError] = useState(null);
  const [submittingCreate, setSubmittingCreate] = useState(false);

  useEffect(() => {
    let cancelled = false;

    getObjectives()
      .then((data) => {
        if (!cancelled) setObjectives(data ?? []);
      })
      .catch((err) => {
        if (!cancelled) setLoadError(err.message);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const startCreating = () => {
    setCreating(true);
    setNewText('');
    setNewPrazo('');
    setNewKrs(['']);
    setCreateError(null);
    setEditingId(null);
  };

  const cancelCreating = () => {
    setCreating(false);
    setNewText('');
    setNewPrazo('');
    setNewKrs([]);
    setCreateError(null);
  };

  const addKrField = () => setNewKrs((prev) => [...prev, '']);
  const updateKrField = (index, value) =>
    setNewKrs((prev) => prev.map((kr, i) => (i === index ? value : kr)));
  const removeKrField = (index) => setNewKrs((prev) => prev.filter((_, i) => i !== index));

  // FE-E1 applies to novos objetivos too - an empty descrição can't be sent,
  // every objetivo needs at least one non-blank KR, and prazo (if given) must
  // be a valid day of month.
  const submitCreate = async () => {
    const trimmed = newText.trim();
    if (!trimmed) {
      setCreateError('Esse campo não pode ser vazio.');
      return;
    }

    const trimmedKrs = newKrs.map((texto) => texto.trim());
    if (trimmedKrs.length === 0) {
      setCreateError('Adicione ao menos um resultado-chave (KR).');
      return;
    }
    if (trimmedKrs.some((texto) => !texto)) {
      setCreateError('Nenhum resultado-chave (KR) pode ficar vazio.');
      return;
    }

    if (!isBlankOrValidDate(newPrazo)) {
      setCreateError('Prazo inválido.');
      return;
    }

    setSubmittingCreate(true);
    try {
      await createObjective(trimmed);
      // The create endpoint returns no body, so the freshly-created id is
      // only known by asking the list again - it's the highest id back.
      const refreshed = await getObjectives();
      const list = refreshed ?? [];
      setObjectives(list);

      const created = list.reduce((max, o) => (max === null || o.id > max.id ? o : max), null);
      if (created) {
        const resultadosChave = trimmedKrs.map((texto, i) => ({ label: `KR ${i + 1}`, texto }));
        const prazo = newPrazo.trim() ? maskedToIso(newPrazo) : null;
        saveStoredExtra(created.id, { progresso: 0, prazo, resultadosChave });
      }

      cancelCreating();
    } catch (err) {
      setCreateError(err.message);
    } finally {
      setSubmittingCreate(false);
    }
  };

  const addButton = (
    <button
      type="button"
      className="pe-add-btn"
      onClick={startCreating}
      disabled={creating || editingId !== null || objectives === null || Boolean(loadError)}
    >
      <TargetIcon />
      Adicionar objetivo
    </button>
  );

  const createPanel = creating && (
    <article className="pe-card">
      <div className="pe-card__header">
        <span className="pe-card__badge">
          <GearIcon />
          Novo objetivo:
        </span>
      </div>
      <div className="pe-card__edit-form">
        <ObjetivoFormFields
          descricao={newText}
          onDescricaoChange={(value) => {
            setNewText(value);
            setCreateError(null);
          }}
          descricaoPlaceholder="Descreva o novo objetivo..."
          prazo={newPrazo}
          onPrazoChange={(value) => {
            setNewPrazo(value);
            setCreateError(null);
          }}
          prazoFieldName="novo-objetivo-prazo"
          krs={newKrs}
          onKrChange={(index, value) => {
            updateKrField(index, value);
            setCreateError(null);
          }}
          onAddKr={addKrField}
          onRemoveKr={removeKrField}
        />
        {createError && <p className="pe-card__edit-error">{createError}</p>}

        <div className="pe-card__edit-actions">
          <button type="button" className="pe-btn pe-btn--ghost" onClick={cancelCreating} disabled={submittingCreate}>
            Cancelar
          </button>
          <button type="button" className="pe-btn" onClick={submitCreate} disabled={submittingCreate}>
            {submittingCreate ? 'Salvando...' : 'Adicionar'}
          </button>
        </div>
      </div>
    </article>
  );

  if (loadError) {
    return (
      <section>
        <SectionHeader icon={DocumentIcon} title="Planejamento estratégico" showEdit={false} action={addButton} />
        <EmptyState message={loadError} />
      </section>
    );
  }

  if (objectives === null) {
    return (
      <section>
        <SectionHeader icon={DocumentIcon} title="Planejamento estratégico" showEdit={false} action={addButton} />
        <EmptyState message="Carregando conteúdo..." />
      </section>
    );
  }

  if (objectives.length === 0) {
    return (
      <section>
        <SectionHeader icon={DocumentIcon} title="Planejamento estratégico" showEdit={false} action={addButton} />
        {creating ? <div className="pe-objetivos">{createPanel}</div> : (
          <EmptyState message="O conteúdo do Planejamento Estratégico e dos Objetivos do Ano ainda não foi configurado." />
        )}
      </section>
    );
  }

  const objetivos = mergeWithMockExtras(objectives);

  const [ano, semestre] = CICLO_TATICO_DATA.ciclo.split('.');
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  // prazo is a full yyyy-MM-dd date now, so a deadline only highlights a day
  // on the calendar while that day's month/year is the one being viewed.
  const objetivoPorPrazo = new Map();
  objetivos.forEach((objetivo) => {
    if (!objetivo.prazo) return;
    const [prazoYear, prazoMonth, prazoDay] = objetivo.prazo.split('-').map(Number);
    if (prazoYear === year && prazoMonth === month + 1) {
      objetivoPorPrazo.set(prazoDay, objetivo);
    }
  });
  const cells = getMonthGrid(year, month);

  const goToPrevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  const startEditing = (objetivo) => {
    setEditingId(objetivo.id);
    setDraftText(objetivo.descricao);
    setDraftPrazo(objetivo.prazo ? isoToMasked(objetivo.prazo) : '');
    setDraftKrs(objetivo.resultadosChave.length > 0 ? objetivo.resultadosChave.map((kr) => kr.texto) : ['']);
    setEditError(null);
    setDeletingId(null);
    setDeleteError(null);
  };

  const cancelEditing = () => {
    setEditingId(null);
    setDraftText('');
    setDraftPrazo('');
    setDraftKrs([]);
    setEditError(null);
    setDeletingId(null);
    setDeleteError(null);
  };

  const addDraftKr = () => setDraftKrs((prev) => [...prev, '']);
  const updateDraftKr = (index, value) =>
    setDraftKrs((prev) => prev.map((kr, i) => (i === index ? value : kr)));
  const removeDraftKr = (index) => setDraftKrs((prev) => prev.filter((_, i) => i !== index));

  // FE-E1: an objetivo's descrição is required, it needs at least one
  // non-blank KR, and prazo (if given) must be a valid date - block the save
  // and point out the problem instead of sending it to the backend.
  const saveEditing = async (id, currentProgresso) => {
    const trimmed = draftText.trim();
    if (!trimmed) {
      setEditError('Esse campo não pode ser vazio.');
      return;
    }

    const trimmedKrs = draftKrs.map((texto) => texto.trim());
    if (trimmedKrs.length === 0) {
      setEditError('Adicione ao menos um resultado-chave (KR).');
      return;
    }
    if (trimmedKrs.some((texto) => !texto)) {
      setEditError('Nenhum resultado-chave (KR) pode ficar vazio.');
      return;
    }

    if (!isBlankOrValidDate(draftPrazo)) {
      setEditError('Prazo inválido.');
      return;
    }

    setSaving(true);
    try {
      const updated = await updateObjective(id, trimmed);
      setObjectives((prev) => prev.map((o) => (o.id === id ? updated : o)));
      const resultadosChave = trimmedKrs.map((texto, i) => ({ label: `KR ${i + 1}`, texto }));
      const prazo = draftPrazo.trim() ? maskedToIso(draftPrazo) : null;
      saveStoredExtra(id, { progresso: currentProgresso, prazo, resultadosChave });
      cancelEditing();
    } catch (err) {
      setEditError(err.message);
    } finally {
      setSaving(false);
    }
  };

  const startDeleting = (objetivo) => {
    setDeletingId(objetivo.id);
    setDeleteError(null);
  };

  const cancelDeleting = () => {
    setDeletingId(null);
    setDeleteError(null);
  };

  const confirmDelete = async (id) => {
    setDeleting(true);
    try {
      await deleteObjective(id);
      setObjectives((prev) => prev.filter((o) => o.id !== id));
      removeStoredExtra(id);
      cancelEditing();
    } catch (err) {
      setDeleteError(err.message);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <section>
      <SectionHeader icon={DocumentIcon} title="Planejamento estratégico" showEdit={false} action={addButton} />

      <div className="pe-objetivos">
        {createPanel}
        {objetivos.map((objetivo) => {
          const isEditing = editingId === objetivo.id;

          return (
            <article key={objetivo.id} className="pe-card">
              <div className="pe-card__header">
                <span className="pe-card__badge">
                  <GearIcon />
                  Objetivo {objetivo.numero}:
                </span>
                <div className="pe-progress">
                  <div className="pe-progress__track">
                    <div className="pe-progress__fill" style={{ width: `${objetivo.progresso}%` }} />
                  </div>
                  <span className="pe-progress__label">{objetivo.progresso}%</span>
                </div>
                {!isEditing && (
                  <button
                    type="button"
                    className="pe-card__edit"
                    aria-label={`Editar Objetivo ${objetivo.numero}`}
                    onClick={() => startEditing(objetivo)}
                    disabled={editingId !== null || creating}
                  >
                    <EditIcon />
                  </button>
                )}
              </div>

              {isEditing ? (
                <div className="pe-card__edit-form">
                  {deletingId === objetivo.id ? (
                    <>
                      <p className="pe-card__delete-confirm-text">
                        Tem certeza que deseja excluir o Objetivo {objetivo.numero}? Essa ação não pode ser desfeita.
                      </p>
                      {deleteError && <p className="pe-card__edit-error">{deleteError}</p>}
                      <div className="pe-card__edit-actions">
                        <button type="button" className="pe-btn pe-btn--ghost" onClick={cancelDeleting} disabled={deleting}>
                          Cancelar
                        </button>
                        <button
                          type="button"
                          className="pe-btn pe-btn--danger"
                          onClick={() => confirmDelete(objetivo.id)}
                          disabled={deleting}
                        >
                          {deleting ? 'Excluindo...' : 'Excluir'}
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      <ObjetivoFormFields
                        descricao={draftText}
                        onDescricaoChange={(value) => {
                          setDraftText(value);
                          setEditError(null);
                        }}
                        descricaoPlaceholder="Descreva o objetivo..."
                        prazo={draftPrazo}
                        onPrazoChange={(value) => {
                          setDraftPrazo(value);
                          setEditError(null);
                        }}
                        prazoFieldName={`objetivo-${objetivo.id}-prazo`}
                        krs={draftKrs}
                        onKrChange={(index, value) => {
                          updateDraftKr(index, value);
                          setEditError(null);
                        }}
                        onAddKr={addDraftKr}
                        onRemoveKr={removeDraftKr}
                      />
                      {editError && <p className="pe-card__edit-error">{editError}</p>}
                      <div className="pe-card__edit-toolbar">
                        <button
                          type="button"
                          className="pe-card__delete"
                          aria-label={`Excluir Objetivo ${objetivo.numero}`}
                          onClick={() => startDeleting(objetivo)}
                          disabled={saving}
                        >
                          <TrashIcon />
                        </button>
                        <div className="pe-card__edit-actions">
                          <button type="button" className="pe-btn pe-btn--ghost" onClick={cancelEditing} disabled={saving}>
                            Cancelar
                          </button>
                          <button
                            type="button"
                            className="pe-btn"
                            onClick={() => saveEditing(objetivo.id, objetivo.progresso)}
                            disabled={saving}
                          >
                            {saving ? 'Salvando...' : 'Salvar'}
                          </button>
                        </div>
                      </div>
                    </>
                  )}
                </div>
              ) : (
                <p className="pe-card__text">{objetivo.descricao}</p>
              )}

              {!isEditing && (
                <ul className="pe-kr-list">
                  {objetivo.resultadosChave.map((kr) => (
                    <li key={kr.label} className="pe-kr">
                      <span className="pe-kr__badge">{kr.label}</span>
                      <p className="pe-kr__text">{kr.texto}</p>
                    </li>
                  ))}
                </ul>
              )}

              <div className="pe-card__actions">
                <button type="button" className="pe-btn">
                  Plano de ação
                </button>
              </div>
            </article>
          );
        })}
      </div>

      <h2 className="pe-ciclo__title">
        Ciclo tático {ano}
        <span className="pe-ciclo__accent">.{semestre}</span>
      </h2>

      <div className="pe-calendario">
        <div className="pe-calendario__glow-layer" aria-hidden="true">
          <div className="pe-calendario__glow" />
        </div>
        <div className="pe-calendario__content">
          <div className="pe-calendario__nav">
            <button
              type="button"
              className="pe-calendario__nav-btn"
              onClick={goToPrevMonth}
              aria-label="Mês anterior"
            >
              <ChevronLeftIcon />
            </button>
            <h3 className="pe-calendario__mes">
              {MONTH_NAMES[month]} {year}
            </h3>
            <button type="button" className="pe-calendario__nav-btn" onClick={goToNextMonth} aria-label="Próximo mês">
              <ChevronRightIcon />
            </button>
          </div>
          <div className="pe-calendario__grid">
            {CICLO_TATICO_DATA.diasSemana.map((dia) => (
              <span key={dia} className="pe-calendario__weekday">
                {dia}
              </span>
            ))}
            {cells.map((dia, index) => {
              if (dia === null) {
                return <span key={`blank-${index}`} className="pe-calendario__day pe-calendario__day--empty" />;
              }

              const objetivo = objetivoPorPrazo.get(dia);
              if (!objetivo) {
                return (
                  <span key={dia} className="pe-calendario__day">
                    {dia}
                  </span>
                );
              }
              return (
                <span
                  key={dia}
                  className="pe-calendario__day pe-calendario__day--highlight"
                  tabIndex={0}
                  aria-label={`Dia ${dia}: prazo do Objetivo ${objetivo.numero}`}
                >
                  {dia}
                  <span className="pe-calendario__tooltip" role="tooltip">
                    Objetivo {objetivo.numero}
                  </span>
                </span>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
