import { apiRequest } from './api';
import { toApiDate, generateTemporaryPassword } from '../utils/formatters';

/**
 * @param {object} form - raw values from the register form (masked strings)
 * Maps 1:1 to com.orcestra.portal_orc.dto.RegisterRequestDto.
 *
 * The form no longer collects a password (see formatters.generateTemporaryPassword
 * for why one is still generated here before the request is sent).
 */
export function registerMember(form) {
  const payload = {
    name: form.name.trim(),
    email: form.email.trim(),
    phone: Number(form.phone.replace(/\D/g, '')),
    birthDate: toApiDate(form.birthDate),
    cpf: form.cpf.trim(),
    entryDay: toApiDate(form.entryDay),
    position: form.position.trim(),
    directorate: form.directorate,
    password: generateTemporaryPassword(),
  };

  return apiRequest('/v1/auth/register', { method: 'POST', body: payload });
}
