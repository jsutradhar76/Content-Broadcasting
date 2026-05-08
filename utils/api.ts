import { ApiResponse } from '@/types';

// Get API base URL from environment or default to localhost
const getApiBaseUrl = () => {
  if (typeof window !== 'undefined') {
    // Client-side
    return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';
  }
  // Server-side
  return process.env.API_URL || 'http://localhost:3001/api';
};

export const API_BASE_URL = getApiBaseUrl();

// Request headers with token
const getHeaders = (token?: string | null, includeContentType = true): HeadersInit => {
  const headers: HeadersInit = {
    ...(includeContentType && { 'Content-Type': 'application/json' }),
  };

  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  return headers;
};

// Generic fetch wrapper
export async function apiCall<T>(
  endpoint: string,
  options: RequestInit & { token?: string | null } = {}
): Promise<ApiResponse<T>> {
  const { token, ...fetchOptions } = options;
  const url = `${API_BASE_URL}${endpoint}`;

  try {
    const response = await fetch(url, {
      ...fetchOptions,
      headers: {
        ...getHeaders(token, !fetchOptions.body || typeof fetchOptions.body === 'string'),
        ...(fetchOptions.headers as Record<string, string>),
      },
    });

    // Handle response
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return {
        success: false,
        error: errorData.error || errorData.message || `HTTP ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: true,
      data,
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
    console.error('[API Error]', errorMessage);
    return {
      success: false,
      error: errorMessage,
    };
  }
}

// Helper for GET requests
export const apiGet = <T,>(endpoint: string, token?: string | null) =>
  apiCall<T>(endpoint, {
    method: 'GET',
    token,
  });

// Helper for POST requests
export const apiPost = <T,>(endpoint: string, data: unknown, token?: string | null) =>
  apiCall<T>(endpoint, {
    method: 'POST',
    body: JSON.stringify(data),
    token,
  });

// Helper for PUT requests
export const apiPut = <T,>(endpoint: string, data: unknown, token?: string | null) =>
  apiCall<T>(endpoint, {
    method: 'PUT',
    body: JSON.stringify(data),
    token,
  });

// Helper for DELETE requests
export const apiDelete = <T,>(endpoint: string, token?: string | null) =>
  apiCall<T>(endpoint, {
    method: 'DELETE',
    token,
  });

// Helper for file upload (multipart/form-data)
export const apiUploadFile = <T,>(
  endpoint: string,
  formData: FormData,
  token?: string | null
) =>
  fetch(`${API_BASE_URL}${endpoint}`, {
    method: 'POST',
    body: formData,
    headers: {
      Authorization: token ? `Bearer ${token}` : '',
    },
  })
    .then((res) => res.json())
    .then((data) => ({
      success: true,
      data,
    }))
    .catch((error) => ({
      success: false,
      error: error.message || 'Upload failed',
    }));
