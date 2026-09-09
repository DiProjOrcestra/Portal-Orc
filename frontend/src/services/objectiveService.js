import { apiRequest } from './api';

/**
 * Maps 1:1 to com.orcestra.portal_orc.dto.ObjectiveResponseDto / ObjectiveRequestDto.
 * Only `description` is persisted by the backend (UC-16/UC-17) — progress,
 * deadline and key-result data shown in the UI are decorative placeholders
 * from mockData, not part of this model yet.
 */

export function getObjectives() {
  return apiRequest('/v1/objective');
}

export function createObjective(description) {
  return apiRequest('/v1/objective', { method: 'POST', body: { description } });
}

export function updateObjective(id, description) {
  return apiRequest(`/v1/objective/${id}`, { method: 'PUT', body: { description } });
}
