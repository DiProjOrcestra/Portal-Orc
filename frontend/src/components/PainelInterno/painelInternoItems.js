// Shared between PainelInterno (desktop sidebar) and Header (mobile menu
// dropdown) so both render the exact same section list without duplicating
// it. Only MVV and Golden Circle are implemented (UC-14); the other two are
// shown per the design but aren't wired to any content yet.
export const PAINEL_INTERNO_ITEMS = [
  { key: 'mvv', label: 'Missão, Visão e Valores', enabled: true },
  { key: 'golden-circle', label: 'Golden Circle', enabled: true },
  { key: 'planejamento', label: 'Planejamento estratégico', enabled: false },
  { key: 'planos-acao', label: 'Planos de ação', enabled: false },
];
