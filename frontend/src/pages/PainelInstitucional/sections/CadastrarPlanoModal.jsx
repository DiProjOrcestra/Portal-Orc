import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CampaignIcon, ChecklistIcon, CloseIcon, PersonIcon } from '../icons';
import { STATUS_LABEL } from './PlanoDeAcaoConstants';
import { fetchObjetivos, criarPlanoDeAcao } from './PlanoDeAcaoApi';
import './CadastrarPlanoModal.css';

const STATUS_OPTIONS = Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }));
const PRIORIDADE_OPTIONS = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

function novaAtividadeVazia(id) {
  return {
    rascunhoId: id,
    objetivoId: '',
    nome: '',
    prazo: '',
    status: '',
    prioridade: '',
    subtarefas: [],
    novaSubtarefa: '',
    responsaveis: [],
    novoResponsavel: '',
  };
}

// UC-18: Cadastrar plano de ação, agora conectado de verdade ao backend:
// - GET /v1/objective busca os objetivos estratégicos reais pra popular o
//   seletor (antes era um valor fixo "Objetivo 1", porque um objetivo de
//   verdade é uma descrição cadastrada à parte, não um número).
// - POST /v1/objective/{objectiveId}/action-plan cadastra cada atividade.
//   O endpoint cadastra uma atividade por vez, então "Salvar e sair" manda
//   uma requisição por atividade adicionada, em sequência.
export default function CadastrarPlanoModal({ diretoria, onSave, onClose }) {
  const [atividades, setAtividades] = useState([novaAtividadeVazia(0)]);
  const [erros, setErros] = useState({});
  const [objetivos, setObjetivos] = useState([]);
  const [carregandoObjetivos, setCarregandoObjetivos] = useState(true);
  const [erroObjetivos, setErroObjetivos] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);
  let proximoRascunhoId = atividades.length;

  useEffect(() => {
    fetchObjetivos()
      .then(setObjetivos)
      .catch((err) => setErroObjetivos(err.message ?? 'Não foi possível carregar os objetivos estratégicos.'))
      .finally(() => setCarregandoObjetivos(false));
  }, []);

  const atualizarAtividade = (index, campo, valor) => {
    setAtividades((atual) => atual.map((a, i) => (i === index ? { ...a, [campo]: valor } : a)));
  };

  const adicionarAtividade = () => {
    setAtividades((atual) => [...atual, novaAtividadeVazia(proximoRascunhoId)]);
  };

  const removerAtividade = (index) => {
    setAtividades((atual) => atual.filter((_, i) => i !== index));
  };

  const adicionarSubtarefa = (index) => {
    const texto = atividades[index].novaSubtarefa.trim();
    if (!texto) return;
    setAtividades((atual) =>
      atual.map((a, i) => (i === index ? { ...a, subtarefas: [...a.subtarefas, texto], novaSubtarefa: '' } : a))
    );
  };

  const removerSubtarefa = (index, subIndex) => {
    setAtividades((atual) =>
      atual.map((a, i) => (i === index ? { ...a, subtarefas: a.subtarefas.filter((_, si) => si !== subIndex) } : a))
    );
  };

  const adicionarResponsavel = (index) => {
    const texto = atividades[index].novoResponsavel.trim();
    if (!texto) return;
    setAtividades((atual) =>
      atual.map((a, i) =>
        i === index ? { ...a, responsaveis: [...a.responsaveis, texto], novoResponsavel: '' } : a
      )
    );
  };

  const removerResponsavel = (index, respIndex) => {
    setAtividades((atual) =>
      atual.map((a, i) => (i === index ? { ...a, responsaveis: a.responsaveis.filter((_, ri) => ri !== respIndex) } : a))
    );
  };

  const handleSalvar = async () => {
    // FE-E1 da UC-18: dados obrigatórios não informados.
    const novosErros = {};
    atividades.forEach((atividade, index) => {
      const errosAtividade = {};
      if (!atividade.objetivoId) errosAtividade.objetivoId = 'Selecione o objetivo estratégico.';
      if (!atividade.nome.trim()) errosAtividade.nome = 'Informe o nome da atividade.';
      if (!atividade.prazo) errosAtividade.prazo = 'Informe o prazo.';
      if (!atividade.status) errosAtividade.status = 'Selecione um status.';
      if (!atividade.prioridade) errosAtividade.prioridade = 'Selecione uma prioridade.';
      if (atividade.subtarefas.length === 0) errosAtividade.subtarefas = 'Adicione ao menos uma subtarefa.';
      if (Object.keys(errosAtividade).length > 0) novosErros[index] = errosAtividade;
    });

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErroEnvio(null);
    setEnviando(true);

    const atividadesCadastradas = [];
    try {
      // O endpoint cadastra uma atividade por vez - manda em sequência (não
      // Promise.all) pra, se uma falhar, saber exatamente qual foi e não
      // perder o rastro das que já tinham sido salvas antes dela.
      for (const atividade of atividades) {
        await criarPlanoDeAcao(atividade.objetivoId, diretoria.directorate, {
          nome: atividade.nome.trim(),
          prazo: atividade.prazo,
          statusLabel: STATUS_LABEL[atividade.status],
          prioridadeLabel: PRIORIDADE_OPTIONS.find((o) => o.value === atividade.prioridade)?.label,
          subtarefas: atividade.subtarefas,
        });
        atividadesCadastradas.push({
          atividade: atividade.nome.trim(),
          prazo: atividade.prazo,
          status: atividade.status,
          prioridade: atividade.prioridade,
          subtarefas: atividade.subtarefas,
          responsaveis: atividade.responsaveis,
        });
      }
      onSave(atividadesCadastradas);
    } catch (err) {
      setErroEnvio(
        `${err.message ?? 'Não foi possível cadastrar o plano de ação.'} ${
          atividadesCadastradas.length > 0
            ? `(${atividadesCadastradas.length} de ${atividades.length} atividades já foram cadastradas antes desse erro.)`
            : ''
        }`
      );
      // Mantém na tela só as atividades que ainda não foram cadastradas com
      // sucesso, pra não mandar a mesma atividade duas vezes se tentar de novo.
      if (atividadesCadastradas.length > 0) {
        onSave(atividadesCadastradas);
        setAtividades((atual) => atual.slice(atividadesCadastradas.length));
      }
    } finally {
      setEnviando(false);
    }
  };

  return createPortal(
    <div className="cpm-backdrop" role="presentation" onClick={onClose}>
      <div
        className="cpm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="cpm-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="cpm-fechar" aria-label="Fechar" onClick={onClose}>
          <CloseIcon />
        </button>
        <h2 id="cpm-titulo" className="cpm-titulo">
          Cadastrar Plano de Ação
        </h2>

        {erroObjetivos && <p className="cpm-erro cpm-erro--bloco">{erroObjetivos}</p>}

        {atividades.map((atividade, index) => (
          <div key={atividade.rascunhoId} className="cpm-atividade">
            <div className="cpm-atividade__topo">
              <span className="cpm-card__badge">
                <CampaignIcon />
                {diretoria.directorate}
              </span>

              <select
                className="cpm-objetivo-select"
                value={atividade.objetivoId}
                onChange={(event) => atualizarAtividade(index, 'objetivoId', event.target.value)}
                aria-label="Objetivo estratégico"
                disabled={carregandoObjetivos}
              >
                <option value="" disabled>
                  {carregandoObjetivos ? 'Carregando...' : 'Selecionar objetivo'}
                </option>
                {objetivos.map((objetivo) => (
                  <option key={objetivo.id} value={objetivo.id}>
                    {objetivo.description}
                  </option>
                ))}
              </select>

              {atividades.length > 1 && (
                <button
                  type="button"
                  className="cpm-remover-atividade"
                  onClick={() => removerAtividade(index)}
                  aria-label="Remover esta atividade"
                >
                  <CloseIcon />
                </button>
              )}
            </div>
            {erros[index]?.objetivoId && <span className="cpm-erro">{erros[index].objetivoId}</span>}

            <div className="cpm-linha-topo">
              <div className="cpm-campo cpm-campo--inline">
                <label htmlFor={`cpm-prazo-${atividade.rascunhoId}`}>Prazo:</label>
                <input
                  id={`cpm-prazo-${atividade.rascunhoId}`}
                  type="date"
                  value={atividade.prazo}
                  onChange={(event) => atualizarAtividade(index, 'prazo', event.target.value)}
                />
              </div>

              <select
                className="cpm-dropdown cpm-dropdown--status"
                value={atividade.status}
                onChange={(event) => atualizarAtividade(index, 'status', event.target.value)}
                aria-label="Status"
              >
                <option value="" disabled>
                  Selecionar status
                </option>
                {STATUS_OPTIONS.map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>

              <select
                className="cpm-dropdown cpm-dropdown--prioridade"
                value={atividade.prioridade}
                onChange={(event) => atualizarAtividade(index, 'prioridade', event.target.value)}
                aria-label="Prioridade"
              >
                <option value="" disabled>
                  Prioridade
                </option>
                {PRIORIDADE_OPTIONS.map((opcao) => (
                  <option key={opcao.value} value={opcao.value}>
                    {opcao.label}
                  </option>
                ))}
              </select>
            </div>
            {(erros[index]?.prazo || erros[index]?.status || erros[index]?.prioridade) && (
              <div className="cpm-erros-linha">
                {erros[index]?.prazo && <span className="cpm-erro">{erros[index].prazo}</span>}
                {erros[index]?.status && <span className="cpm-erro">{erros[index].status}</span>}
                {erros[index]?.prioridade && <span className="cpm-erro">{erros[index].prioridade}</span>}
              </div>
            )}

            <div className="cpm-bloco">
              <label htmlFor={`cpm-nome-${atividade.rascunhoId}`} className="cpm-bloco__titulo">
                Nome:
              </label>
              <input
                id={`cpm-nome-${atividade.rascunhoId}`}
                type="text"
                className="cpm-nome-input"
                value={atividade.nome}
                onChange={(event) => atualizarAtividade(index, 'nome', event.target.value)}
                placeholder="Ex: Divulgar processo seletivo nas redes sociais"
              />
              {erros[index]?.nome && <span className="cpm-erro">{erros[index].nome}</span>}

              <span className="cpm-bloco__titulo cpm-bloco__titulo--sub">Subtarefas:</span>
              <ul className="cpm-lista">
                {atividade.subtarefas.map((tarefa, subIndex) => (
                  <li key={`${tarefa}-${subIndex}`}>
                    <span>{tarefa}</span>
                    <button type="button" onClick={() => removerSubtarefa(index, subIndex)} aria-label={`Remover ${tarefa}`}>
                      ×
                    </button>
                  </li>
                ))}
              </ul>
              {erros[index]?.subtarefas && <span className="cpm-erro">{erros[index].subtarefas}</span>}
              <div className="cpm-adicionar-linha">
                <input
                  type="text"
                  value={atividade.novaSubtarefa}
                  onChange={(event) => atualizarAtividade(index, 'novaSubtarefa', event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), adicionarSubtarefa(index))}
                  placeholder="Descreva a subtarefa"
                />
                <button type="button" className="cpm-pill-btn" onClick={() => adicionarSubtarefa(index)}>
                  <ChecklistIcon />
                  Adicionar subtarefa
                </button>
              </div>
            </div>

            <div className="cpm-bloco cpm-bloco--responsaveis">
              <div className="cpm-responsaveis-topo">
                <span className="cpm-bloco__titulo">Responsáveis:</span>
                <ul className="cpm-lista cpm-lista--tags">
                  {atividade.responsaveis.map((pessoa, respIndex) => (
                    <li key={`${pessoa}-${respIndex}`}>
                      <span>{pessoa}</span>
                      <button
                        type="button"
                        onClick={() => removerResponsavel(index, respIndex)}
                        aria-label={`Remover ${pessoa}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="cpm-adicionar-linha">
                <input
                  type="text"
                  value={atividade.novoResponsavel}
                  onChange={(event) => atualizarAtividade(index, 'novoResponsavel', event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), adicionarResponsavel(index))}
                  placeholder="Nome do responsável"
                />
                <button type="button" className="cpm-pill-btn" onClick={() => adicionarResponsavel(index)}>
                  <PersonIcon />
                  Adicionar responsável
                </button>
              </div>
            </div>
          </div>
        ))}

        <button type="button" className="cpm-adicionar-atividade" onClick={adicionarAtividade} disabled={enviando}>
          <CampaignIcon />
          Adicionar atividade
        </button>

        {erroEnvio && <p className="cpm-erro cpm-erro--bloco">{erroEnvio}</p>}

        <div className="cpm-acoes">
          <button type="button" className="cpm-cancelar" onClick={onClose} disabled={enviando}>
            Cancelar alterações
          </button>
          <button type="button" className="cpm-salvar" onClick={handleSalvar} disabled={enviando}>
            {enviando ? 'Salvando...' : 'Salvar e sair'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
