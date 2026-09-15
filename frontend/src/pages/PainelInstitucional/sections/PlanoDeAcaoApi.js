import { apiRequest } from '../../../services/api';

// As 5 diretorias são fixas (DirectorateEnum) - essa lista descreve a seção
// de cada uma na tela (rótulo de exibição, número do objetivo mostrado no
// badge e foto de capa) independentemente de quantos planos reais ela já
// tenha. GET /v1/action-plan devolve só o código (ex: "DICOM"), então essa é
// a "casca" onde os planos buscados são agrupados.
export const DIRECTORATE_SECTIONS = [
  { code: 'DIREX', directorate: 'Diretoria Executiva', objetivo: 1, capa: null },
  {
    code: 'DICOM',
    directorate: 'Diretoria de Comunicações e Marketing',
    objetivo: 1,
    capa: '/planos-de-acao/comunicacoes.png',
    capaRatio: '782 / 430',
  },
  {
    code: 'DIBIS',
    directorate: 'Diretoria de Negócios',
    objetivo: 1,
    capa: '/planos-de-acao/negocios.png',
    capaRatio: '784 / 337',
  },
  {
    code: 'TOPS',
    directorate: 'Diretoria de Operações',
    objetivo: 1,
    capa: '/planos-de-acao/operacoes.png',
    capaRatio: '782 / 380',
  },
  {
    code: 'DIPROJ',
    directorate: 'Diretoria de Projetos',
    objetivo: 1,
    capa: '/planos-de-acao/projetos.png',
    capaRatio: '784 / 413',
  },
];

// GET /v1/action-plan - devolve todos os planos de ação já cadastrados no
// banco (id, name, term "dd-MM-yyyy", progress, directorate, priority,
// subtasks: [{id, name, done}]).
export function fetchPlanosDeAcao() {
  return apiRequest('/v1/action-plan');
}

// PATCH /v1/action-plan/{id}/status - único endpoint de edição usado aqui de
// propósito. O PUT /v1/action-plan/{id} (edição completa) também existe,
// mas ele exige "usersId" e SUBSTITUI por completo os membros vinculados
// (ActionPlanService.updateActionPlan faz actionPlan.setUsers(users) com o
// que vier nesse campo) - como o GET de planos de ação não devolve quem já
// está vinculado, não tem como preencher esse campo direito daqui, e mandar
// vazio apagaria silenciosamente o que a UC-19 vinculou. Por isso só o
// status (que tem endpoint próprio, sem esse risco) é salvo de verdade por
// enquanto - bate com o próprio nome da UC-20: "Editar STATUS do
// objetivo/plano de ação".
export function updateActionPlanStatus(actionPlanId, progressLabel) {
  return apiRequest(`/v1/action-plan/${actionPlanId}/status`, {
    method: 'PATCH',
    body: { progress: progressLabel },
  });
}