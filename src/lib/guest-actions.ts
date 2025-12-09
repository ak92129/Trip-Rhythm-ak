import { getAIProvider } from './ai/provider-factory';
import { fetchDailyWeather } from './weather';
import type { TripFormData, DayPlan, WeatherData } from '../types';

export interface GuestItinerary {
  tripData: TripFormData;
  dayPlans: DayPlan[];
}

export async function generateGuestItinerary(tripData: TripFormData): Promise<GuestItinerary> {
  try {
    let weatherData: WeatherData[] | null = null;

    if (tripData.consider_weather !== false && tripData.cities && tripData.cities.length > 0) {
      try {
        const primaryCity = tripData.cities[0];
        weatherData = await fetchDailyWeather(
          primaryCity.latitude,
          primaryCity.longitude,
          tripData.start_date,
          tripData.days
        );
      } catch (error) {
        console.error('Failed to fetch weather data:', error);
      }
    }

    const aiProvider = getAIProvider();
    const dayPlans = await aiProvider.generateItinerary(tripData, weatherData);

    return {
      tripData,
      dayPlans,
    };
  } catch (error) {
    console.error('Error generating guest itinerary:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate itinerary');
  }
}
