import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CampaignIcon, PersonIcon } from '../icons';
import { STATUS_LABEL } from './PlanoDeAcaoConstants';
import { fetchMembros, updateActionPlanFull } from './PlanoDeAcaoApi';
import './PlanoDeAcaoEditModal.css';

const STATUS_OPTIONS = Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }));
const PRIORIDADE_OPTIONS = [
  { value: 'alta', label: 'Alta' },
  { value: 'media', label: 'Média' },
  { value: 'baixa', label: 'Baixa' },
];

function toInputDate(prazoBr) {
  if (!prazoBr) return '';
  const [dia, mes, ano] = prazoBr.split('/');
  if (!dia || !mes || !ano) return '';
  return `${ano}-${mes}-${dia}`;
}

function toBrDate(prazoInput) {
  if (!prazoInput) return '';
  const [ano, mes, dia] = prazoInput.split('-');
  if (!dia || !mes || !ano) return '';
  return `${dia}/${mes}/${ano}`;
}

// UC-20: Editar plano de ação, edição completa via PUT /v1/action-plan/{id}.
//
// Esse endpoint SUBSTITUI por completo os membros vinculados (não é
// aditivo). Como a tela de consulta não sabe quem já está vinculado a cada
// plano (limitação do GET, já reportada ao backend), este modal busca a
// lista real de membros e pede pra marcar de novo quem deve continuar
// vinculado - se alguém for esquecido aqui, ele é desvinculado de verdade.
export default function PlanoDeAcaoEditModal({ diretoria, onSaved, onClose }) {
  const [planos, setPlanos] = useState(() =>
    diretoria.planos.map((plano) => ({
      ...plano,
      usersId: (plano.membrosVinculados ?? plano.users ?? []).map((membro) => membro.cpf),
    }))
  );
  const [membros, setMembros] = useState([]);
  const [carregandoMembros, setCarregandoMembros] = useState(true);
  const [erroMembros, setErroMembros] = useState(null);
  const [erros, setErros] = useState({});
  const [novaSubtarefa, setNovaSubtarefa] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  useEffect(() => {
    fetchMembros()
      .then(setMembros)
      .catch((err) => setErroMembros(err.message ?? 'Não foi possível carregar a lista de membros.'))
      .finally(() => setCarregandoMembros(false));
  }, []);

  const atualizarPlano = (index, campo, valor) => {
    setPlanos((atual) => atual.map((plano, i) => (i === index ? { ...plano, [campo]: valor } : plano)));
  };

  const alternarMembro = (index, cpf) => {
    setPlanos((atual) =>
      atual.map((plano, i) =>
        i === index
          ? {
              ...plano,
              usersId: plano.usersId.includes(cpf)
                ? plano.usersId.filter((id) => id !== cpf)
                : [...plano.usersId, cpf],
            }
          : plano
      )
    );
  };

  const adicionarSubtarefa = (index) => {
    const texto = (novaSubtarefa[index] ?? '').trim();
    if (!texto) return;
    setPlanos((atual) =>
      atual.map((plano, i) => (i === index ? { ...plano, subtarefas: [...plano.subtarefas, texto] } : plano))
    );
    setNovaSubtarefa((atual) => ({ ...atual, [index]: '' }));
  };

  const removerSubtarefa = (index, subIndex) => {
    setPlanos((atual) =>
      atual.map((plano, i) =>
        i === index ? { ...plano, subtarefas: plano.subtarefas.filter((_, si) => si !== subIndex) } : plano
      )
    );
  };

  const handleSalvar = async () => {
    const novosErros = {};
    planos.forEach((plano, index) => {
      const errosPlano = {};
      if (!plano.atividade?.trim()) errosPlano.nome = 'Informe o nome da atividade.';
      if (!plano.prazo) errosPlano.prazo = 'Informe o prazo.';
      if (!STATUS_LABEL[plano.status]) errosPlano.status = 'Selecione um status.';
      if (!plano.prioridade) errosPlano.prioridade = 'Selecione uma prioridade.';
      if (plano.subtarefas.length === 0) errosPlano.subtarefas = 'Adicione ao menos uma subtarefa.';
      if (Object.keys(errosPlano).length > 0) novosErros[index] = errosPlano;
    });

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErroEnvio(null);
    setEnviando(true);
    try {
      await Promise.all(
        planos.map((plano) =>
          updateActionPlanFull(plano.id, {
            nome: plano.atividade.trim(),
            prazo: plano.prazo,
            statusLabel: STATUS_LABEL[plano.status],
            directorateCode: diretoria.code,
            prioridadeLabel: PRIORIDADE_OPTIONS.find((o) => o.value === plano.prioridade)?.label,
            subtarefas: plano.subtarefas,
            usersId: plano.usersId,
          })
        )
      );
      onSaved();
    } catch (err) {
      setErroEnvio(err.message ?? 'Não foi possível salvar as alterações.');
    } finally {
      setEnviando(false);
    }
  };

  return createPortal(
    <div className="pem-backdrop" role="presentation" onClick={onClose}>
      <div
        className="pem-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="pem-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="pem-modal__header">
          <h2 id="pem-titulo">Editar Plano de Ação</h2>
          <span className="pem-modal__contexto">
            <CampaignIcon />
            {diretoria.directorate} · Objetivo {diretoria.objetivo}
          </span>
        </div>

        {erroMembros && <p className="pem-erro pem-erro--bloco">{erroMembros}</p>}

        <div className="pem-planos">
          {planos.map((plano, index) => (
            <div key={plano.id} className="pem-plano">
              <div className="pem-linha">
                <div className="pem-campo">
                  <label htmlFor={`pem-prazo-${plano.id}`}>Prazo</label>
                  <input
                    id={`pem-prazo-${plano.id}`}
                    type="date"
                    value={toInputDate(plano.prazo)}
                    onChange={(event) => atualizarPlano(index, 'prazo', toBrDate(event.target.value))}
                  />
                  {erros[index]?.prazo && <span className="pem-erro">{erros[index].prazo}</span>}
                </div>
                <div className="pem-campo">
                  <label htmlFor={`pem-status-${plano.id}`}>Status</label>
                  <select
                    id={`pem-status-${plano.id}`}
                    value={plano.status}
                    onChange={(event) => atualizarPlano(index, 'status', event.target.value)}
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
                  {erros[index]?.status && <span className="pem-erro">{erros[index].status}</span>}
                </div>
                <div className="pem-campo">
                  <label htmlFor={`pem-prioridade-${plano.id}`}>Prioridade</label>
                  <select
                    id={`pem-prioridade-${plano.id}`}
                    value={plano.prioridade ?? ''}
                    onChange={(event) => atualizarPlano(index, 'prioridade', event.target.value)}
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
                  {erros[index]?.prioridade && <span className="pem-erro">{erros[index].prioridade}</span>}
                </div>
              </div>

              <div className="pem-campo">
                <label htmlFor={`pem-nome-${plano.id}`}>Nome da atividade</label>
                <input
                  id={`pem-nome-${plano.id}`}
                  type="text"
                  value={plano.atividade ?? ''}
                  onChange={(event) => atualizarPlano(index, 'atividade', event.target.value)}
                  placeholder="Ex: Divulgar processo seletivo nas redes sociais"
                />
                {erros[index]?.nome && <span className="pem-erro">{erros[index].nome}</span>}
              </div>

              <div className="pem-campo">
                <span className="pem-campo__titulo">Subtarefas</span>
                <ul className="pem-lista">
                  {plano.subtarefas.map((tarefa, subIndex) => (
                    <li key={`${tarefa}-${subIndex}`}>
                      <span>{tarefa}</span>
                      <button
                        type="button"
                        onClick={() => removerSubtarefa(index, subIndex)}
                        aria-label={`Remover subtarefa ${tarefa}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                {erros[index]?.subtarefas && <span className="pem-erro">{erros[index].subtarefas}</span>}
                <div className="pem-adicionar-linha">
                  <input
                    type="text"
                    value={novaSubtarefa[index] ?? ''}
                    onChange={(event) => setNovaSubtarefa((atual) => ({ ...atual, [index]: event.target.value }))}
                    onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), adicionarSubtarefa(index))}
                    placeholder="Descreva a subtarefa"
                  />
                  <button type="button" onClick={() => adicionarSubtarefa(index)}>
                    Adicionar
                  </button>
                </div>
              </div>

              <div className="pem-campo">
                <span className="pem-campo__titulo">Responsáveis</span>
                <p className="pem-aviso-inline">
                  Marca de novo quem já estava vinculado - editar sem marcar alguém desvincula essa pessoa.
                </p>
                {carregandoMembros && <p className="pem-erro">Carregando membros...</p>}
                {!carregandoMembros && membros.length === 0 && !erroMembros && (
                  <p className="pem-erro">Nenhum membro cadastrado.</p>
                )}
                <ul className="pem-lista pem-lista--membros">
                  {membros.map((membro) => (
                    <li key={membro.cpf}>
                      <label>
                        <input
                          type="checkbox"
                          checked={plano.usersId.includes(membro.cpf)}
                          onChange={() => alternarMembro(index, membro.cpf)}
                        />
                        <PersonIcon />
                        <span>{membro.name}</span>
                      </label>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        {erroEnvio && <p className="pem-erro pem-erro--bloco">{erroEnvio}</p>}

        <div className="pem-acoes">
          <button type="button" className="pem-cancelar" onClick={onClose} disabled={enviando}>
            Cancelar alterações
          </button>
          <button type="button" className="pem-salvar" onClick={handleSalvar} disabled={enviando || carregandoMembros}>
            {enviando ? 'Salvando...' : 'Salvar e sair'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}