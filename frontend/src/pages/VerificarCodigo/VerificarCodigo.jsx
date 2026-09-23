import { useNavigate } from 'react-router-dom';
import MfaCodeForm from '../../components/MfaCodeForm/MfaCodeForm';
import './VerificarCodigo.css';

const REDIRECT_DELAY_MS = 1200;

export default function VerificarCodigo() {
  const navigate = useNavigate();

  const handleVerified = () => {
    setTimeout(() => navigate('/painel'), REDIRECT_DELAY_MS);
  };

  return (
    <div className="page">
      <div className="page__background" aria-hidden="true" />
      <main className="page__main">
        <MfaCodeForm onVerified={handleVerified} />
      </main>
    </div>
  );
}
