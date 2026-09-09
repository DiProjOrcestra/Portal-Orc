import { ClipboardIcon, FilterIcon, CampaignIcon, EditIcon } from '../icons';
import { PLANO_ACAO_DATA } from '../mockData';
import './PlanoDeAcao.css';

// Mesmo mapeamento de status usado no backend (ActionPlanRequestDto.progress
// é uma String livre, ainda sem enum) - centralizado aqui pra já ficar fácil
// de trocar por um enum de verdade quando o back definir um.
const STATUS_LABEL = {
  concluido: 'Concluído',
  andamento: 'Em andamento',
  'nao-concluido': 'Não Concluído',
};

export default function PlanoDeAcao() {
  return (
    <section>
      <div className="pa-header">
        <div className="pa-header__top">
          <h1 className="pa-header__title">
            <ClipboardIcon className="pa-header__icon" aria-hidden="true" />
            Planos de ação
          </h1>
          {/* Sem lógica de filtro implementada ainda - só o botão do design,
              inerte, no mesmo espírito dos botões de editar desabilitados nas
              outras seções. */}
          <button type="button" className="pa-filter" disabled title="Filtro disponível em breve">
            <FilterIcon />
            Filtro
          </button>
        </div>
        <p className="pa-header__intro">
          It is a long established fact that a reader will be distracted by the readable content of a page when
          looking at its layout.
        </p>
      </div>

      <div className="pa-diretorias">
        {PLANO_ACAO_DATA.map((diretoria) => (
          <article key={diretoria.directorate} className={`pa-card ${diretoria.capa ? 'pa-card--capa' : ''}`}>
            {diretoria.capa && (
              <div className="pa-card__capa" style={{ backgroundImage: `url(${diretoria.capa})` }} aria-hidden="true" />
            )}

            <div className="pa-card__inner">
              <div className="pa-card__header">
                <span className="pa-card__badge">
                  <CampaignIcon />
                  {diretoria.directorate}
                </span>
                <div className="pa-card__objetivo-group">
                  <span className="pa-card__objetivo">Objetivo {diretoria.objetivo}</span>
                  <button
                    type="button"
                    className="pa-card__edit"
                    aria-label="Editar diretoria"
                    title="Edição disponível em breve"
                    disabled
                  >
                    <EditIcon />
                  </button>
                </div>
              </div>

              <div className="pa-planos">
                {diretoria.planos.map((plano) => (
                  <div key={plano.id} className="pa-plano">
                    <div className="pa-plano__top">
                      <span className="pa-plano__prazo">Prazo: {plano.prazo}</span>
                      <span className={`pa-status pa-status--${plano.status}`}>
                        {STATUS_LABEL[plano.status]}
                        <span className="pa-status__dot" />
                      </span>
                    </div>

                    {/* Fiel ao Figma: "Atividade" e "Subtarefas:" são dois
                        rótulos estáticos empilhados, sem nenhum texto de
                        descrição entre eles - o conteúdo real começa direto
                        na lista abaixo. */}
                    <div className="pa-plano__bloco">
                      <h3 className="pa-plano__atividade">Atividade</h3>
                      <h4 className="pa-plano__subtarefas-titulo">Subtarefas:</h4>
                      <ul className="pa-subtarefas">
                        {plano.subtarefas.map((tarefa) => (
                          <li key={tarefa}>
                            {/* Quadrado decorativo, não é um checkbox
                                interativo - o design não distingue subtarefa
                                concluída de pendente aqui. */}
                            <span className="pa-subtarefa__box" aria-hidden="true" />
                            <span>{tarefa}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* O Figma só mostra o rótulo "Responsáveis:", sem nomes
                        preenchidos - mantido vazio de propósito. */}
                    <div className="pa-plano__responsaveis">Responsáveis:</div>
                  </div>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
