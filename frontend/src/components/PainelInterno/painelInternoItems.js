// Shared between PainelInterno (desktop sidebar) and Header (mobile menu
// dropdown) so both render the exact same section list without duplicating
// it. MVV, Golden Circle (UC-14) and Planejamento Estratégico (UC-16) are
// implemented; Planos de ação is shown per the design but isn't wired to any
// content yet.
export const PAINEL_INTERNO_ITEMS = [
  { key: 'mvv', label: 'Missão, Visão e Valores', enabled: true },
  { key: 'golden-circle', label: 'Golden Circle', enabled: true },
  { key: 'planejamento', label: 'Planejamento estratégico', enabled: true },
  { key: 'planos-acao', label: 'Planos de ação', enabled: false },
];
