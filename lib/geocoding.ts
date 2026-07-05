const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8001';

export type GeocodingResult = {
  displayName: string;
  latitude: number;
  longitude: number;
  venue: string;
  source?: 'google' | 'nominatim' | 'photon';
};

export async function searchLocations(
  query: string,
  limit = 5,
  bias?: { lat: number; lon: number },
): Promise<GeocodingResult[]> {
  const trimmed = query.trim();
  if (!trimmed) return [];

  const params = new URLSearchParams({
    q: trimmed,
    limit: String(limit),
  });

  if (bias) {
    params.set('lat', String(bias.lat));
    params.set('lon', String(bias.lon));
  }

  const response = await fetch(`${API_URL}/geocoding/search?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Location search failed');
  }

  return response.json();
}

export async function reverseGeocode(
  latitude: number,
  longitude: number,
): Promise<GeocodingResult> {
  const params = new URLSearchParams({
    lat: String(latitude),
    lon: String(longitude),
  });

  const response = await fetch(`${API_URL}/geocoding/reverse?${params.toString()}`);
  if (!response.ok) {
    throw new Error('Reverse geocoding failed');
  }

  return response.json();
}