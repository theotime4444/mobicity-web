// Fonction utilitaire pour parser les erreurs API depuis une Response fetch

/**
 * Parse une réponse d'erreur HTTP et retourne un objet structuré
 * compatible avec handleApiError()
 * 
 * @param response - La Response fetch qui contient l'erreur
 * @returns Un objet structuré au format attendu par handleApiError()
 */
export async function parseApiErrorResponse(response: Response): Promise<{ response: { status: number; data: { message: string } } }> {
  let message = 'Une erreur est survenue';
  
  try {
    const errorData = await response.json();
    // Essayer d'extraire le message depuis différentes propriétés possibles
    message = errorData.message || errorData.error || errorData.detail || message;
  } catch {
    // Si le body n'est pas du JSON, utiliser le statusText
    message = response.statusText || `Erreur HTTP ${response.status}`;
  }
  
  // Logging de l'erreur HTTP
  const errorType = response.status >= 500 ? 'SERVER' : response.status >= 400 ? 'CLIENT' : 'HTTP';
  console.error(`[ERROR][${errorType}][API] HTTP ${response.status} – ${message}`);
  
  return {
    response: {
      status: response.status,
      data: { message }
    }
  };
}

