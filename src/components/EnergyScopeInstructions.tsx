import { ChevronDown, ChevronUp } from 'lucide-react';
import { useState } from 'react';

export function EnergyScopeInstructions() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-sky-50 border border-sky-200 rounded-lg p-4 mb-6">
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full flex items-center justify-between hover:opacity-75 transition-opacity"
      >
        <h3 className="font-semibold text-gray-900">How to adjust energy</h3>
        {isExpanded ? (
          <ChevronUp className="w-5 h-5 text-gray-600" />
        ) : (
          <ChevronDown className="w-5 h-5 text-gray-600" />
        )}
      </button>

      {isExpanded && (
        <div className="mt-4 space-y-3 pt-4 border-t border-sky-200">
          <div className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-200 text-sky-900 font-semibold text-sm">
              1
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Tap a day in your itinerary
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Select the day you want to adjust
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-200 text-sky-900 font-semibold text-sm">
              2
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Choose how you feel
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Select Feels Too Tiring, I've More Energy, or I Am Game
              </p>
            </div>
          </div>

          <div className="flex gap-3">
            <div className="flex-shrink-0 flex items-center justify-center w-6 h-6 rounded-full bg-sky-200 text-sky-900 font-semibold text-sm">
              3
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">
                Choose the scope
              </p>
              <p className="text-xs text-gray-600 mt-1">
                Apply to just that day or the rest of your trip
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
