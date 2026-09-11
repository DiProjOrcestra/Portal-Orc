import { useState } from 'react';
import './fields.css';

const EyeIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7Z" />
    <circle cx="12" cy="12" r="3" />
  </svg>
);

const EyeOffIcon = (props) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M3 3l18 18" />
    <path d="M10.6 5.1A10.7 10.7 0 0 1 12 5c6.5 0 10 7 10 7a17.9 17.9 0 0 1-3.1 4" />
    <path d="M6.2 6.2C3.6 8 2 12 2 12s3.5 7 10 7c1.6 0 3-.4 4.2-1" />
    <path d="M9.9 9.9a3 3 0 0 0 4.2 4.2" />
  </svg>
);

export default function FormField({
  label,
  name,
  value,
  onChange,
  placeholder,
  type = 'text',
  inputMode,
  autoComplete = 'off',
  maxLength,
  error,
  hint,
  required = true,
}) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword && showPassword ? 'text' : type;

  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <div
        className={`field__control ${error ? 'field__control--error' : ''} ${
          isPassword ? 'field__control--has-toggle' : ''
        }`}
      >
        <input
          id={name}
          name={name}
          type={inputType}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-required={required}
        />
        {isPassword && (
          <button
            type="button"
            className="field__toggle-btn"
            onClick={() => setShowPassword((prev) => !prev)}
            aria-label={showPassword ? 'Ocultar senha' : 'Mostrar senha'}
          >
            {showPassword ? <EyeOffIcon /> : <EyeIcon />}
          </button>
        )}
      </div>
      {error ? (
        <p className="field__error">{error}</p>
      ) : (
        hint && <p className="field__hint">{hint}</p>
      )}
    </div>
  );
}
