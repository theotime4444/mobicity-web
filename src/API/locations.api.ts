import type { ILocation } from '../model/ILocation';
import { parseApiErrorResponse } from '../utils/apiError';

export interface GetLocationsParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type GetLocationsResponse = ILocation[];

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

export async function getLocations(params?: GetLocationsParams): Promise<GetLocationsResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.page && params?.limit) {
    queryParams.append('offset', String((params.page - 1) * params.limit));
  }
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const endpoint = `/v1/admin/transport-locations${queryString ? `?${queryString}` : ''}`;
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

export async function getLocationById(id: string | number): Promise<ILocation> {
  const url = getApiUrl(`/v1/admin/transport-locations/${id}`);
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

export async function createLocation(location: Omit<ILocation, 'id'>): Promise<ILocation> {
  const url = getApiUrl('/v1/admin/transport-locations');
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(location),
  });
  
  if (!response.ok) {
    const errorData = await parseApiErrorResponse(response);
    throw errorData;
  }
  
  return response.json();
}

export async function updateLocation(id: string | number, location: Partial<Omit<ILocation, 'id'>>): Promise<ILocation> {
  const url = getApiUrl('/v1/admin/transport-locations');
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ ...location, id }),
  });
  
  if (!response.ok) {
    const errorData = await parseApiErrorResponse(response);
    throw errorData;
  }
  
  if (response.status === 204) {
    return { ...location, id } as ILocation;
  }
  
  return response.json();
}

export async function deleteLocation(id: string | number): Promise<void> {
  const url = getApiUrl(`/v1/admin/transport-locations/${id}`);
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

