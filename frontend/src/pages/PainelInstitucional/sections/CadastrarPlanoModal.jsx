import { useState } from 'react';
import { createPortal } from 'react-dom';
import { CampaignIcon, ChecklistIcon, CloseIcon, PersonIcon } from '../icons';
import { STATUS_LABEL } from './PlanoDeAcaoConstants';
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

// UC-18: Cadastrar plano de ação. Segue o fluxo da especificação: objetivo
// fica pré-selecionado (só existe "Objetivo 1" cadastrado hoje, por isso o
// seletor mostra um único valor em vez de uma lista real pra escolher -
// quando existirem outros objetivos, esse <select> já suporta mais opções
// sem mudar de estrutura), diretoria vem fixa de qual card o usuário clicou
// no "+", e o formulário pede nome/prazo/status/prioridade/subtarefas/
// responsáveis de cada atividade. "+ Adicionar atividade" permite cadastrar
// mais de uma ação pro mesmo objetivo numa única operação de salvar, igual
// ao Figma.
export default function CadastrarPlanoModal({ diretoria, onSave, onClose }) {
  const [atividades, setAtividades] = useState([novaAtividadeVazia(0)]);
  const [erros, setErros] = useState({});
  let proximoRascunhoId = atividades.length;

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

  const handleSalvar = () => {
    // FE-E1 da UC-18: dados obrigatórios não informados - interrompe o
    // cadastro e avisa quais campos faltam, sem fechar o formulário.
    const novosErros = {};
    atividades.forEach((atividade, index) => {
      const errosAtividade = {};
      if (!atividade.nome.trim()) errosAtividade.nome = 'Informe o nome da atividade.';
      if (!atividade.prazo) errosAtividade.prazo = 'Informe o prazo.';
      if (!atividade.status) errosAtividade.status = 'Selecione um status.';
      if (!atividade.prioridade) errosAtividade.prioridade = 'Selecione uma prioridade.';
      if (Object.keys(errosAtividade).length > 0) novosErros[index] = errosAtividade;
    });

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    onSave(
      atividades.map((atividade) => ({
        atividade: atividade.nome.trim(),
        prazo: atividade.prazo,
        status: atividade.status,
        prioridade: atividade.prioridade,
        subtarefas: atividade.subtarefas,
        responsaveis: atividade.responsaveis,
      }))
    );
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

        {atividades.map((atividade, index) => (
          <div key={atividade.rascunhoId} className="cpm-atividade">
            <div className="cpm-atividade__topo">
              <span className="cpm-card__badge">
                <CampaignIcon />
                {diretoria.directorate}
              </span>

              {/* Só existe "Objetivo 1" cadastrado hoje - o seletor já vem
                  com esse valor único selecionado. */}
              <select
                className="cpm-objetivo-select"
                value={diretoria.objetivo}
                onChange={() => {}}
                aria-label="Objetivo estratégico"
              >
                <option value={diretoria.objetivo}>Objetivo {diretoria.objetivo}</option>
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

        <button type="button" className="cpm-adicionar-atividade" onClick={adicionarAtividade}>
          <CampaignIcon />
          Adicionar atividade
        </button>

        <div className="cpm-acoes">
          <button type="button" className="cpm-cancelar" onClick={onClose}>
            Cancelar alterações
          </button>
          <button type="button" className="cpm-salvar" onClick={handleSalvar}>
            Salvar e sair
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
