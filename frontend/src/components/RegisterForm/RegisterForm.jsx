import { useState } from 'react';
import FormField from '../ui/FormField';
import CustomSelect from '../ui/CustomSelect';
import DateField from '../ui/DateField';
import { registerMember } from '../../services/authService';
import { ApiError } from '../../services/api';
import { DIRECTORATE_OPTIONS, POSITION_OPTIONS } from '../../constants/options';
import {
  maskCPF,
  maskPhone,
  maskDate,
  isValidCPF,
  isValidEmail,
  isValidPhone,
  isValidDate,
  isPastOrTodayDate,
} from '../../utils/formatters';
import './RegisterForm.css';

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  birthDate: '',
  cpf: '',
  entryDay: '',
  position: '',
  directorate: '',
};

const REQUIRED_MESSAGE = 'Esse campo não pode ser vazio';

function validate(form) {
  const errors = {};

  if (!form.name.trim()) errors.name = REQUIRED_MESSAGE;

  if (!form.email.trim()) errors.email = REQUIRED_MESSAGE;
  else if (!isValidEmail(form.email)) errors.email = 'Esse email não é válido';

  if (!form.phone.trim()) errors.phone = REQUIRED_MESSAGE;
  else if (!isValidPhone(form.phone)) errors.phone = 'Informe um telefone válido com DDD';

  if (!form.birthDate.trim()) errors.birthDate = REQUIRED_MESSAGE;
  else if (!isValidDate(form.birthDate)) errors.birthDate = 'Data inválida';
  else if (!isPastOrTodayDate(form.birthDate)) errors.birthDate = 'A data não pode ser no futuro';

  if (!form.cpf.trim()) errors.cpf = REQUIRED_MESSAGE;
  else if (!isValidCPF(form.cpf)) errors.cpf = 'Esse CPF não é válido';

  if (!form.entryDay.trim()) errors.entryDay = REQUIRED_MESSAGE;
  else if (!isValidDate(form.entryDay)) errors.entryDay = 'Data inválida';

  if (!form.directorate) errors.directorate = REQUIRED_MESSAGE;
  if (!form.position) errors.position = REQUIRED_MESSAGE;

  return errors;
}

export default function RegisterForm({ onCancel }) {
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [banner, setBanner] = useState(null); // { type: 'success' | 'error', message }

  const setField = (name) => (event) => {
    const raw = event.target.value;
    setForm((prev) => ({ ...prev, [name]: raw }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const setMaskedField = (name, mask) => (event) => {
    const raw = mask(event.target.value);
    setForm((prev) => ({ ...prev, [name]: raw }));
    if (errors[name]) setErrors((prev) => ({ ...prev, [name]: undefined }));
  };

  const resetForm = () => {
    setForm(EMPTY_FORM);
    setErrors({});
  };

  const handleCancel = () => {
    resetForm();
    setBanner(null);
    onCancel?.();
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
      await registerMember(form);
      setBanner({ type: 'success', message: 'Usuário cadastrado com sucesso!' });
      resetForm();
    } catch (err) {
      if (err instanceof ApiError) {
        const message = err.message || '';
        if (/e-?mail/i.test(message)) {
          setErrors((prev) => ({ ...prev, email: message }));
        } else if (/cpf/i.test(message)) {
          setErrors((prev) => ({ ...prev, cpf: message }));
        } else {
          setBanner({ type: 'error', message });
        }
      } else {
        setBanner({ type: 'error', message: 'Ocorreu um erro inesperado. Tente novamente.' });
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="register-card">
      <div className="register-card__glow-layer" aria-hidden="true">
        <div className="register-card__glow register-card__glow--top" />
        <div className="register-card__glow register-card__glow--bottom" />
      </div>

      <div className="register-card__content">
        <h1 className="register-card__title">
          Cadastrar <span>usuário</span>
        </h1>

        {banner && (
          <p className={`register-card__banner register-card__banner--${banner.type}`} role="status">
            {banner.message}
          </p>
        )}

        <form className="register-form" onSubmit={handleSubmit} noValidate>
          <div className="register-form__grid">
            <FormField
              label="Nome completo"
              name="name"
              value={form.name}
              onChange={setField('name')}
              placeholder="Nome completo"
              autoComplete="name"
              error={errors.name}
            />
            <FormField
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={setField('email')}
              placeholder="nome.sobrenome@orcestra.com.br"
              autoComplete="email"
              error={errors.email}
            />

            <FormField
              label="Telefone"
              name="phone"
              type="tel"
              inputMode="numeric"
              value={form.phone}
              onChange={setMaskedField('phone', maskPhone)}
              placeholder="(DDD) 9 XXXX-XXXX"
              error={errors.phone}
            />
            <DateField
              label="Data de nascimento"
              name="birthDate"
              value={form.birthDate}
              onChange={setMaskedField('birthDate', maskDate)}
              error={errors.birthDate}
            />

            <FormField
              label="CPF"
              name="cpf"
              inputMode="numeric"
              value={form.cpf}
              onChange={setMaskedField('cpf', maskCPF)}
              placeholder="XXX.XXX.XXX-XX"
              error={errors.cpf}
            />
            <DateField
              label="Data de entrada"
              name="entryDay"
              value={form.entryDay}
              onChange={setMaskedField('entryDay', maskDate)}
              error={errors.entryDay}
              hint="Semestre/dia de entrada na Orc'estra"
            />

            <CustomSelect
              label="Diretoria"
              name="directorate"
              value={form.directorate}
              onChange={setField('directorate')}
              placeholder="Selecione a diretoria"
              options={DIRECTORATE_OPTIONS}
              error={errors.directorate}
            />
            <CustomSelect
              label="Cargo"
              name="position"
              value={form.position}
              onChange={setField('position')}
              placeholder="Selecione o cargo"
              options={POSITION_OPTIONS}
              error={errors.position}
            />
          </div>

          <div className="register-form__actions">
            <button type="button" className="btn btn--ghost" onClick={handleCancel} disabled={submitting}>
              Cancelar
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Cadastrando...' : 'Cadastrar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
