export interface GeocodingResult {
  name: string;
  country: string;
  country_code?: string;
  latitude: number;
  longitude: number;
}

interface OpenMeteoResponse {
  results?: Array<{
    name: string;
    country: string;
    country_code?: string;
    latitude: number;
    longitude: number;
    admin1?: string;
    admin2?: string;
  }>;
  generationtime_ms?: number;
}

export async function geocodeCity(cityName: string): Promise<GeocodingResult | null> {
  try {
    const trimmedCity = cityName.trim();
    if (!trimmedCity) {
      return null;
    }

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
      trimmedCity
    )}&count=1&language=en&format=json`;

    const response = await fetch(url);
    if (!response.ok) {
      console.error(`Geocoding API error: ${response.status}`);
      return null;
    }

    const data: OpenMeteoResponse = await response.json();

    if (!data.results || data.results.length === 0) {
      return null;
    }

    const result = data.results[0];
    return {
      name: result.name,
      country: result.country,
      country_code: result.country_code,
      latitude: result.latitude,
      longitude: result.longitude,
    };
  } catch (error) {
    console.error('Error geocoding city:', error);
    return null;
  }
}

export async function geocodeCities(cityNames: string[]): Promise<GeocodingResult[]> {
  const results = await Promise.all(cityNames.map((city) => geocodeCity(city)));
  return results.filter((result): result is GeocodingResult => result !== null);
}

export function parseCityInput(input: string): string[] {
  return input
    .split(',')
    .map((city) => city.trim())
    .filter((city) => city.length > 0);
}
