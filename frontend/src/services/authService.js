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

/**
 * Validates the 4-digit MFA code sent by email against
 * com.orcestra.portal_orc.controller.AuthenticationController#validateMfaCode
 * (POST /v1/auth/mfa/validate). Maps to com.orcestra.portal_orc.dto.CodeRequestDto.
 */
export function validateMfaCode(email, code) {
  return apiRequest('/v1/auth/mfa/validate', { method: 'POST', body: { email, code } });
}

/**
 * Requests a new MFA code, invalidating the previous one (UC-34, FA-A1).
 * Maps to com.orcestra.portal_orc.controller.AuthenticationController#resendMfaCode
 * (POST /v1/auth/mfa/resend) and com.orcestra.portal_orc.dto.ResendCodeRequestDto.
 */
export function resendMfaCode(email) {
  return apiRequest('/v1/auth/mfa/resend', { method: 'POST', body: { email } });
}
