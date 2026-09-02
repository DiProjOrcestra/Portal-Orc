// Helpers used to mask user input and to convert it into the shape the
// backend endpoint (POST /v1/auth/register) expects.

export function onlyDigits(value = '') {
  return value.replace(/\D/g, '');
}

/** Masks input as XXX.XXX.XXX-XX while the user types. */
export function maskCPF(value) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2');
}

/** Masks input as (DD) 9 XXXX-XXXX while the user types. */
export function maskPhone(value) {
  const digits = onlyDigits(value).slice(0, 11);
  return digits
    .replace(/^(\d{2})(\d)/, '($1) $2')
    .replace(/^(\(\d{2}\)\s\d)(\d{4})(\d)/, '$1 $2-$3');
}

/** Masks input as DD/MM/AAAA while the user types. */
export function maskDate(value) {
  const digits = onlyDigits(value).slice(0, 8);
  return digits
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2');
}

/** Converts a DD/MM/AAAA string into the dd-MM-yyyy format expected by the API. */
export function toApiDate(value = '') {
  const digits = onlyDigits(value);
  if (digits.length !== 8) return null;
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${day}-${month}-${year}`;
}

export function isValidDate(value = '') {
  const digits = onlyDigits(value);
  if (digits.length !== 8) return false;
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  if (month < 1 || month > 12) return false;
  const daysInMonth = new Date(year, month, 0).getDate();
  if (day < 1 || day > daysInMonth) return false;
  if (year < 1900 || year > 2100) return false;
  return true;
}

/** Converts a DD/MM/AAAA string into the yyyy-MM-dd format <input type="date"> expects. */
export function maskedToIso(value = '') {
  const digits = onlyDigits(value);
  if (digits.length !== 8) return '';
  const day = digits.slice(0, 2);
  const month = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  return `${year}-${month}-${day}`;
}

/** Converts a yyyy-MM-dd string (native date input value) into DD/MM/AAAA. */
export function isoToMasked(value = '') {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return '';
  const [, year, month, day] = match;
  return `${day}/${month}/${year}`;
}

export function isPastOrTodayDate(value = '') {
  const digits = onlyDigits(value);
  const day = Number(digits.slice(0, 2));
  const month = Number(digits.slice(2, 4));
  const year = Number(digits.slice(4, 8));
  const date = new Date(year, month - 1, day);
  return date.getTime() <= Date.now();
}

/** Standard CPF checksum validation (accepts a masked or raw value). */
export function isValidCPF(value = '') {
  const cpf = onlyDigits(value);
  if (cpf.length !== 11) return false;
  if (/^(\d)\1{10}$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i += 1) sum += Number(cpf[i]) * (10 - i);
  let checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== Number(cpf[9])) return false;

  sum = 0;
  for (let i = 0; i < 10; i += 1) sum += Number(cpf[i]) * (11 - i);
  checkDigit = 11 - (sum % 11);
  if (checkDigit >= 10) checkDigit = 0;
  if (checkDigit !== Number(cpf[10])) return false;

  return true;
}

export function isValidEmail(value = '') {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

export function isValidPhone(value = '') {
  return onlyDigits(value).length === 11;
}

/**
 * Generates a random temporary password.
 *
 * The register form no longer asks the member/admin for a password (RegisterForm
 * only collects profile data, as requested), but the backend's RegisterRequestDto
 * still requires a non-blank `password` to create the account. Until the API
 * offers a way to create an account without one (e.g. auto-generating it server
 * side and sending it by e-mail, as suggested by the "reenvio de senha
 * temporária" flow in the docs), the frontend generates one here so the member
 * can be issued a temporary password afterwards.
 */
export function generateTemporaryPassword() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$%';
  const randomValues = new Uint32Array(16);
  if (typeof crypto !== 'undefined' && crypto.getRandomValues) {
    crypto.getRandomValues(randomValues);
  } else {
    for (let i = 0; i < randomValues.length; i += 1) randomValues[i] = Math.floor(Math.random() * 4294967295);
  }
  return Array.from(randomValues, (n) => chars[n % chars.length]).join('');
}
