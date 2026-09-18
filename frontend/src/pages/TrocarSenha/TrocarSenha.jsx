import { useState } from 'react';
import FormField from '../../components/ui/FormField';
import './TrocarSenha.css';

const REQUIRED_MESSAGE = 'Esse campo não pode ser vazio';

// FE-E1: critérios de segurança da nova senha, checados um a um em tempo
// real (ver PasswordRequirements) e também usados para bloquear o envio.
const PASSWORD_REQUIREMENTS = [
  { key: 'length', label: 'Ao menos 8 caracteres', test: (value) => value.length >= 8 },
  { key: 'uppercase', label: 'Uma letra maiúscula', test: (value) => /[A-Z]/.test(value) },
  { key: 'lowercase', label: 'Uma letra minúscula', test: (value) => /[a-z]/.test(value) },
  { key: 'number', label: 'Um número', test: (value) => /\d/.test(value) },
  { key: 'special', label: 'Um caractere especial', test: (value) => /[^A-Za-z0-9]/.test(value) },
];

const EMPTY_FORM = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

function validate(form) {
  const errors = {};

  if (!form.currentPassword) errors.currentPassword = REQUIRED_MESSAGE;

  if (!form.newPassword) errors.newPassword = REQUIRED_MESSAGE;
  else if (!PASSWORD_REQUIREMENTS.every((req) => req.test(form.newPassword))) {
    errors.newPassword = 'A senha ainda não atende a todos os requisitos abaixo';
  }

  // FE-E2
  if (!form.confirmPassword) errors.confirmPassword = REQUIRED_MESSAGE;
  else if (form.confirmPassword !== form.newPassword) errors.confirmPassword = 'As senhas não coincidem';

  return errors;
}

// Lista de requisitos que fica vermelha/verde conforme o usuário digita.
function PasswordRequirements({ password }) {
  return (
    <ul className="trocar-senha-requirements">
      {PASSWORD_REQUIREMENTS.map((req) => {
        const met = req.test(password);
        return (
          <li
            key={req.key}
            className={`trocar-senha-requirements__item ${
              met ? 'trocar-senha-requirements__item--met' : 'trocar-senha-requirements__item--unmet'
            }`}
          >
            <span className="trocar-senha-requirements__icon" aria-hidden="true">
              {met ? '✓' : '✕'}
            </span>
            {req.label}
          </li>
        );
      })}
    </ul>
  );
}

// UC-07: só o front por enquanto - sem endpoint de troca de senha ainda, a
// validação (FE-E1/FE-E2) já funciona de ponta a ponta, mas "salvar" apenas
// simula sucesso localmente.
export default function TrocarSenha({ onSuccess }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [banner, setBanner] = useState(null); // { type: 'success' | 'error', message }

  const setField = (name) => (event) => {
    const raw = event.target.value;
    setForm((prev) => ({ ...prev, [name]: raw }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setBanner(null);

    const validationErrors = validate(form);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setBanner({ type: 'success', message: 'Senha atualizada com sucesso!' });
    setForm(EMPTY_FORM);
    onSuccess?.();
  };

  const passwordsMatch = form.confirmPassword && form.confirmPassword === form.newPassword;
  const passwordsMismatch = form.confirmPassword && form.confirmPassword !== form.newPassword;

  return (
    <div className="page">
      <div className="page__background" aria-hidden="true" />
      <main className="page__main trocar-senha-main">
        <div className="trocar-senha-card">
          <div className="trocar-senha-card__glow-layer" aria-hidden="true">
            <div className="trocar-senha-card__glow trocar-senha-card__glow--top" />
            <div className="trocar-senha-card__glow trocar-senha-card__glow--bottom" />
          </div>

          <div className="trocar-senha-card__content">
            <h1 className="trocar-senha-card__title">Trocar senha</h1>
            <p className="trocar-senha-card__subtitle">
              Por segurança, defina uma nova senha antes de continuar.
            </p>

            {banner && (
              <p
                className={`trocar-senha-card__banner trocar-senha-card__banner--${banner.type}`}
                role="status"
              >
                {banner.message}
              </p>
            )}

            <form className="trocar-senha-form" onSubmit={handleSubmit} noValidate>
              <FormField
                label="Senha atual"
                name="currentPassword"
                type="password"
                value={form.currentPassword}
                onChange={setField('currentPassword')}
                placeholder="Senha atual"
                autoComplete="current-password"
                error={errors.currentPassword}
              />
              <div className="trocar-senha-field-group">
                <FormField
                  label="Nova senha"
                  name="newPassword"
                  type="password"
                  value={form.newPassword}
                  onChange={setField('newPassword')}
                  placeholder="Nova senha"
                  autoComplete="new-password"
                  error={errors.newPassword}
                />
                {form.newPassword && <PasswordRequirements password={form.newPassword} />}
              </div>
              <div className="trocar-senha-field-group">
                <FormField
                  label="Confirmar nova senha"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={setField('confirmPassword')}
                  placeholder="Confirmar nova senha"
                  autoComplete="new-password"
                  error={errors.confirmPassword}
                />
                {(passwordsMatch || passwordsMismatch) && (
                  <p
                    className={`trocar-senha-match ${
                      passwordsMatch ? 'trocar-senha-match--ok' : 'trocar-senha-match--bad'
                    }`}
                  >
                    {passwordsMatch ? 'As duas senhas coincidem.' : 'As senhas não coincidem.'}
                  </p>
                )}
              </div>

              <button type="submit" className="btn btn--primary trocar-senha-form__submit">
                Salvar nova senha
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
