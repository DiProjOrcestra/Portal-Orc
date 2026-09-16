import { useCallback, useEffect, useState } from 'react';
import { ClipboardIcon, FilterIcon, CampaignIcon, EditIcon, WarningIcon } from '../icons';
import { STATUS_LABEL } from './PlanoDeAcaoConstants';
import { DIRECTORATE_SECTIONS, fetchPlanosDeAcao } from './PlanoDeAcaoApi';
import PlanoDeAcaoEditModal from './PlanoDeAcaoEditModal';
import './PlanoDeAcao.css';

// Mesmo mapeamento de status usado no backend (ActionPlanRequestDto.progress
// é uma String livre, ainda sem enum) - centralizado aqui pra já ficar fácil
// de trocar por um enum de verdade quando o back definir um.
const STATUS_LABEL = {
  concluido: 'Concluído',
  andamento: 'Em andamento',
  'nao-concluido': 'Não Concluído',
};
const STATUS_SLUG_BY_LABEL = Object.fromEntries(Object.entries(STATUS_LABEL).map(([slug, label]) => [label, slug]));
const PRIORIDADE_SLUG_BY_LABEL = { Alta: 'alta', Média: 'media', Baixa: 'baixa' };

// O backend devolve o prazo como "dd-MM-yyyy" - troca só o separador pro
// "dd/mm/yyyy" já usado nesta tela.
function formatarPrazo(term) {
  return term ? term.replaceAll('-', '/') : term;
}

// UC-20: Editar status do objetivo/plano de ação. Busca os planos reais do
// backend (GET /v1/action-plan), igual à UC-21/UC-18 - as 5 diretorias
// sempre aparecem (com sua foto de capa), mesmo sem nenhum plano cadastrado.
// UC-21: Consultar plano de ação. Busca os planos reais do backend
// (GET /v1/action-plan) e agrupa por diretoria - as 5 diretorias sempre
// aparecem (com sua foto de capa), mesmo sem nenhum plano cadastrado ainda.
export default function PlanoDeAcao() {
  const [secoes, setSecoes] = useState(() => DIRECTORATE_SECTIONS.map((secao) => ({ ...secao, planos: [] })));
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [editando, setEditando] = useState(null); // diretoria sendo editada, ou null

  const buscarPlanos = useCallback(() => {
    return fetchPlanosDeAcao()
      .then((planos) => {
        setSecoes(
          DIRECTORATE_SECTIONS.map((secao) => ({
            ...secao,
            planos: (planos ?? [])
              .filter((plano) => plano.directorate === secao.code)
              .map((plano) => ({
                id: plano.id,
                prazo: formatarPrazo(plano.term),
                status: STATUS_SLUG_BY_LABEL[plano.progress] ?? 'desconhecido',
                prioridade: PRIORIDADE_SLUG_BY_LABEL[plano.priority],
                atividade: plano.name,
                subtarefas: plano.subtasks.map((subtarefa) => subtarefa.name),
              })),
          }))
        );
        setErro(null);
      })
      .catch((err) => setErro(err.message ?? 'Não foi possível carregar os planos de ação.'))
      .finally(() => setCarregando(false));
  }, []);

  useEffect(() => {
    buscarPlanos();
  }, [buscarPlanos]);

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

      {carregando && <p className="pa-estado">Carregando planos de ação...</p>}
      {erro && <p className="pa-estado pa-estado--erro">{erro}</p>}

      <div className="pa-diretorias">
        {secoes.map((diretoria) => {
          const header = (
            <div className="pa-card__header">
              <span className="pa-card__badge">
                <CampaignIcon />
                {diretoria.directorate}
              </span>
              <div className="pa-card__objetivo-group">
                <span className="pa-card__objetivo">Objetivo {diretoria.objetivo}</span>
                {/* UC-20: editar o status do(s) plano(s) desta diretoria. */}
                <button
                  type="button"
                  className="pa-card__edit"
                  aria-label="Editar plano de ação"
                  title="Editar plano de ação"
                  disabled={diretoria.planos.length === 0}
                  onClick={() => setEditando(diretoria)}
                  >
                 <EditIcon />
                </button>
                {/* Cadastrar (UC-18) e editar (UC-20) ficam em outras branches
                    - aqui é só consulta, o ícone existe visualmente mas não
                    faz nada. */}
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
          );

          return (
            <article key={diretoria.code} className={`pa-card ${diretoria.capa ? 'pa-card--capa' : ''}`}>
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
                  {!carregando && diretoria.planos.length === 0 && (
                    <p className="pa-planos-vazio">Nenhum plano de ação cadastrado ainda.</p>
                  )}
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

                      <div className="pa-plano__responsaveis">Responsáveis:</div>
                    </div>
                  ))}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      {editando && (
        <PlanoDeAcaoEditModal
          diretoria={editando}
          onSaved={() => {
            setEditando(null);
            buscarPlanos();
          }}
          onClose={() => setEditando(null)}
        />
      )}
    </section>
  );
}
