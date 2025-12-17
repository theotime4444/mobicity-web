// Fonction exponential retry pour les requêtes API

export interface RetryOptions {
  maxRetries?: number;
  baseDelay?: number;
  retryableStatuses?: number[];
}

/**
 * Exécute une fonction avec exponential backoff retry
 * @param fn Fonction à exécuter (doit retourner une Promise)
 * @param options Options de retry
 * @returns Promise avec le résultat de la fonction
 */
export async function withExponentialRetry<T>(
  fn: () => Promise<T>,
  options: RetryOptions = {}
): Promise<T> {
  const {
    maxRetries = 3,
    baseDelay = 1000,
    retryableStatuses = [500, 502, 503, 504] // Erreurs serveur
  } = options;

  let lastError: Error | null = null;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const result = await fn();
      return result;
    } catch (error: unknown) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Si c'est la dernière tentative, on lance l'erreur
      if (attempt === maxRetries) {
        throw lastError;
      }

      // Vérifier si l'erreur est retryable
      const isRetryable = isRetryableError(error, retryableStatuses);
      if (!isRetryable) {
        throw lastError;
      }

      // Calculer le délai avec exponential backoff
      const delay = baseDelay * Math.pow(2, attempt);
      
      // Attendre avant de réessayer
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }

  throw lastError || new Error('Retry failed');
}

/**
 * Vérifie si une erreur est retryable
 */
function isRetryableError(error: unknown, retryableStatuses: number[]): boolean {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { status?: number } }).response;
    if (response?.status) {
      return retryableStatuses.includes(response.status);
    }
  }

  // Erreurs réseau sont toujours retryables
  if (error instanceof TypeError && error.message.includes('fetch')) {
    return true;
  }

  return false;
}

