import { X } from 'lucide-react';

interface EnergyScopeDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (scope: 'single-day' | 'from-day-onward') => void;
  dateLabel: string;
  cityLabel: string;
}

export function EnergyScopeDialog({
  isOpen,
  onClose,
  onConfirm,
  dateLabel,
  cityLabel,
}: EnergyScopeDialogProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Where should this change apply?</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-2">
            <div className="text-sm text-gray-600">
              <span className="font-medium text-gray-900">{dateLabel}</span>
              <span className="text-gray-600"> – {cityLabel}</span>
            </div>
          </div>

          <div className="space-y-3 pt-4">
            <button
              onClick={() => onConfirm('single-day')}
              className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-amber-400 hover:bg-amber-50 transition-all group"
            >
              <div className="font-semibold text-gray-900 group-hover:text-amber-900">
                Only this day
              </div>
              <div className="text-sm text-gray-600 group-hover:text-amber-800">
                Update activities and pace for just {dateLabel}
              </div>
            </button>

            <button
              onClick={() => onConfirm('from-day-onward')}
              className="w-full p-4 text-left border-2 border-gray-200 rounded-lg hover:border-blue-400 hover:bg-blue-50 transition-all group"
            >
              <div className="font-semibold text-gray-900 group-hover:text-blue-900">
                This day and all following days
              </div>
              <div className="text-sm text-gray-600 group-hover:text-blue-800">
                Apply changes from {dateLabel} through the rest of your trip
              </div>
            </button>
          </div>

          <div className="pt-4 border-t border-gray-200">
            <button
              onClick={onClose}
              className="w-full py-2 text-gray-600 hover:text-gray-900 font-medium transition-colors"
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
