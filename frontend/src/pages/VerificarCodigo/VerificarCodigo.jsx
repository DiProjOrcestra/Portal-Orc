import MfaCodeForm from '../../components/MfaCodeForm/MfaCodeForm';
import './VerificarCodigo.css';

export default function VerificarCodigo({ email, onVerified }) {
  return (
    <div className="page">
      <div className="page__background" aria-hidden="true" />
      <main className="page__main">
        <MfaCodeForm email={email} onVerified={onVerified} />
      </main>
    </div>
  );
}
