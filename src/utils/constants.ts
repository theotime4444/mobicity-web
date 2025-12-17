// Constantes de l'application

// L'API est montée directement sur / (pas de préfixe /api)
// En développement, utiliser le proxy Vite pour éviter les problèmes CORS
// Le proxy redirige /v1 vers l'API backend
const { VITE_API_BASE_URL: envApiUrl, DEV: isDev } = import.meta.env;

export const API_BASE_URL = envApiUrl || (isDev ? '' : 'http://localhost:3001');

export const MAX_RETRIES = 3;
export const RETRY_DELAY_BASE = 1000; // 1 seconde de base

export const DEFAULT_PAGE_SIZE = 10;
export const PAGE_SIZE_OPTIONS = [5, 10, 20, 50];

