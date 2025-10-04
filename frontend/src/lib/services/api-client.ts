import { API_CONFIG } from "../config/api";
import type { ApiResponse, ApiError } from "../types";

/**
 * Make HTTP request with error handling
 */
async function request<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), API_CONFIG.TIMEOUT);

  try {
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw {
        message: `HTTP ${response.status}: ${response.statusText}`,
        status: response.status,
      } as ApiError;
    }

    const data = await response.json();
    return {
      data,
      success: true,
    };
  } catch (error) {
    clearTimeout(timeoutId);

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        throw {
          message: "Request timeout",
          code: "TIMEOUT",
        } as ApiError;
      }
    }

    throw error as ApiError;
  }
}

/**
 * GET request
 */
async function get<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: "GET" });
}

/**
 * POST request
 */
async function post<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...options,
    method: "POST",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * PUT request
 */
async function put<T>(
  endpoint: string,
  body?: unknown,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, {
    ...options,
    method: "PUT",
    body: body ? JSON.stringify(body) : undefined,
  });
}

/**
 * DELETE request
 */
async function deleteRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * Base API client with error handling and retry logic
 */
export const apiClient = {
  get,
  post,
  put,
  delete: deleteRequest,
};
