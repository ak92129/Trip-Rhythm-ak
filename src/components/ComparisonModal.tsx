import { X, Check, Battery, Clock } from 'lucide-react';
import type { DayPlan, EffortLevel } from '../types';

interface ComparisonModalProps {
  originalDay: DayPlan;
  adjustedDay: DayPlan;
  onAccept: () => void;
  onCancel: () => void;
}

export function ComparisonModal({
  originalDay,
  adjustedDay,
  onAccept,
  onCancel,
}: ComparisonModalProps) {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">Day Adjustment Comparison</h2>
          <button
            onClick={onCancel}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-red-100 text-red-800 rounded-full text-sm font-medium">
                  Original Day
                </span>
              </div>
              <DayComparison day={originalDay} />
            </div>

            <div>
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-green-100 text-green-800 rounded-full text-sm font-medium">
                  Adjusted Day (Less Tiring)
                </span>
              </div>
              <DayComparison day={adjustedDay} highlight />
            </div>
          </div>
        </div>

        <div className="flex gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            onClick={onCancel}
            className="flex-1 px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-100 transition-colors font-medium text-gray-700"
          >
            Keep Original
          </button>
          <button
            onClick={onAccept}
            className="flex-1 flex items-center justify-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg font-medium"
          >
            <Check className="w-5 h-5" />
            Accept Changes
          </button>
        </div>
      </div>
    </div>
  );
}

function DayComparison({ day, highlight }: { day: DayPlan; highlight?: boolean }) {
  return (
    <div className={`rounded-lg border-2 p-4 ${highlight ? 'border-green-300 bg-green-50' : 'border-gray-200 bg-white'}`}>
      <p className="text-gray-700 mb-4 font-medium">{day.summary}</p>

      <div className="space-y-3">
        {day.activities.map((activity, idx) => (
          <ActivityComparison key={idx} activity={activity} />
        ))}
      </div>
    </div>
  );
}

function ActivityComparison({
  activity,
}: {
  activity: { time: string; name: string; description: string; effortLevel: EffortLevel };
}) {
  const effortColors = {
    low: 'bg-green-100 text-green-800 border-green-200',
    medium: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="p-3 bg-white rounded-lg border border-gray-200">
      <div className="flex items-start justify-between mb-2">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-1">
            <Clock className="w-3 h-3 text-gray-400" />
            <span className="text-xs font-medium text-gray-500">{activity.time}</span>
          </div>
          <h4 className="font-semibold text-gray-900 text-sm">{activity.name}</h4>
        </div>
        <div
          className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${
            effortColors[activity.effortLevel]
          }`}
        >
          <Battery className="w-3 h-3" />
          {activity.effortLevel}
        </div>
      </div>
      <p className="text-gray-600 text-xs">{activity.description}</p>
    </div>
  );
}
