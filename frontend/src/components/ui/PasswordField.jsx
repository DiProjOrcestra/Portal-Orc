import { useState } from 'react';
import './fields.css';

const EyeIcon = ({ open }) =>
  open ? (
    <svg viewBox="0 0 20 14" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 7s3-6 9-6 9 6 9 6-3 6-9 6-9-6-9-6Z"
        stroke="#3FCC10"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />
      <circle cx="10" cy="7" r="2.4" stroke="#3FCC10" strokeWidth="1.4" />
    </svg>
  ) : (
    <svg viewBox="0 0 20 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M1 8s3-6 9-6c2 0 3.6.6 4.9 1.4M19 8s-1.1 2.2-3.2 3.8M1 1l18 14"
        stroke="#3FCC10"
        strokeWidth="1.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );

export default function PasswordField({
  label,
  name,
  value,
  onChange,
  placeholder,
  autoComplete = 'current-password',
  error,
  hint,
  required = true,
}) {
  const [visible, setVisible] = useState(false);

  return (
    <div className="field">
      {label && (
        <label className="field__label" htmlFor={name}>
          {label}
        </label>
      )}
      <div className={`field__control ${error ? 'field__control--error' : ''}`}>
        <input
          id={name}
          name={name}
          type={visible ? 'text' : 'password'}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-required={required}
        />
        <button
          type="button"
          className="field__calendar-btn"
          onClick={() => setVisible((v) => !v)}
          aria-label={visible ? 'Ocultar senha' : 'Mostrar senha'}
        >
          <EyeIcon open={visible} />
        </button>
      </div>
      {error ? <p className="field__error">{error}</p> : hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}
