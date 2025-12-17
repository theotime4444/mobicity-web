// Client API centralisé avec exponential retry et gestion d'erreurs

import { API_BASE_URL, MAX_RETRIES, RETRY_DELAY_BASE } from '../utils/constants';
import { withExponentialRetry } from '../utils/retry';
import { handleApiError } from '../utils/errorHandler';

const retryOptions = {
  maxRetries: MAX_RETRIES,
  baseDelay: RETRY_DELAY_BASE,
};

class ApiClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(baseURL: string) {
    this.baseURL = baseURL;
    this.defaultHeaders = {
      'Content-Type': 'application/json',
    };
  }

  setAuthToken(token: string | null): void {
    if (token) {
      this.defaultHeaders = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      };
    } else {
      this.defaultHeaders = {
        'Content-Type': 'application/json',
      };
    }
  }

  async get<T>(endpoint: string, params?: Record<string, string | number | boolean>): Promise<T> {
    const url = this.buildUrl(endpoint, params);
    
    return withExponentialRetry(async () => {
      const response = await fetch(url, {
        method: 'GET',
        headers: this.defaultHeaders,
      });

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw error;
      }

      return response.json();
    }, retryOptions);
  }

  async post<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.baseURL ? this.baseURL + endpoint : endpoint;
    return withExponentialRetry(async () => {
      const response = await fetch(url, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw error;
      }

      return response.json();
    }, retryOptions);
  }

  async patch<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.baseURL ? this.baseURL + endpoint : endpoint;
    return withExponentialRetry(async () => {
      const response = await fetch(url, {
        method: 'PATCH',
        headers: this.defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw error;
      }

      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    }, retryOptions);
  }

  async put<T>(endpoint: string, data?: unknown): Promise<T> {
    const url = this.baseURL ? this.baseURL + endpoint : endpoint;
    return withExponentialRetry(async () => {
      const response = await fetch(url, {
        method: 'PUT',
        headers: this.defaultHeaders,
        body: data ? JSON.stringify(data) : undefined,
      });

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw error;
      }

      return response.json();
    }, retryOptions);
  }

  async delete<T>(endpoint: string): Promise<T> {
    const url = this.baseURL ? this.baseURL + endpoint : endpoint;
    return withExponentialRetry(async () => {
      const response = await fetch(url, {
        method: 'DELETE',
        headers: this.defaultHeaders,
      });

      if (!response.ok) {
        const error = await this.parseErrorResponse(response);
        throw error;
      }

      if (response.status === 204) {
        return {} as T;
      }

      return response.json();
    }, retryOptions);
  }

  private buildUrl(endpoint: string, params?: Record<string, string | number | boolean>): string {
    if (!this.baseURL) {
      const url = new URL(endpoint, window.location.origin);
      if (params) {
        Object.entries(params).forEach(([key, value]) => {
          url.searchParams.append(key, String(value));
        });
      }
      return url.toString();
    }

    const url = new URL(endpoint, this.baseURL);
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        url.searchParams.append(key, String(value));
      });
    }

    return url.toString();
  }

  private async parseErrorResponse(response: Response): Promise<Error> {
    let message = 'Une erreur est survenue';
    try {
      const errorData = await response.json();
      message = errorData.message || errorData.error || message;
    } catch {
      message = 'Erreur HTTP ' + response.status + ': ' + response.statusText;
    }
    
    const apiError = handleApiError({
      response: {
        status: response.status,
        statusText: response.statusText,
        data: { message },
      },
    });
    return new Error(apiError.message);
  }
}

export const apiClient = new ApiClient(API_BASE_URL);