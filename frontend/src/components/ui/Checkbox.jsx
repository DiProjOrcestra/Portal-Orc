import './Checkbox.css';

export default function Checkbox({ id, checked, onChange, children, error }) {
  return (
    <div className="checkbox">
      <label className="checkbox__row" htmlFor={id}>
        <input
          id={id}
          type="checkbox"
          checked={checked}
          onChange={onChange}
          aria-invalid={Boolean(error)}
        />
        <span className={`checkbox__box ${checked ? 'checkbox__box--checked' : ''}`}>
          {checked && (
            <svg viewBox="0 0 14 11" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1.5 5.5 5 9l7.5-7.5" stroke="#141414" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          )}
        </span>
        <span className="checkbox__label">{children}</span>
      </label>
      {error && <p className="checkbox__error">{error}</p>}
    </div>
  );
}
