import type { TravelMode } from '../types';

/**
 * Distance threshold (in km) beyond which only flights are permitted.
 * Distances > this threshold require air travel.
 */
export const DISTANCE_THRESHOLD_KM = 400;

/**
 * Travel speed assumptions for each mode (in km/h).
 * Used to estimate travel duration based on distance.
 *
 * How to modify:
 * - Increase speed values to make travel times shorter
 * - Decrease speed values to make travel times longer
 * - Be realistic: trains ~120 km/h, cars ~80 km/h, flights ~800 km/h
 */
export const MODE_SPEEDS: Record<TravelMode, number> = {
  flight: 800,
  train: 120,
  car: 80,
  bus: 60,
};

/**
 * Time overhead (in minutes) added to each travel mode.
 * This accounts for preparation, boarding, station arrival, etc.
 *
 * How to modify:
 * - Flights: increase if you want to account for more security time
 * - Train: adjust for platform time
 * - Car/Bus: adjust for parking/boarding
 */
export const MODE_OVERHEAD_MINUTES: Record<TravelMode, number> = {
  flight: 120, // +2 hours for check-in, security, boarding, taxi
  train: 30,   // +30 minutes for station, boarding
  car: 10,     // +10 minutes for parking
  bus: 15,     // +15 minutes for station, boarding
};

/**
 * Distance thresholds (in km) for filtering unsuitable modes.
 *
 * How to modify:
 * - Increase thresholds to allow more modes for longer distances
 * - Decrease thresholds to filter out modes earlier
 */
export const DISTANCE_FILTERS = {
  minDistanceForFlight: 100,  // Don't recommend flight for distances < 100 km
  maxDistanceForCar: 1500,    // Don't recommend car for distances > 1500 km
  maxDistanceForBus: 1500,    // Don't recommend bus for distances > 1500 km
};

/**
 * Smart distance ranges for mode recommendations.
 * Lower cost modes are preferred when travel time is similar.
 *
 * How to modify these ranges:
 * - Adjust thresholds to prefer different modes
 * - For "eco-friendly" preference, add weights to train/bus
 * - For "speed-focused", add weights to flight
 */
export const DISTANCE_RANGES = {
  veryShort: { min: 0, max: 50 },      // Car preferred (lowest cost, direct)
  short: { min: 50, max: 150 },        // Car/train options
  medium: { min: 150, max: 400 },      // Train/car, evaluate by time
  long: { min: 400, max: Infinity },   // Flight required
};

/**
 * Time efficiency tolerance (in minutes).
 * Modes within this margin of the fastest option are considered equal.
 * Used when selecting between multiple viable modes.
 *
 * Example: If fastest is 120 min and tolerance is 30 min,
 * any mode taking 120-150 min is considered equally efficient.
 */
export const TIME_EFFICIENCY_TOLERANCE = 30;
