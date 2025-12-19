export async function parseApiErrorResponse(response: Response): Promise<{ response: { status: number; data: { message: string } } }> {
  let message = 'Une erreur est survenue';
  
  try {
    const errorData = await response.json();
    message = errorData.message || errorData.error || errorData.detail || message;
  } catch {
    message = response.statusText || `Erreur HTTP ${response.status}`;
  }
  
  const errorType = response.status >= 500 ? 'SERVER' : response.status >= 400 ? 'CLIENT' : 'HTTP';
  console.error(`[FRONT][API][${errorType}] HTTP ${response.status} – ${message}`);
  
  return {
    response: {
      status: response.status,
      data: { message }
    }
  };
}

