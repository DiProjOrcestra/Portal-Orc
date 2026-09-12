import { useState } from 'react';
import { ClipboardIcon, FilterIcon, CampaignIcon, EditIcon, PlusIcon, WarningIcon } from '../icons';
import { PLANO_ACAO_DATA } from '../mockData';
import { STATUS_LABEL } from './PlanoDeAcaoConstants';
import PlanoDeAcaoEditModal from './PlanoDeAcaoEditModal';
import './PlanoDeAcao.css';

export default function PlanoDeAcao() {
  // UC-20: os planos viram estado local pra dar pra editar de verdade na
  // tela. Ainda não persiste em backend (não existe endpoint de GET nem de
  // PUT pra plano de ação ainda) - quando existir, isso troca por
  // fetch/PUT de verdade, mas a interação já funciona igual.
  const [diretorias, setDiretorias] = useState(PLANO_ACAO_DATA);
  const [editando, setEditando] = useState(null); // índice da diretoria sendo editada, ou null

  const salvarEdicao = (planosAtualizados) => {
    setDiretorias((atual) =>
      atual.map((diretoria, index) => (index === editando ? { ...diretoria, planos: planosAtualizados } : diretoria))
    );
    setEditando(null);
  };

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
        {diretorias.map((diretoria, directorateIndex) => {
          const header = (
            <div className="pa-card__header">
              <span className="pa-card__badge">
                <CampaignIcon />
                {diretoria.directorate}
              </span>
              <div className="pa-card__objetivo-group">
                <span className="pa-card__objetivo">Objetivo {diretoria.objetivo}</span>
                {/* UC-18 (cadastrar novo plano) fica pra outra branch - aqui
                    o botão só existe visualmente, sem função. */}
                <button
                  type="button"
                  className="pa-card__edit"
                  aria-label="Novo plano de ação"
                  title="Cadastro disponível em breve"
                  disabled
                >
                  <PlusIcon />
                </button>
                {/* UC-20: editar o(s) plano(s) de ação desta diretoria. */}
                <button
                  type="button"
                  className="pa-card__edit"
                  aria-label="Editar plano de ação"
                  title="Editar plano de ação"
                  onClick={() => setEditando(directorateIndex)}
                >
                  <EditIcon />
                </button>
              </div>
            </div>
          );

          return (
            <article key={diretoria.directorate} className={`pa-card ${diretoria.capa ? 'pa-card--capa' : ''}`}>
              {diretoria.capa && (
                <div
                  className="pa-card__capa"
                  style={{ backgroundImage: `url(${diretoria.capa})`, '--pa-capa-ratio': diretoria.capaRatio }}
                  aria-hidden="true"
                >
                  {header}
                </div>
              )}

              <div className="pa-card__inner">
                {!diretoria.capa && header}

                <div className="pa-planos">
                  {diretoria.planos.map((plano) => (
                    <div key={plano.id} className="pa-plano">
                      <div className="pa-plano__top">
                        <span className="pa-plano__prazo">Prazo: {plano.prazo}</span>
                        <div className="pa-plano__top-direita">
                          {plano.prioridade && (
                            <span className={`pa-prioridade pa-prioridade--${plano.prioridade}`}>
                              <WarningIcon />
                              {plano.prioridade === 'alta' ? 'Alta' : plano.prioridade === 'media' ? 'Média' : 'Baixa'}
                            </span>
                          )}
                          <span className={`pa-status pa-status--${plano.status}`}>
                            {STATUS_LABEL[plano.status]}
                            <span className="pa-status__dot" />
                          </span>
                        </div>
                      </div>

                      <div className="pa-plano__bloco">
                        <h3 className="pa-plano__atividade">Atividade</h3>
                        {plano.atividade && <p className="pa-plano__atividade-texto">{plano.atividade}</p>}
                        <h4 className="pa-plano__subtarefas-titulo">Subtarefas:</h4>
                        <ul className="pa-subtarefas">
                          {plano.subtarefas.map((tarefa, index) => (
                            <li key={`${tarefa}-${index}`}>
                              <span className="pa-subtarefa__box" aria-hidden="true" />
                              <span>{tarefa}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="pa-plano__responsaveis">
                        Responsáveis:
                        {plano.responsaveis?.length > 0 && ` ${plano.responsaveis.join(', ')}`}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {editando !== null && (
        <PlanoDeAcaoEditModal
          diretoria={diretorias[editando]}
          onSave={salvarEdicao}
          onClose={() => setEditando(null)}
        />
      )}
    </section>
  );
}
