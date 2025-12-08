import type { DayPlan, TripFormData } from '../../types';

export interface AIProvider {
  generateItinerary(tripData: TripFormData): Promise<DayPlan[]>;
  adjustDayForFatigue(
    currentDay: DayPlan,
    dayIndex: number,
    allDays: DayPlan[],
    tripContext: TripFormData
  ): Promise<{ originalDay: DayPlan; adjustedDay: DayPlan }>;
}
