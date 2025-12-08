import { Plane, Train, Car, Bus, ArrowRight, AlertCircle } from 'lucide-react';
import type { TravelItem as TravelItemType, TravelMode } from '../types';
import { formatDuration } from '../lib/travel';

interface TravelItemProps {
  item: TravelItemType;
}

const modeIcons: Record<TravelMode, typeof Plane> = {
  flight: Plane,
  train: Train,
  car: Car,
  bus: Bus,
};

const modeColors: Record<TravelMode, string> = {
  flight: 'bg-sky-100 text-sky-700',
  train: 'bg-emerald-100 text-emerald-700',
  car: 'bg-amber-100 text-amber-700',
  bus: 'bg-orange-100 text-orange-700',
};

const modeLabels: Record<TravelMode, string> = {
  flight: 'Flight',
  train: 'Train',
  car: 'Car',
  bus: 'Bus',
};

export function TravelItem({ item }: TravelItemProps) {
  const recommendedOption = item.options.find((opt) => opt.isRecommended && opt.isAllowed);
  const mode = recommendedOption?.mode || 'flight';
  const ModeIcon = modeIcons[mode];
  const colorClass = modeColors[mode];

  const showRestrictionBadge = item.restrictionType !== null;
  const restrictionLabel =
    item.restrictionType === 'cross-continent'
      ? 'Cross-Continental'
      : item.restrictionType === 'distance'
        ? `Distance > 400km`
        : null;

  return (
    <div className="flex gap-4 p-4 bg-blue-50 rounded-lg border border-blue-100">
      <div className="flex-shrink-0">
        <div className={`w-16 h-16 ${colorClass} rounded-lg flex items-center justify-center`}>
          <ModeIcon className="w-6 h-6" />
        </div>
      </div>

      <div className="flex-1">
        <div className="flex items-start justify-between mb-3">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs font-medium text-gray-500 uppercase">Travel</span>
              {showRestrictionBadge && (
                <span className="inline-flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded-full text-xs font-medium">
                  <AlertCircle className="w-3 h-3" />
                  {restrictionLabel}
                </span>
              )}
            </div>
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold text-gray-900">{item.fromCity.name}</span>
              <ArrowRight className="w-4 h-4 text-gray-400" />
              <span className="font-semibold text-gray-900">{item.toCity.name}</span>
            </div>
          </div>
          <div className="text-right">
            <div className="text-sm font-semibold text-gray-700">{formatDuration(item.duration)}</div>
            <div className="text-xs text-gray-500">{item.distance} km</div>
          </div>
        </div>

        {item.estimatedDepartureTime && (
          <div className="text-sm text-gray-600 mb-2">
            {item.estimatedDepartureTime} → {item.estimatedArrivalTime}
          </div>
        )}

        <div className="flex flex-wrap gap-2">
          {item.options.map((option) => {
            if (!option.isAllowed) return null;

            return (
              <div
                key={option.mode}
                className={`inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium ${
                  option.isRecommended
                    ? `${modeColors[option.mode]} border border-current`
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                <span>{modeLabels[option.mode]}</span>
                <span className="text-xs opacity-75">{formatDuration(option.duration)}</span>
              </div>
            );
          })}
        </div>

        {item.restrictionReason && (
          <div className="mt-2 text-xs text-gray-600">
            <span className="font-medium">Note:</span> {item.restrictionReason}
          </div>
        )}
      </div>
    </div>
  );
}
