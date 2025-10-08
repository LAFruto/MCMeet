import { API_CONFIG } from "../config/api";
import type { ApiResponse, ApiError } from "../types";

/**
 * Makes an HTTP request with timeout and error handling
 * @template T - The expected response data type
 * @param {string} endpoint - The API endpoint path
 * @param {RequestInit} [options={}] - Fetch API options
 * @returns {Promise<ApiResponse<T>>} The API response
 * @throws {ApiError} When the request fails or times out
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
 * Performs a GET request
 * @template T - The expected response data type
 * @param {string} endpoint - The API endpoint path
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<ApiResponse<T>>} The API response
 */
async function get<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: "GET" });
}

/**
 * Performs a POST request
 * @template T - The expected response data type
 * @param {string} endpoint - The API endpoint path
 * @param {unknown} [body] - Request body to be JSON stringified
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<ApiResponse<T>>} The API response
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
 * Performs a PUT request
 * @template T - The expected response data type
 * @param {string} endpoint - The API endpoint path
 * @param {unknown} [body] - Request body to be JSON stringified
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<ApiResponse<T>>} The API response
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
 * Performs a DELETE request
 * @template T - The expected response data type
 * @param {string} endpoint - The API endpoint path
 * @param {RequestInit} [options] - Additional fetch options
 * @returns {Promise<ApiResponse<T>>} The API response
 */
async function deleteRequest<T>(
  endpoint: string,
  options?: RequestInit
): Promise<ApiResponse<T>> {
  return request<T>(endpoint, { ...options, method: "DELETE" });
}

/**
 * Base API client with error handling and timeout support
 * Provides HTTP methods (GET, POST, PUT, DELETE) with consistent error handling
 */
export const apiClient = {
  get,
  post,
  put,
  delete: deleteRequest,
};
