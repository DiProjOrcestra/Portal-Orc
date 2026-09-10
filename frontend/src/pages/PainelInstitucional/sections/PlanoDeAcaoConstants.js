// Mesmo mapeamento de status usado no backend (ActionPlanRequestDto.progress
// é uma String livre, ainda sem enum) - centralizado aqui pra já ficar fácil
// de trocar por um enum de verdade quando o back definir um.
//
// Nota: a especificação escrita da UC-20 fala em 4 status possíveis (não
// iniciado, em andamento, concluído, atrasado), mas o Figma (e a página de
// consulta já mesclada) só usa 3 (Concluído, Em andamento, Não Concluído).
// Mantive os 3 já existentes pra não quebrar a consistência com o que já
// está em produção - vale alinhar com o time se a spec deveria ganhar mais
// estados no futuro.
export const STATUS_LABEL = {
  concluido: 'Concluído',
  andamento: 'Em andamento',
  'nao-concluido': 'Não Concluído',
};