import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import { TargetIcon } from '../icons';
import { GOLDEN_CIRCLE_DATA } from '../mockData';
import './GoldenCircle.css';

export default function GoldenCircle() {
  if (!GOLDEN_CIRCLE_DATA || GOLDEN_CIRCLE_DATA.length === 0) {
    return (
      <section>
        <SectionHeader icon={TargetIcon} title="Golden Circle" />
        <EmptyState message="O conteúdo do Golden Circle ainda não foi configurado." />
      </section>
    );
  }

  return (
    <section>
      <SectionHeader icon={TargetIcon} title="Golden Circle" />

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
    </section>
  );
}
