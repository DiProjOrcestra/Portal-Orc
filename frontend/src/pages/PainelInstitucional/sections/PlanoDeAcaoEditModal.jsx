import { useState } from 'react';
import { CampaignIcon } from '../icons';
import { STATUS_LABEL } from './PlanoDeAcaoConstants';
import { updateActionPlanStatus } from './PlanoDeAcaoApi';
import './PlanoDeAcaoEditModal.css';

const STATUS_OPTIONS = Object.entries(STATUS_LABEL).map(([value, label]) => ({ value, label }));

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

// UC-20: Editar status do objetivo/plano de ação.
//
// Só o STATUS é salvo de verdade no backend (PATCH /{id}/status) - bate com
// o nome oficial da UC-20. Os outros campos (nome, prazo, subtarefas,
// responsáveis) continuam editáveis na tela, mas não persistem: o único
// outro endpoint de edição completa (PUT /{id}) exige "usersId" e SUBSTITUI
// por completo os membros vinculados pela UC-19 - como o GET de planos de
// ação não devolve quem já está vinculado, não tem como preencher esse
// campo corretamente aqui, e usá-lo apagaria vínculos feitos por outra tela
// sem avisar ninguém. Ligar isso depende de uma mudança no backend (o time
// já foi avisado - ver mensagem sobre a rota PUT /{id} conflitando entre
// UC-19 e UC-20).
export default function PlanoDeAcaoEditModal({ diretoria, onSaved, onClose }) {
  const [planos, setPlanos] = useState(() => diretoria.planos.map((plano) => ({ ...plano })));
  const [erros, setErros] = useState({});
  const [novaSubtarefa, setNovaSubtarefa] = useState({});
  const [novoResponsavel, setNovoResponsavel] = useState({});
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);

  const atualizarPlano = (index, campo, valor) => {
    setPlanos((atual) => atual.map((plano, i) => (i === index ? { ...plano, [campo]: valor } : plano)));
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

  const adicionarResponsavel = (index) => {
    const texto = (novoResponsavel[index] ?? '').trim();
    if (!texto) return;
    setPlanos((atual) =>
      atual.map((plano, i) =>
        i === index ? { ...plano, responsaveis: [...(plano.responsaveis ?? []), texto] } : plano
      )
    );
    setNovoResponsavel((atual) => ({ ...atual, [index]: '' }));
  };

  const removerResponsavel = (index, respIndex) => {
    setPlanos((atual) =>
      atual.map((plano, i) =>
        i === index ? { ...plano, responsaveis: plano.responsaveis.filter((_, ri) => ri !== respIndex) } : plano
      )
    );
  };

  const handleSalvar = async () => {
    // FE-E1 da UC-20: status inválido - como o campo é um <select> com só as
    // opções válidas, na prática não dá pra chegar aqui com um valor fora
    // da lista, mas a checagem fica registrada pra deixar o fluxo explícito.
    const novosErros = {};
    planos.forEach((plano, index) => {
      if (!STATUS_LABEL[plano.status]) {
        novosErros[index] = 'Selecione um status válido.';
      }
    });

    if (Object.keys(novosErros).length > 0) {
      setErros(novosErros);
      return;
    }

    setErroEnvio(null);
    setEnviando(true);
    try {
      // Só o status é enviado ao backend - ver explicação no topo do arquivo.
      await Promise.all(planos.map((plano) => updateActionPlanStatus(plano.id, STATUS_LABEL[plano.status])));
      onSaved();
    } catch (err) {
      setErroEnvio(err.message ?? 'Não foi possível salvar o status.');
    } finally {
      setEnviando(false);
    }
  };

  return (
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

        <p className="pem-aviso">
          Só o <strong>status</strong> é salvo de verdade por enquanto. Os outros campos ainda não persistem -
          detalhes no código.
        </p>

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
                </div>
                <div className="pem-campo">
                  <label htmlFor={`pem-status-${plano.id}`}>Status</label>
                  <select
                    id={`pem-status-${plano.id}`}
                    value={plano.status}
                    onChange={(event) => atualizarPlano(index, 'status', event.target.value)}
                  >
                    {STATUS_OPTIONS.map((opcao) => (
                      <option key={opcao.value} value={opcao.value}>
                        {opcao.label}
                      </option>
                    ))}
                  </select>
                  {erros[index] && <span className="pem-erro">{erros[index]}</span>}
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
                <ul className="pem-lista pem-lista--tags">
                  {(plano.responsaveis ?? []).map((pessoa, respIndex) => (
                    <li key={`${pessoa}-${respIndex}`}>
                      <span>{pessoa}</span>
                      <button
                        type="button"
                        onClick={() => removerResponsavel(index, respIndex)}
                        aria-label={`Remover responsável ${pessoa}`}
                      >
                        ×
                      </button>
                    </li>
                  ))}
                </ul>
                <div className="pem-adicionar-linha">
                  <input
                    type="text"
                    value={novoResponsavel[index] ?? ''}
                    onChange={(event) => setNovoResponsavel((atual) => ({ ...atual, [index]: event.target.value }))}
                    onKeyDown={(event) => event.key === 'Enter' && (event.preventDefault(), adicionarResponsavel(index))}
                    placeholder="Nome do responsável"
                  />
                  <button type="button" onClick={() => adicionarResponsavel(index)}>
                    Adicionar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {erroEnvio && <p className="pem-erro pem-erro--bloco">{erroEnvio}</p>}

        <div className="pem-acoes">
          <button type="button" className="pem-cancelar" onClick={onClose} disabled={enviando}>
            Cancelar alterações
          </button>
          <button type="button" className="pem-salvar" onClick={handleSalvar} disabled={enviando}>
            {enviando ? 'Salvando...' : 'Salvar e sair'}
          </button>
        </div>
      </div>
    </div>
  );
}