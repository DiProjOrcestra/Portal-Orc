// Base URL of the backend (Portal-Orc Spring Boot API).
// Override it by setting VITE_API_URL in a .env file at the frontend root.
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

export class ApiError extends Error {
  constructor(message, status) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

/**
 * Thin wrapper around fetch that talks to the Portal-Orc API and normalizes
 * error responses, which are always shaped like { message, status }
 * (see com.orcestra.portal_orc.exception.ErrorResponse).
 */
export async function apiRequest(path, { method = 'GET', body, headers } = {}) {
  let response;
  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      method,
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: body ? JSON.stringify(body) : undefined,
    });
  } catch {
    throw new ApiError(
      'Não foi possível conectar ao servidor. Verifique sua conexão e tente novamente.',
      0,
    );
  }

  if (response.status === 204 || response.status === 201) {
    return null;
  }

  const text = await response.text();
  const data = text ? JSON.parse(text) : null;

  if (!response.ok) {
    throw new ApiError(data?.message || 'Ocorreu um erro inesperado.', response.status);
  }

  return data;
}
