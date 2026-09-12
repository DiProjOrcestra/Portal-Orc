import { apiRequest } from '../../../services/api';

// A entidade guarda o código curto (DirectorateEnum), não o nome de exibição
// usado na tela. Mapeamento inferido pelas 5 diretorias do Figma - mesma
// lista que já usamos pra decidir a foto de capa de cada card.
export const DIRECTORATE_CODES = {
  'Diretoria Executiva': 'DIREX',
  'Diretoria de Comunicações e Marketing': 'DICOM',
  'Diretoria de Negócios': 'DIBIS',
  'Diretoria de Operações': 'TOPS',
  'Diretoria de Projetos': 'DIPROJ',
};

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

// GET /v1/objective - devolve [{ id, description }], confirmado no Swagger.
export function fetchObjetivos() {
  return apiRequest('/v1/objective');
}

// GET /v1/action-plan - devolve todos os planos de ação já cadastrados no
// banco (id, name, term "dd-MM-yyyy", progress, directorate, priority,
// subtasks: [{id, name, done}]).
export function fetchPlanosDeAcao() {
  return apiRequest('/v1/action-plan');
}

// "2026-08-14" (formato do <input type="date">) -> "14-08-2026" (dd-MM-yyyy,
// formato exigido pelo ActionPlanRequestDto do backend).
function paraDataBackend(dataInput) {
  const [ano, mes, dia] = dataInput.split('-');
  return `${dia}-${mes}-${ano}`;
}

/**
 * POST /v1/objective/{objectiveId}/action-plan - confirmado no Swagger.
 * `atividade` é um dos rascunhos preenchidos no CadastrarPlanoModal.
 */
export function criarPlanoDeAcao(objectiveId, directorateLabel, atividade) {
  return apiRequest(`/v1/objective/${objectiveId}/action-plan`, {
    method: 'POST',
    body: {
      name: atividade.nome,
      term: paraDataBackend(atividade.prazo),
      progress: atividade.statusLabel,
      directorate: DIRECTORATE_CODES[directorateLabel],
      priority: atividade.prioridadeLabel,
      subtasks: atividade.subtarefas.map((nome) => ({ name: nome, done: false })),
    },
  });
}