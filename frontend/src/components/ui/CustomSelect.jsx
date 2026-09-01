import { useEffect, useRef, useState } from 'react';
import './CustomSelect.css';

const ChevronIcon = ({ open }) => (
  <svg
    className={`custom-select__chevron ${open ? 'custom-select__chevron--open' : ''}`}
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    <path d="M4 6.2 8 10l4-3.8" stroke="#3FCC10" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

export default function CustomSelect({
  label,
  name,
  value,
  onChange,
  placeholder,
  options,
  error,
  required = true,
}) {
  const [open, setOpen] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setOpen(false);
      }
    }
    function handleEscape(event) {
      if (event.key === 'Escape') setOpen(false);
    }
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  const normalizedOptions = options.map((option) =>
    typeof option === 'string' ? { value: option, label: option } : option,
  );

  const selected = normalizedOptions.find((option) => option.value === value);

  const selectOption = (optionValue) => {
    onChange({ target: { name, value: optionValue } });
    setOpen(false);
  };

  return (
    <div className="field" ref={wrapperRef}>
      <label className="field__label" htmlFor={name}>
        {label}
      </label>
      <div className="custom-select">
        <button
          type="button"
          id={name}
          className={`custom-select__trigger ${open ? 'custom-select__trigger--open' : ''} ${
            error ? 'custom-select__trigger--error' : ''
          }`}
          onClick={() => setOpen((isOpen) => !isOpen)}
          aria-haspopup="listbox"
          aria-expanded={open}
          aria-invalid={Boolean(error)}
          aria-required={required}
        >
          <span className={selected ? 'custom-select__value' : 'custom-select__placeholder'}>
            {selected ? selected.label : placeholder}
          </span>
          <ChevronIcon open={open} />
        </button>

        {open && (
          <ul className="custom-select__panel" role="listbox">
            {normalizedOptions.map((option) => (
              <li key={option.value} role="option" aria-selected={option.value === value}>
                <button type="button" className="custom-select__option" onClick={() => selectOption(option.value)}>
                  {option.label}
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      {error && <p className="field__error">{error}</p>}
    </div>
  );
}
