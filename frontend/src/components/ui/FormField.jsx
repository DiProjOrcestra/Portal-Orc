import './fields.css';

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
  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <div className={`field__control ${error ? 'field__control--error' : ''}`}>
        <input
          id={name}
          name={name}
          type={type}
          inputMode={inputMode}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          autoComplete={autoComplete}
          maxLength={maxLength}
          aria-invalid={Boolean(error)}
          aria-required={required}
        />
      </div>
      {error ? (
        <p className="field__error">{error}</p>
      ) : (
        hint && <p className="field__hint">{hint}</p>
      )}
    </div>
  );
}
