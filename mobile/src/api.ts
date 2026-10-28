import type { VenueZone, ZoneInput, ZoneStatus } from './types';

// Para el entrenamiento local, Expo web y Serverless Offline comparten equipo.
// En una prueba desde móvil físico, localhost debe cambiar por la IP del ordenador.
export const API_URL = 'http://localhost:3000/dev';

async function request(path: string, method = 'GET', body?: unknown): Promise<unknown> {
  const response = await fetch(API_URL + path, {
    method,
    headers: body === undefined ? undefined : { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body)
  });

  const value: unknown = await response.json();
  if (!response.ok) {
    const message = typeof value === 'object' && value !== null && 'message' in value
      ? String(value.message)
      : response.statusText;
    throw new Error(`HTTP ${response.status}: ${message}`);
  }
  return value;
}

function isVenueZone(value: unknown): value is VenueZone {
  return typeof value === 'object' && value !== null &&
    'id' in value && typeof value.id === 'string' &&
    'name' in value && typeof value.name === 'string' &&
    'capacity' in value && typeof value.capacity === 'number' &&
    'status' in value &&
      (value.status === 'OPEN' || value.status === 'CLOSED' || value.status === 'MAINTENANCE');
}

export async function getZones(): Promise<VenueZone[]> {
  const value = await request('/zones');
  if (!Array.isArray(value) || !value.every(isVenueZone)) {
    throw new Error('La API no devolvió una lista de zonas válida');
  }
  return value;
}

export async function getZone(id: string): Promise<VenueZone> {
  const value = await request(`/zones/${encodeURIComponent(id)}`);
  if (!isVenueZone(value)) throw new Error('La API devolvió una zona no válida');
  return value;
}

export const createZone = (input: ZoneInput) => request('/zones', 'POST', input);
export const replaceZone = (id: string, input: ZoneInput) =>
  request(`/zones/${encodeURIComponent(id)}`, 'PUT', input);
export const updateZone = (id: string, status: ZoneStatus) =>
  request(`/zones/${encodeURIComponent(id)}`, 'PATCH', { status });
export const deleteZone = (id: string) =>
  request(`/zones/${encodeURIComponent(id)}`, 'DELETE');
