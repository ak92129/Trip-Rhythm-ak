import { City, TravelLeg, TravelMode, TravelModeOption, RestrictionType } from '../types';
import { isCrossContinental, getContinent } from './continents';
import {
  DISTANCE_THRESHOLD_KM,
  MODE_SPEEDS,
  MODE_OVERHEAD_MINUTES,
  DISTANCE_FILTERS,
  DISTANCE_RANGES,
  TIME_EFFICIENCY_TOLERANCE,
} from './travel-config';

export function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371;
  const dLat = toRadians(lat2 - lat1);
  const dLon = toRadians(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(lat1)) *
      Math.cos(toRadians(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance);
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}

/**
 * Determine the restriction type for a travel leg based on distance and continents.
 */
export function determineRestrictionType(
  distance: number,
  countryCode1: string | null,
  countryCode2: string | null
): RestrictionType {
  // Check cross-continental first (takes precedence)
  if (isCrossContinental(countryCode1, countryCode2)) {
    return 'cross-continent';
  }

  // Then check distance threshold
  if (distance > DISTANCE_THRESHOLD_KM) {
    return 'distance';
  }

  return null;
}

/**
 * Calculate travel time for a given distance and mode.
 * Includes overhead time (check-in, boarding, etc.)
 */
export function estimateTravelTime(distance: number, mode: TravelMode): number {
  const speed = MODE_SPEEDS[mode];
  const overhead = MODE_OVERHEAD_MINUTES[mode];

  const travelTimeHours = distance / speed;
  const travelTimeMinutes = travelTimeHours * 60;

  return Math.round(travelTimeMinutes + overhead);
}

/**
 * Recommend the best travel mode based on distance and continental boundaries.
 * Applies business rules:
 * - Cross-continental or > 400 km: flight required
 * - < 50 km: prefer car
 * - 50-150 km: prefer car or train
 * - 150-400 km: evaluate by time efficiency
 */
export function recommendTravelMode(
  distance: number,
  countryCode1: string | null,
  countryCode2: string | null
): TravelMode {
  // Cross-continental requires flight
  if (isCrossContinental(countryCode1, countryCode2)) {
    return 'flight';
  }

  // Distance > threshold requires flight
  if (distance > DISTANCE_THRESHOLD_KM) {
    return 'flight';
  }

  // Very short distances: prefer car
  if (distance < 50) {
    return 'car';
  }

  // Short distances: prefer car
  if (distance < 100) {
    return 'car';
  }

  // Medium distances: evaluate by time efficiency
  if (distance < 400) {
    // Calculate times for realistic modes
    const trainTime = estimateTravelTime(distance, 'train');
    const carTime = estimateTravelTime(distance, 'car');

    // Train is typically more efficient for medium distances
    return trainTime < carTime + TIME_EFFICIENCY_TOLERANCE ? 'train' : 'car';
  }

  // Long distances: flight
  return 'flight';
}

/**
 * Get all viable travel options for a journey.
 * Marks modes as allowed/not allowed based on restrictions.
 * Marks one option as recommended based on efficiency.
 */
