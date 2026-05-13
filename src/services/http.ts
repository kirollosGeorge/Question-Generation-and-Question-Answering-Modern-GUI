import { apiConfig } from './config';

export class ApiError extends Error {
  status?: number;
  details?: unknown;

  constructor(message: string, status?: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

export async function postJson<TResponse, TPayload>(endpoint: string, payload: TPayload): Promise<TResponse> {
  const url = `${apiConfig.baseUrl}${endpoint}`;

  let response: Response;
  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });
  } catch (error) {
    throw new ApiError(
      `Unable to reach the API at ${url}. Confirm that the Python adapter is running and CORS is enabled.`,
      undefined,
      error
    );
  }

  const contentType = response.headers.get('content-type') || '';
  const body = contentType.includes('application/json') ? await response.json() : await response.text();

  if (!response.ok) {
    const message = typeof body === 'string' ? body : body?.message || 'API request failed.';
    throw new ApiError(message, response.status, body);
  }

  return body as TResponse;
}
