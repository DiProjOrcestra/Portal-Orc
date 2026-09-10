import { useState } from 'react';
import { CampaignIcon } from '../icons';
import { STATUS_LABEL } from './planoDeAcaoConstants';
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

// UC-20: Editar status do objetivo/plano de ação. A especificação escrita
// fala só em trocar o status, mas as 5 telas "página de editar" do Figma
// (uma por diretoria) mostram um formulário completo - nome da atividade,
// prazo, subtarefas e responsáveis também editáveis, não só o status. Segui
// o que está no design, já que foi o que a Orc'estra pediu explicitamente.
//
// FE-E2 da UC-20 (usuário não autorizado) não está implementado aqui: não
// existe, ainda, um contexto de usuário/perfil logado disponível no
// frontend pra checar se quem está editando é TOPS/Direx ou um membro
// vinculado ao plano. Por enquanto, qualquer um que acesse a página consegue
// abrir e salvar a edição.
export default function PlanoDeAcaoEditModal({ diretoria, onSave, onClose }) {
  const [planos, setPlanos] = useState(() => diretoria.planos.map((plano) => ({ ...plano })));
  const [erros, setErros] = useState({});
  const [novaSubtarefa, setNovaSubtarefa] = useState({});
  const [novoResponsavel, setNovoResponsavel] = useState({});

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

  const handleSalvar = () => {
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

    onSave(planos);
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

        <div className="pem-acoes">
          <button type="button" className="pem-cancelar" onClick={onClose}>
            Cancelar alterações
          </button>
          <button type="button" className="pem-salvar" onClick={handleSalvar}>
            Salvar e sair
          </button>
        </div>
      </div>
    </div>
  );
}
