export interface ApiError {
  message: string;
  status?: number;
  isClientError: boolean;
  isServerError: boolean;
}

export function handleApiError(error: unknown): ApiError {
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { status?: number; data?: unknown } }).response;
    if (response) {
      const status = response.status || 500;
      const isClientError = status >= 400 && status < 500;
      const isServerError = status >= 500;

      let message = 'Une erreur est survenue';
      
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (typeof data.message === 'string') {
          message = data.message;
        } else if (typeof data.error === 'string') {
          message = data.error;
        }
      }

      const hasExtractedMessage = message !== 'Une erreur est survenue';
      
      if (status === 401) {
        message = hasExtractedMessage ? message : 'Non autorisé. Veuillez vous connecter.';
      } else if (status === 403) {
        message = hasExtractedMessage ? message : 'Accès refusé : vous n\'avez pas les droits administrateur.';
      } else if (status === 404) {
        message = hasExtractedMessage ? message : 'Ressource non trouvée.';
      } else if (status === 409) {
        // Conflit (ex: email déjà utilisé)
        message = hasExtractedMessage ? message : 'Cette ressource existe déjà.';
      } else if (status === 422) {
        message = hasExtractedMessage ? message : 'Données invalides.';
      } else if (isServerError) {
        message = hasExtractedMessage ? message : 'Erreur serveur. Veuillez réessayer plus tard.';
      }

      const errorType = isServerError ? 'SERVER' : isClientError ? 'CLIENT' : 'HTTP';
      console.error(`[FRONT][ERROR][${errorType}] HTTP ${status} – ${message}`);

      return {
        message,
        status,
        isClientError,
        isServerError
      };
    }
  }

  if (error instanceof TypeError && error.message.includes('fetch')) {
    const networkError = {
      message: 'Erreur de connexion. Vérifiez votre connexion internet.',
      isClientError: false,
      isServerError: false
    };
    console.error('[FRONT][ERROR][NETWORK] Erreur de connexion. Vérifiez votre connexion internet.');
    return networkError;
  }

  const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
  console.error(`[FRONT][ERROR][GENERIC] ${message}`);
  return {
    message,
    isClientError: false,
    isServerError: false
  };
}

