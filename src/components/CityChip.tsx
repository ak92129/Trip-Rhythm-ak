import { X } from 'lucide-react';

interface CityChipProps {
  city: string;
  country: string;
  onRemove?: () => void;
  className?: string;
}

export function CityChip({ city, country, onRemove, className = '' }: CityChipProps) {
  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1.5 bg-sky-100 text-sky-800 rounded-full text-sm font-medium ${className}`}
    >
      <span>
        {city}, {country}
      </span>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className="hover:bg-sky-200 rounded-full p-0.5 transition-colors"
          aria-label={`Remove ${city}`}
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
