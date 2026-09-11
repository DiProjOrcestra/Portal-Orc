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

// GET /v1/objective - devolve [{ id, description }], confirmado no Swagger.
export function fetchObjetivos() {
  return apiRequest('/v1/objective');
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