// UC-14/UC-16 have no backend endpoint yet (confirmed with the team) — this page renders
// static placeholder content standing in for the "conteúdo vigente" each use case
// describes, until a real institutional-content API exists.

export const MVV_DATA = {
  quote: '"Neque porro quisquam est qui dolorem ipsum quia dolor sit amet, consectetur, adipisci velit..."',
  missao:
    'É um facto estabelecido de que um leitor é distraído pelo conteúdo legível de uma página quando analisa a sua mancha gráfica.',
  visao:
    'É um facto estabelecido de que um leitor é distraído pelo conteúdo legível de uma página quando analisa a sua mancha gráfica.',
  valores: {
    text: 'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.',
    tags: ['Sintonia', 'Crescimento', 'Família', 'Sangue Orc'],
  },
};

export const GOLDEN_CIRCLE_DATA = [
  { number: 1, label: 'Por Quê? (Why - Propósito)', text: 'It has survived not only many decades.' },
  { number: 2, label: 'Como? (How - Processo)', text: 'It has survived not only many decades.' },
  { number: 3, label: 'O Quê? (What - Produto)', text: 'It has survived not only many decades.' },
];

const KR_TEXT =
  'It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout.';

export const PLANEJAMENTO_DATA = [
  {
    numero: 1,
    progresso: 50,
    prazo: 7,
    descricao: KR_TEXT,
    resultadosChave: [
      { label: 'KR 1', texto: KR_TEXT },
      { label: 'KR 2', texto: KR_TEXT },
      { label: 'KR 3', texto: KR_TEXT },
      { label: 'KR 4', texto: KR_TEXT },
    ],
  },
  {
    numero: 2,
    progresso: 35,
    prazo: 15,
    descricao: KR_TEXT,
    resultadosChave: [
      { label: 'KR 1', texto: KR_TEXT },
      { label: 'KR 3', texto: KR_TEXT },
    ],
  },
  {
    numero: 3,
    progresso: 20,
    prazo: 28,
    descricao: KR_TEXT,
    resultadosChave: [{ label: 'KR 3', texto: KR_TEXT }],
  },
];

// The grid itself (days in month, weekday alignment) is computed from the
// real calendar in the component, since it now navigates between months -
// this only holds what isn't derivable from a plain JS Date.
export const CICLO_TATICO_DATA = {
  ciclo: '2026.2',
  diasSemana: ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'],
};

const SUBTAREFAS_MOCK = [
  'Vivamus non est nec leo congue placerat non nec nunc.',
  'Etiam tristique purus hendrerit metus rutrum convallis.',
  'Ut dignissim sem vitae semper tincidunt.',
];

// UC-18 só tem o endpoint de cadastro (POST /v1/action-plans) até agora, sem
// GET - mesma situação do UC-14/UC-16 acima, então esta seção também segue
// renderizando conteúdo estático até existir uma API de consulta.
//
// "capa" aponta pra frontend/public/planos-de-acao/<arquivo> - essas 4 fotos
// (Comunicações, Negócios, Operações, Projetos) existem só no Figma
// (IMG_9186, IMG_9195, IMG_9202, IMG_9211) e precisam ser exportadas de lá e
// coladas manualmente nessa pasta com esses nomes de arquivo. "Diretoria
// Executiva" não tem capa no design, por isso capa: null.
export const PLANO_ACAO_DATA = [
  {
    directorate: 'Diretoria Executiva',
    objetivo: 1,
    capa: null,
    planos: [
      { id: 1, prazo: '14/08/2026', status: 'concluido', subtarefas: SUBTAREFAS_MOCK },
      { id: 2, prazo: '14/08/2026', status: 'andamento', subtarefas: SUBTAREFAS_MOCK },
    ],
  },
  {
    directorate: 'Diretoria de Comunicações e Marketing',
    objetivo: 1,
    capa: '/planos-de-acao/comunicacoes.png',
    planos: [
      { id: 3, prazo: '14/08/2026', status: 'concluido', subtarefas: SUBTAREFAS_MOCK },
      { id: 4, prazo: '14/08/2026', status: 'andamento', subtarefas: SUBTAREFAS_MOCK },
    ],
  },
  {
    directorate: 'Diretoria de Negócios',
    objetivo: 1,
    capa: '/planos-de-acao/negocios.png',
    planos: [
      { id: 5, prazo: '14/08/2026', status: 'nao-concluido', subtarefas: SUBTAREFAS_MOCK },
      { id: 6, prazo: '14/08/2026', status: 'andamento', subtarefas: SUBTAREFAS_MOCK },
    ],
  },
  {
    directorate: 'Diretoria de Operações',
    objetivo: 1,
    capa: '/planos-de-acao/operacoes.png',
    planos: [
      { id: 7, prazo: '14/08/2026', status: 'andamento', subtarefas: SUBTAREFAS_MOCK },
      { id: 8, prazo: '14/08/2026', status: 'concluido', subtarefas: SUBTAREFAS_MOCK },
    ],
  },
  {
    directorate: 'Diretoria de Projetos',
    objetivo: 1,
    capa: '/planos-de-acao/projetos.png',
    planos: [
      { id: 9, prazo: '14/08/2026', status: 'concluido', subtarefas: SUBTAREFAS_MOCK },
      { id: 10, prazo: '14/08/2026', status: 'andamento', subtarefas: SUBTAREFAS_MOCK },
    ],
  },
];