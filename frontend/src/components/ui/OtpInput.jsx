import { useEffect, useRef } from 'react';
import './OtpInput.css';

/**
 * A row of single-digit boxes for entering a numeric verification code.
 * Handles auto-advance on type, backspace-to-previous, arrow navigation
 * and pasting a full code at once.
 */
export default function OtpInput({
  length = 4,
  value,
  onChange,
  onComplete,
  disabled = false,
  error = false,
  autoFocus = true,
}) {
  const inputsRef = useRef([]);

  useEffect(() => {
    if (autoFocus) inputsRef.current[0]?.focus();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const digits = Array.from({ length }, (_, i) => value[i] || '');

  const setDigit = (index, digit) => {
    const next = digits.slice();
    next[index] = digit;
    const nextValue = next.join('');
    onChange(nextValue);
    if (digit && next.every(Boolean) && next.length === length) {
      onComplete?.(nextValue);
    }
  };

  const handleChange = (index) => (event) => {
    const raw = event.target.value.replace(/\D/g, '');
    if (!raw) {
      setDigit(index, '');
      return;
    }
    setDigit(index, raw[raw.length - 1]);
    if (index < length - 1) inputsRef.current[index + 1]?.focus();
  };

  const handleKeyDown = (index) => (event) => {
    if (event.key === 'Backspace') {
      event.preventDefault();
      if (digits[index]) {
        setDigit(index, '');
      } else if (index > 0) {
        setDigit(index - 1, '');
        inputsRef.current[index - 1]?.focus();
      }
    } else if (event.key === 'ArrowLeft' && index > 0) {
      inputsRef.current[index - 1]?.focus();
    } else if (event.key === 'ArrowRight' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event) => {
    const pasted = event.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!pasted) return;
    event.preventDefault();
    onChange(pasted);
    const focusIndex = Math.min(pasted.length, length - 1);
    inputsRef.current[focusIndex]?.focus();
    if (pasted.length === length) onComplete?.(pasted);
  };

  return (
    <div className={`otp ${error ? 'otp--error' : ''}`} onPaste={handlePaste}>
      {digits.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputsRef.current[index] = el)}
          className="otp__box"
          type="text"
          inputMode="numeric"
          autoComplete={index === 0 ? 'one-time-code' : 'off'}
          maxLength={1}
          value={digit}
          onChange={handleChange(index)}
          onKeyDown={handleKeyDown(index)}
          disabled={disabled}
          aria-label={`Dígito ${index + 1} do código de verificação`}
          aria-invalid={error}
        />
      ))}
    </div>
  );
}
