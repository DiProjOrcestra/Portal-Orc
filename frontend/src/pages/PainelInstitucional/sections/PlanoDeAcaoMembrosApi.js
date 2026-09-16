import { apiRequest } from '../../../services/api';

// GET /v1/users - devolve [{ cpf, name }], confirmado no código do
// UserController/UserListResponseDto.
export function fetchMembros() {
  return apiRequest('/v1/users');
}

/**
 * PUT /v1/action-plan/{id} - confirmado no ActionPlanController. Aditivo:
 * o backend usa um Set e faz addAll, então não substitui quem já estava
 * vinculado nem dá erro se repetir alguém - só ignora o repetido em
 * silêncio (a FE-E1 da UC-19, "membro já vinculado", não é aplicada pelo
 * backend hoje).
 */
export function vincularMembros(actionPlanId, cpfs) {
  return apiRequest(`/v1/action-plan/${actionPlanId}/users`, {
    method: 'PUT',
    body: { usersId: cpfs },
  });
}