import { useState } from 'react';
import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import { DocumentIcon, GearIcon, ChevronLeftIcon, ChevronRightIcon, EditIcon } from '../icons';
import { PLANEJAMENTO_DATA, CICLO_TATICO_DATA } from '../mockData';
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

export default function PlanejamentoEstrategico() {
  // The mock objetivo deadlines (day-of-month only) are anchored to whichever
  // month the calendar opens on, so they're visible right away - navigating
  // to another month naturally shows no deadlines there, which is expected
  // for this placeholder data.
  const [referenceMonth] = useState(() => {
    const today = new Date();
    return { year: today.getFullYear(), month: today.getMonth() };
  });
  const [viewDate, setViewDate] = useState(() => new Date());

  if (!PLANEJAMENTO_DATA || PLANEJAMENTO_DATA.length === 0) {
    return (
      <section>
        <SectionHeader icon={DocumentIcon} title="Planejamento estratégico" showEdit={false} />
        <EmptyState message="O conteúdo do Planejamento Estratégico e dos Objetivos do Ano ainda não foi configurado." />
      </section>
    );
  }

  const [ano, semestre] = CICLO_TATICO_DATA.ciclo.split('.');
  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const isReferenceMonth = year === referenceMonth.year && month === referenceMonth.month;
  const objetivoPorPrazo = isReferenceMonth
    ? new Map(PLANEJAMENTO_DATA.filter((o) => o.prazo).map((o) => [o.prazo, o]))
    : new Map();
  const cells = getMonthGrid(year, month);

  const goToPrevMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() - 1, 1));
  const goToNextMonth = () => setViewDate((d) => new Date(d.getFullYear(), d.getMonth() + 1, 1));

  return (
    <section>
      <SectionHeader icon={DocumentIcon} title="Planejamento estratégico" showEdit={false} />

      <div className="pe-objetivos">
        {PLANEJAMENTO_DATA.map((objetivo) => (
          <article key={objetivo.numero} className="pe-card">
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
              <button
                type="button"
                className="pe-card__edit"
                aria-label={`Editar Objetivo ${objetivo.numero}`}
                title="Edição disponível em breve"
                disabled
              >
                <EditIcon />
              </button>
            </div>

            <p className="pe-card__text">{objetivo.descricao}</p>

            <ul className="pe-kr-list">
              {objetivo.resultadosChave.map((kr) => (
                <li key={kr.label} className="pe-kr">
                  <span className="pe-kr__badge">{kr.label}</span>
                  <p className="pe-kr__text">{kr.texto}</p>
                </li>
              ))}
            </ul>

            <div className="pe-card__actions">
              <button type="button" className="pe-btn">
                Plano de ação
              </button>
            </div>
          </article>
        ))}
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
