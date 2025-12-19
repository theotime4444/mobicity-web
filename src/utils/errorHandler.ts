// Gestion centralisée des erreurs API

export interface ApiError {
  message: string;
  status?: number;
  isClientError: boolean;
  isServerError: boolean;
}

/**
 * Extrait un message d'erreur lisible depuis une erreur API
 */
export function handleApiError(error: unknown): ApiError {
  // Erreur avec réponse HTTP
  if (error && typeof error === 'object' && 'response' in error) {
    const response = (error as { response?: { status?: number; data?: unknown } }).response;
    if (response) {
      const status = response.status || 500;
      const isClientError = status >= 400 && status < 500;
      const isServerError = status >= 500;

      let message = 'Une erreur est survenue';
      
      // Essayer d'extraire le message depuis response.data
      if (response.data && typeof response.data === 'object') {
        const data = response.data as Record<string, unknown>;
        if (typeof data.message === 'string') {
          message = data.message;
        } else if (typeof data.error === 'string') {
          message = data.error;
        }
      }

      // Messages spécifiques selon le code
      // Si un message a déjà été extrait du body, on le garde (il est plus précis)
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

      // Logging de l'erreur
      const errorType = isServerError ? 'SERVER' : isClientError ? 'CLIENT' : 'HTTP';
      console.error(`[ERROR][${errorType}] HTTP ${status} – ${message}`);

      return {
        message,
        status,
        isClientError,
        isServerError
      };
    }
  }

  // Erreur réseau
  if (error instanceof TypeError && error.message.includes('fetch')) {
    const networkError = {
      message: 'Erreur de connexion. Vérifiez votre connexion internet.',
      isClientError: false,
      isServerError: false
    };
    console.error('[ERROR][NETWORK] – Erreur de connexion. Vérifiez votre connexion internet.');
    return networkError;
  }

  // Erreur générique
  const message = error instanceof Error ? error.message : 'Une erreur inattendue est survenue';
  console.error(`[ERROR][GENERIC] – ${message}`);
  return {
    message,
    isClientError: false,
    isServerError: false
  };
}