export function getTravelOptions(
  distance: number,
  countryCode1: string | null,
  countryCode2: string | null
): TravelModeOption[] {
  const restrictionType = determineRestrictionType(distance, countryCode1, countryCode2);
  const recommendedMode = recommendTravelMode(distance, countryCode1, countryCode2);
  const modes: TravelMode[] = ['flight', 'train', 'car', 'bus'];

  // If restricted to flight only, mark all other modes as not allowed
  if (restrictionType === 'distance') {
    return modes.map((mode) => ({
      mode,
      duration: estimateTravelTime(distance, mode),
      isRecommended: mode === 'flight',
      isAllowed: mode === 'flight',
      restrictionReason: mode !== 'flight' ? `Distance exceeds ${DISTANCE_THRESHOLD_KM} km - flight required` : undefined,
    }));
  }

  if (restrictionType === 'cross-continent') {
    return modes.map((mode) => ({
      mode,
      duration: estimateTravelTime(distance, mode),
      isRecommended: mode === 'flight',
      isAllowed: mode === 'flight',
      restrictionReason: mode !== 'flight' ? 'Cross-continental travel requires flight' : undefined,
    }));
  }

  // No restriction: filter based on distance and provide multiple options
  const durations: Record<TravelMode, number> = {
    flight: estimateTravelTime(distance, 'flight'),
    train: estimateTravelTime(distance, 'train'),
    car: estimateTravelTime(distance, 'car'),
    bus: estimateTravelTime(distance, 'bus'),
  };

  const fastestTime = Math.min(...Object.values(durations));

  const options: TravelModeOption[] = modes.map((mode) => {
    let isAllowed = true;
    let restrictionReason: string | undefined;

    // Filter based on distance
    if (distance < DISTANCE_FILTERS.minDistanceForFlight && mode === 'flight') {
      isAllowed = false;
      restrictionReason = `Too short for flight (< ${DISTANCE_FILTERS.minDistanceForFlight} km)`;
    }
    if (distance > DISTANCE_FILTERS.maxDistanceForCar && mode === 'car') {
      isAllowed = false;
      restrictionReason = `Too long for car (> ${DISTANCE_FILTERS.maxDistanceForCar} km)`;
    }
    if (distance > DISTANCE_FILTERS.maxDistanceForBus && mode === 'bus') {
      isAllowed = false;
      restrictionReason = `Too long for bus (> ${DISTANCE_FILTERS.maxDistanceForBus} km)`;
    }

    return {
      mode,
      duration: durations[mode],
      isRecommended: isAllowed && mode === recommendedMode,
      isAllowed,
      restrictionReason,
    };
  });

  return options.sort((a, b) => {
    // Sort: recommended first, then allowed, then by duration
    if (a.isRecommended && !b.isRecommended) return -1;
    if (!a.isRecommended && b.isRecommended) return 1;
    if (a.isAllowed && !b.isAllowed) return -1;
    if (!a.isAllowed && b.isAllowed) return 1;
    return a.duration - b.duration;
  });
}

export function calculateTravelLegs(cities: City[], originCity?: City | null): TravelLeg[] {
  const legs: TravelLeg[] = [];

  if (!cities || cities.length === 0) {
    return legs;
  }

  const allCities = originCity ? [originCity, ...cities] : cities;

  for (let i = 0; i < allCities.length - 1; i++) {
    const fromCity = allCities[i];
    const toCity = allCities[i + 1];

    const distance = calculateDistance(
      fromCity.latitude,
      fromCity.longitude,
      toCity.latitude,
      toCity.longitude
    );

    const options = getTravelOptions(
      distance,
      fromCity.country_code,
      toCity.country_code
    );

    const isCrossContinent = isCrossContinental(fromCity.country_code, toCity.country_code);
    const restrictionType = determineRestrictionType(
      distance,
      fromCity.country_code,
      toCity.country_code
    );

    legs.push({
      fromCity,
      toCity,
      distance,
      options,
      isCrossContinental: isCrossContinent,
      restrictionType,
    });
  }

  return legs;
}

export function formatDuration(minutes: number): string {
  if (minutes < 60) {
    return `${minutes}m`;
  }
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (mins === 0) {
    return `${hours}h`;
  }
  return `${hours}h ${mins}m`;
}

/**
 * Assign travel legs to specific days in a trip.
 * Distributes travel legs evenly across the trip duration.
 *
 * For a multi-city trip:
 * - The first leg starts on a calculated day based on total trip length
 * - Subsequent legs are spaced out to allow time in each city
 *
 * @param travelLegs Array of travel legs to assign
 * @param totalDays Total number of days in the trip
 * @returns Map of day index to travel legs occurring on that day
 */
export function assignTravelLegsToDays(
  travelLegs: TravelLeg[],
  totalDays: number
): Map<number, TravelLeg[]> {
  const dayAssignments = new Map<number, TravelLeg[]>();

  if (travelLegs.length === 0) {
    return dayAssignments;
  }

  // Distribute travel legs evenly across the trip
  // Allocate roughly equal days per leg
  const daysPerLeg = Math.floor(totalDays / travelLegs.length);

  travelLegs.forEach((leg, index) => {
    // Calculate the day this leg should occur
    // Leave some days before the first leg for arrival city activities
    const dayIndex = Math.min(
      index === 0 ? Math.max(0, daysPerLeg - 2) : index * daysPerLeg,
      totalDays - 2
    );

    if (!dayAssignments.has(dayIndex)) {
      dayAssignments.set(dayIndex, []);
    }
    dayAssignments.get(dayIndex)!.push(leg);
  });

  return dayAssignments;
}
