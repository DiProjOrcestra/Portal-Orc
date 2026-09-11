import { apiRequest } from './api';

export function getMvv() {
  return apiRequest('/v1/mvv');
}

export function createMvv(payload) {
  return apiRequest('/v1/mvv', { method: 'POST', body: payload });
}

export function updateMvv(payload) {
  return apiRequest('/v1/mvv', { method: 'PUT', body: payload });
}

export function getGoldenCircle() {
  return apiRequest('/v1/golden-circle');
}

export function createGoldenCircle(payload) {
  return apiRequest('/v1/golden-circle', { method: 'POST', body: payload });
}

export function updateGoldenCircle(number, payload) {
  return apiRequest(`/v1/golden-circle/${number}`, { method: 'PUT', body: payload });
}