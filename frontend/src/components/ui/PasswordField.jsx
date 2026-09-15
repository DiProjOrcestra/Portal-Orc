import './fields.css';

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
          type="password"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          aria-invalid={Boolean(error)}
          aria-required={required}
        />
      </div>
      {error ? <p className="field__error">{error}</p> : hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}

