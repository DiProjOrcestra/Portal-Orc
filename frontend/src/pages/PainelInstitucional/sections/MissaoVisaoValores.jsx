import SectionHeader from '../SectionHeader';
import EmptyState from '../EmptyState';
import { CloverIcon, SunIcon, ShieldIcon, HeartIcon } from '../icons';
import { MVV_DATA } from '../mockData';
import './MissaoVisaoValores.css';

export default function MissaoVisaoValores() {
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

  return (
    <section>
      <SectionHeader icon={CloverIcon} title="Missão, Visão e Valores" />

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
    </section>
  );
}
