// API endpoints pour les utilisateurs
import type { IUser } from '../model/IUser';

export interface GetUsersParams {
  page?: number;
  limit?: number;
  search?: string;
}

export type GetUsersResponse = IUser[];

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

export async function getUsers(params?: GetUsersParams): Promise<GetUsersResponse> {
  const queryParams = new URLSearchParams();
  
  if (params?.page && params?.limit) {
    queryParams.append('offset', String((params.page - 1) * params.limit));
  }
  if (params?.limit) queryParams.append('limit', String(params.limit));
  if (params?.search) queryParams.append('search', params.search);

  const queryString = queryParams.toString();
  const endpoint = `/v1/admin/users${queryString ? `?${queryString}` : ''}`;
  const url = getApiUrl(endpoint);
  
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function getUserById(id: string | number): Promise<IUser> {
  const url = getApiUrl(`/v1/admin/users/${id}`);
  const response = await fetch(url, {
    method: 'GET',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function createUser(user: Omit<IUser, 'id'>): Promise<IUser> {
  const url = getApiUrl('/v1/admin/users');
  const response = await fetch(url, {
    method: 'POST',
    headers: getHeaders(),
    body: JSON.stringify(user),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function updateUser(id: string | number, user: Partial<Omit<IUser, 'id'>>): Promise<IUser> {
  const url = getApiUrl('/v1/admin/users');
  const response = await fetch(url, {
    method: 'PATCH',
    headers: getHeaders(),
    body: JSON.stringify({ ...user, id }),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  return response.json();
}

export async function deleteUser(id: string | number): Promise<void> {
  const url = getApiUrl(`/v1/admin/users/${id}`);
  const response = await fetch(url, {
    method: 'DELETE',
    headers: getHeaders(),
  });
  
  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }
  
  if (response.status !== 204) {
    await response.json();
  }
}
