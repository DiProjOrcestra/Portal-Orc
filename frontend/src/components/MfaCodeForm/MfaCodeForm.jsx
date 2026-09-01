import { useEffect, useRef, useState } from 'react';
import OtpInput from '../ui/OtpInput';
import { validateMfaCode, resendMfaCode } from '../../services/authService';
import { ApiError } from '../../services/api';
import './MfaCodeForm.css';

const RESEND_COOLDOWN_SECONDS = 30;
const GENERIC_ERROR = 'Ocorreu um erro inesperado. Tente novamente.';

export default function MfaCodeForm({ email: emailProp, onVerified }) {
  const email =
    emailProp || (typeof window !== 'undefined' ? sessionStorage.getItem('mfaEmail') : '') || '';

  const [code, setCode] = useState('');
  const [resetKey, setResetKey] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [verified, setVerified] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const cooldownTimer = useRef(null);

  useEffect(() => () => clearInterval(cooldownTimer.current), []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN_SECONDS);
    clearInterval(cooldownTimer.current);
    cooldownTimer.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(cooldownTimer.current);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleComplete = async (fullCode) => {
    setSubmitting(true);
    setErrorMessage('');
    try {
      await validateMfaCode(email, fullCode);
      setVerified(true);
      onVerified?.();
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : GENERIC_ERROR);
      setCode('');
      setResetKey((k) => k + 1);
    } finally {
      setSubmitting(false);
    }
  };

  const handleResend = async () => {
    if (resending || cooldown > 0) return;
    setResending(true);
    setErrorMessage('');
    try {
      await resendMfaCode(email);
      setCode('');
      setResetKey((k) => k + 1);
      startCooldown();
    } catch (err) {
      setErrorMessage(err instanceof ApiError ? err.message : 'Não foi possível reenviar o código.');
    } finally {
      setResending(false);
    }
  };

  if (verified) {
    return (
      <div className="mfa-card">
        <div className="mfa-card__glow" aria-hidden="true" />
        <div className="mfa-card__content mfa-card__content--centered">
          <h1 className="mfa-card__title">Autenticação confirmada</h1>
          <p className="mfa-card__hint">Redirecionando para a plataforma...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="mfa-card">
      <div className="mfa-card__glow" aria-hidden="true" />
      <div className="mfa-card__content">
        <h1 className="mfa-card__title">Código de verificação</h1>

        <OtpInput
          key={resetKey}
          length={4}
          value={code}
          onChange={setCode}
          onComplete={handleComplete}
          disabled={submitting}
          error={Boolean(errorMessage)}
        />

        {errorMessage && (
          <p className="mfa-card__error" role="alert">
            {errorMessage}
          </p>
        )}

        <p className="mfa-card__resend">
          Não recebeu?{' '}
          <button
            type="button"
            className="mfa-card__resend-link"
            onClick={handleResend}
            disabled={resending || cooldown > 0}
          >
            {cooldown > 0 ? `Enviar novo código (${cooldown}s)` : 'Enviar novo código'}
          </button>
        </p>
      </div>
    </div>
  );
}
