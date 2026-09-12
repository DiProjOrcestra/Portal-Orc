import { useRef } from 'react';
import '../ui/fields.css';
import { isoToMasked, maskedToIso } from '../../utils/formatters';

const CalendarIcon = () => (
  <svg viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
    <rect x="3" y="4.5" width="14" height="12" rx="2.2" stroke="#3FCC10" strokeWidth="1.4" />
    <path d="M3 8.2h14" stroke="#3FCC10" strokeWidth="1.4" />
    <path d="M6.6 2.8v3M13.4 2.8v3" stroke="#3FCC10" strokeWidth="1.4" strokeLinecap="round" />
  </svg>
);

export default function DateField({ label, name, value, onChange, placeholder = 'DD/MM/AAAA', error, hint, required = true }) {
  const nativeDateRef = useRef(null);

  const openPicker = () => {
    const input = nativeDateRef.current;
    if (!input) return;
    if (typeof input.showPicker === 'function') {
      input.showPicker();
    } else {
      input.focus();
      input.click();
    }
  };

  const handleNativeChange = (event) => {
    const masked = isoToMasked(event.target.value);
    if (masked) onChange({ target: { name, value: masked } });
  };

  return (
    <div className="field">
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <div className={`field__control ${error ? 'field__control--error' : ''}`}>
        <input
          id={name}
          name={name}
          type="text"
          inputMode="numeric"
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          aria-invalid={Boolean(error)}
          aria-required={required}
        />
        <button
          type="button"
          className="field__calendar-btn"
          onClick={openPicker}
          aria-label={`Abrir calendário para ${label.toLowerCase()}`}
        >
          <CalendarIcon />
        </button>
        <input
          ref={nativeDateRef}
          type="date"
          className="field__native-date"
          value={maskedToIso(value)}
          onChange={handleNativeChange}
          tabIndex={-1}
          aria-hidden="true"
        />
      </div>
      {error ? <p className="field__error">{error}</p> : hint && <p className="field__hint">{hint}</p>}
    </div>
  );
}
