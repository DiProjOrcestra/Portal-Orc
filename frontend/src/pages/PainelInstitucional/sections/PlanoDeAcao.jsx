import { useState } from 'react';
import { ClipboardIcon, FilterIcon, CampaignIcon, EditIcon, PlusIcon, WarningIcon } from '../icons';
import { PLANO_ACAO_DATA } from '../mockData';
import { STATUS_LABEL } from './PlanoDeAcaoConstants'; 
import CadastrarPlanoModal from './CadastrarPlanoModal';
import './PlanoDeAcao.css';

let proximoId = 1000; // só pra gerar ids únicos nos planos cadastrados na sessão

export default function PlanoDeAcao() {
  // UC-18: os planos viram estado local pra dar pra cadastrar de verdade na
  // tela. Ainda não persiste em backend (o endpoint POST /v1/action-plan já
  // existe, mas ainda não está conectado aqui) - quando conectar, isso troca
  // por uma chamada de API de verdade, mas a interação já funciona igual.
  const [diretorias, setDiretorias] = useState(PLANO_ACAO_DATA);
  const [cadastrando, setCadastrando] = useState(null); // índice da diretoria, ou null

  const salvarNovasAtividades = (novasAtividades) => {
    setDiretorias((atual) =>
      atual.map((diretoria, index) => {
        if (index !== cadastrando) return diretoria;
        const novosPlanos = novasAtividades.map((atividade) => {
          proximoId += 1;
          return { id: proximoId, ...atividade };
        });
        return { ...diretoria, planos: [...diretoria.planos, ...novosPlanos] };
      })
    );
    setCadastrando(null);
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
                {/* UC-18: cadastrar uma nova atividade pra esta diretoria. */}
                <button
                  type="button"
                  className="pa-card__edit"
                  aria-label="Cadastrar plano de ação"
                  title="Cadastrar plano de ação"
                  onClick={() => setCadastrando(directorateIndex)}
                >
                  <PlusIcon />
                </button>
                {/* Editar um plano já cadastrado fica pra outra branch - o
                    ícone só existe visualmente aqui, sem função. */}
                <button
                  type="button"
                  className="pa-card__edit"
                  aria-label="Editar plano de ação"
                  title="Edição disponível em breve"
                  disabled
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
                            {STATUS_LABEL[plano.status] ?? 'Status não reconhecido'}
                            <span className="pa-status__dot" />
                          </span>
                        </div>
                      </div>

                      {/* Fiel ao Figma original: "Atividade" e "Subtarefas:"
                          eram só rótulos estáticos sem texto embaixo, porque o
                          mock nunca teve nome cadastrado. Agora que o
                          cadastro existe de verdade, mostra o nome quando
                          tiver um - os planos antigos do mock continuam sem
                          mostrar nada, exatamente como antes. */}
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

      {cadastrando !== null && (
        <CadastrarPlanoModal
          diretoria={diretorias[cadastrando]}
          onSave={salvarNovasAtividades}
          onClose={() => setCadastrando(null)}
        />
      )}
    </section>
  );
}
