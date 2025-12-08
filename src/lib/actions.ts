import { createTrip, createItineraryDay, updateItineraryDay, getItinerariesForTrip, getTripById } from './db';
import { getAIProvider } from './ai/provider-factory';
import type { TripFormData, AdjustmentComparison } from '../types';

export async function generateItinerary(tripData: TripFormData): Promise<string> {
  try {
    const trip = await createTrip(tripData);

    const aiProvider = getAIProvider();
    const dayPlans = await aiProvider.generateItinerary(tripData);

    for (let i = 0; i < dayPlans.length; i++) {
      await createItineraryDay(trip.id, i + 1, dayPlans[i]);
    }

    return trip.id;
  } catch (error) {
    console.error('Error generating itinerary:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to generate itinerary');
  }
}

export async function adjustDayForFatigue(
  tripId: string,
  dayIndex: number
): Promise<AdjustmentComparison> {
  try {
    const trip = await getTripById(tripId);
    if (!trip) {
      throw new Error('Trip not found');
    }

    const itineraries = await getItinerariesForTrip(tripId);
    const allDays = itineraries.map((itin) => itin.ai_plan_json);
    const currentDay = allDays[dayIndex - 1];

    if (!currentDay) {
      throw new Error('Day not found');
    }

    const tripContext: TripFormData = {
      destination: trip.destination,
      start_date: trip.start_date,
      days: trip.days,
      travel_style: trip.travel_style,
      walking_tolerance: trip.walking_tolerance,
      wake_time: trip.wake_time,
      sleep_time: trip.sleep_time,
      must_see_places: trip.must_see_places || '',
    };

    const aiProvider = getAIProvider();
    const adjustment = await aiProvider.adjustDayForFatigue(
      currentDay,
      dayIndex,
      allDays,
      tripContext
    );

    return adjustment;
  } catch (error) {
    console.error('Error adjusting day:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to adjust day');
  }
}

export async function saveAdjustedDay(
  tripId: string,
  dayIndex: number,
  adjustedDay: any
): Promise<void> {
  try {
    await updateItineraryDay(tripId, dayIndex, adjustedDay);
  } catch (error) {
    console.error('Error saving adjusted day:', error);
    throw new Error(error instanceof Error ? error.message : 'Failed to save adjusted day');
  }
}
