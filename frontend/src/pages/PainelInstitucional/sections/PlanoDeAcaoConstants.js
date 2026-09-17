// Mesmo mapeamento de status usado no backend (ActionPlanRequestDto.progress
// é uma String livre, ainda sem enum) - centralizado aqui pra já ficar fácil
// de trocar por um enum de verdade quando o back definir um.
export const STATUS_LABEL = {
  concluido: 'Concluído',
  andamento: 'Em andamento',
  'nao-concluido': 'Não Concluído',
};