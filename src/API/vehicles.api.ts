// API endpoints pour les véhicules
import type { IVehicle } from '../model/IVehicle';
import { parseApiErrorResponse } from '../utils/apiError';

export interface GetVehiclesParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type GetVehiclesResponse = IVehicle[];

function getApiUrl(endpoint: string): string {
  if (typeof window !== 'undefined') {
    return endpoint;
  }
  const baseUrl = (import.meta as any).env?.VITE_API_BASE_URL || '';
  return baseUrl ? `${baseUrl}${endpoint}` : endpoint;
}

function getHeaders(): HeadersInit {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };
  
  if (typeof window !== 'undefined') {
    const token = window.localStorage.getItem('auth_token');
    if (token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
  }
  
  return headers;
}

export async function getVehicles(params?: GetVehiclesParams): Promise<GetVehiclesResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.page && params?.limit) {
    queryParams.append('offset', String((params.page - 1) * params.limit));
  }
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.search !== undefined && params?.search !== null) {
    queryParams.append('search', params.search);
  }

  const queryString = queryParams.toString();
  const endpoint = `/v1/admin/vehicles${queryString ? `?${queryString}` : ''}`;
  const url = getApiUrl(endpoint);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const errorData = await parseApiErrorResponse(response);
    throw errorData;
  }
  
  return response.json();
}

export async function getVehicleById(id: string | number): Promise<IVehicle> {
  const url = getApiUrl(`/v1/admin/vehicles/${id}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const errorData = await parseApiErrorResponse(response);
    throw errorData;
  }
  
  return response.json();
}

export async function createVehicle(vehicle: Omit<IVehicle, 'id'>): Promise<IVehicle> {
  const url = getApiUrl('/v1/admin/vehicles');
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(vehicle),
  });
  
  if (!response.ok) {
    const errorData = await parseApiErrorResponse(response);
    throw errorData;
  }
  
  return response.json();
}

export async function updateVehicle(id: string | number, vehicle: Partial<Omit<IVehicle, 'id'>>): Promise<IVehicle> {
  const url = getApiUrl('/v1/admin/vehicles');
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ ...vehicle, id }),
  });
  
  if (!response.ok) {
    const errorData = await parseApiErrorResponse(response);
    throw errorData;
  }
  
  // Gérer le cas 204 No Content (pas de body dans la réponse)
  if (response.status === 204) {
    return { ...vehicle, id } as IVehicle;
  }
  
  return response.json();
}

export async function deleteVehicle(id: string | number): Promise<void> {
  const url = getApiUrl(`/v1/admin/vehicles/${id}`);
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    const errorData = await parseApiErrorResponse(response);
    throw errorData;
  }
  
  if (response.status !== 204) {
    await response.json();
  }
}

