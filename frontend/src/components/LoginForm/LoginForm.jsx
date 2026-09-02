import { useState } from 'react';
import FormField from '../ui/FormField';
import PasswordField from '../ui/PasswordField';
import { login } from '../../services/authService';
import { ApiError } from '../../services/api';
import { isValidEmail } from '../../utils/formatters';
import divider from '../../assets/linha-divisoria.png';
import googleIcon from '../../assets/google-icon.png';
import './LoginForm.css';

const EMPTY_FORM = { email: '', password: '' };
const REQUIRED_MESSAGE = 'Esse campo não pode ser vazio';

function validate(form) {
  const errors = {};

  if (!form.email.trim()) errors.email = REQUIRED_MESSAGE;
  else if (!isValidEmail(form.email)) errors.email = 'Esse email não é válido';

  if (!form.password) errors.password = REQUIRED_MESSAGE;

  return errors;
}

export default function LoginForm() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success' | 'error', message }

  const setField = (name) => (event) => {
    const raw = event.target.value;
    setForm((prev) => ({ ...prev, [name]: raw }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setBanner(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setSubmitting(true);
    try {
      await login(form);
      // TODO: redirecionar pro painel informativo depois do login (RF04-07)
    } catch (err) {
      if (err instanceof ApiError) {
        setBanner({ type: 'error', message: err.message || 'Email ou senha inválidos.' });
      } else {
        setBanner({ type: 'error', message: 'Ocorreu um erro inesperado. Tente novamente.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="login-card">
      <div className="login-card__glow-layer" aria-hidden="true">
        <div className="login-card__glow login-card__glow--top" />
        <div className="login-card__glow login-card__glow--bottom" />
      </div>

      <div className="login-card__content">
        <h1 className="login-card__title">Entrar</h1>

        {banner && (
          <p className={`login-card__banner login-card__banner--${banner.type}`} role="status">
            {banner.message}
          </p>
        )}

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <FormField
            label={null}
            name="email"
            type="email"
            value={form.email}
            onChange={setField('email')}
            placeholder="Email"
            autoComplete="email"
            error={errors.email}
          />
          <PasswordField
            label={null}
            name="password"
            value={form.password}
            onChange={setField('password')}
            placeholder="Senha"
            error={errors.password}
          />

          <button type="submit" className="login-form__submit" disabled={submitting}>
            {submitting ? 'Entrando...' : 'Entrar'}
          </button>

          <div className="login-form__divider">
            <img src={divider} alt="" aria-hidden="true" />
            <span>OU</span>
            <img src={divider} alt="" aria-hidden="true" />
          </div>

          <button type="button" className="login-form__google">
            <img src={googleIcon} alt="" aria-hidden="true" />
          </button>
        </form>
      </div>
    </div>
  );
}

