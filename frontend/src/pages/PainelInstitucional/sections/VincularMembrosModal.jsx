import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { CampaignIcon, CloseIcon, PersonIcon } from '../icons';
import { fetchMembros, vincularMembros } from './PlanoDeAcaoMembrosApi';
import './VincularMembrosModal.css';

export default function VincularMembrosModal({ plano, diretoria, onSaved, onClose }) {
  const [membros, setMembros] = useState([]);
  const [selecionados, setSelecionados] = useState(() =>
    (plano.membrosVinculados ?? []).map((membro) => membro.cpf)
  );
  const [carregando, setCarregando] = useState(true);
  const [erroCarregar, setErroCarregar] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnviar, setErroEnviar] = useState(null);

  useEffect(() => {
    fetchMembros()
      .then(setMembros)
      .catch((err) => setErroCarregar(err.message ?? 'Não foi possível carregar a lista de membros.'))
      .finally(() => setCarregando(false));
  }, []);

  const alternarSelecao = (cpf) => {
    setSelecionados((atual) => (atual.includes(cpf) ? atual.filter((c) => c !== cpf) : [...atual, cpf]));
  };

  const membrosVinculados = plano.membrosVinculados ?? [];
  const cpfsVinculados = new Set(membrosVinculados.map((membro) => membro.cpf));
  const membrosDisponiveis = membros.filter((membro) => !cpfsVinculados.has(membro.cpf));

  // Quem já estava vinculado mas foi desmarcado agora - salvar vai
  // desvincular essas pessoas de verdade (o PUT substitui a lista inteira).
  const seraoDesvinculados = membrosVinculados.filter((membro) => !selecionados.includes(membro.cpf));

  const handleVincular = async () => {
    setErroEnviar(null);
    setEnviando(true);
    try {
      await vincularMembros(plano.id, selecionados);
      onSaved();
    } catch (err) {
      setErroEnviar(err.message ?? 'Não foi possível vincular os membros selecionados.');
    } finally {
      setEnviando(false);
    }
  };

  return createPortal(
    <div className="vmm-backdrop" role="presentation" onClick={onClose}>
      <div
        className="vmm-modal"
        role="dialog"
        aria-modal="true"
        aria-labelledby="vmm-titulo"
        onClick={(event) => event.stopPropagation()}
      >
        <button type="button" className="vmm-fechar" aria-label="Fechar" onClick={onClose}>
          <CloseIcon />
        </button>
        <h2 id="vmm-titulo" className="vmm-titulo">
          Vincular Membros
        </h2>
        <span className="vmm-contexto">
          <CampaignIcon />
          {diretoria.directorate}
          {plano.atividade ? ` · ${plano.atividade}` : ''}
        </span>

        {carregando && <p className="vmm-estado">Carregando membros...</p>}
        {erroCarregar && <p className="vmm-estado vmm-estado--erro">{erroCarregar}</p>}

        {!carregando && !erroCarregar && (
          <>
            <h3 className="vmm-secao-titulo">Membros vinculados</h3>
            {membrosVinculados.length === 0 ? (
              <p className="vmm-estado">Nenhum membro vinculado.</p>
            ) : (
              <ul className="vmm-lista">
                {membrosVinculados.map((membro) => (
                  <li key={membro.cpf}>
                    <label className="vmm-item vmm-item--vinculado">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(membro.cpf)}
                        onChange={() => alternarSelecao(membro.cpf)}
                      />
                      <PersonIcon />
                      <span>{membro.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}

            <h3 className="vmm-secao-titulo">Membros disponíveis</h3>
            {membrosDisponiveis.length === 0 ? (
              <p className="vmm-estado vmm-estado--erro">
                {membros.length === 0
                  ? 'Não existe nenhum membro cadastrado no momento.'
                  : 'Todos os membros já estão vinculados.'}
              </p>
            ) : (
              <ul className="vmm-lista">
                {membrosDisponiveis.map((membro) => (
                  <li key={membro.cpf}>
                    <label className="vmm-item">
                      <input
                        type="checkbox"
                        checked={selecionados.includes(membro.cpf)}
                        onChange={() => alternarSelecao(membro.cpf)}
                      />
                      <PersonIcon />
                      <span>{membro.name}</span>
                    </label>
                  </li>
                ))}
              </ul>
            )}
          </>
        )}

        {seraoDesvinculados.length > 0 && (
          <p className="vmm-estado vmm-aviso-desvincular">
            Ao salvar, {seraoDesvinculados.map((membro) => membro.name).join(', ')}{' '}
            {seraoDesvinculados.length === 1 ? 'será desvinculado' : 'serão desvinculados'} deste plano.
          </p>
        )}

        {erroEnviar && <p className="vmm-estado vmm-estado--erro">{erroEnviar}</p>}

        <div className="vmm-acoes">
          <button type="button" className="vmm-cancelar" onClick={onClose} disabled={enviando}>
            Cancelar
          </button>
          <button
            type="button"
            className="vmm-salvar"
            onClick={handleVincular}
            disabled={enviando || carregando || (membros.length === 0 && membrosVinculados.length === 0)}
          >
            {enviando ? 'Vinculando...' : 'Vincular selecionados'}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}