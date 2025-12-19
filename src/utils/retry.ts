export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  retryableStatuses?: number[];
}

export async function withExponentialRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    retryableStatuses = [500, 502, 503, 504]
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt === maxRetries) {
        throw lastError;
      }

      const isRetryable = isRetryableError(error, retryableStatuses);
      if (!isRetryable) {
        throw lastError;
      }

      const delay = baseDelay * Math.pow(2, attempt);
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

function isRetryableError(error: unknown, retryableStatuses: number[]): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { status?: number } }).response;
    if (response?.status) {
      return retryableStatuses.includes(response.status);
    }
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  return false;
}

