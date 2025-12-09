import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, Sparkles, Download, Loader2 } from 'lucide-react';
import { generateGuestItinerary, GuestItinerary } from '../lib/guest-actions';
import { generateItineraryPDF } from '../lib/pdf-generator';
import { parseCityInput, geocodeCities } from '../lib/geocoding';
import { CityChip } from '../components/CityChip';
import type { TripFormData, TravelStyle, WalkingTolerance, DayPlan } from '../types';
import toast from 'react-hot-toast';

export function GuestItineraryPage() {
  const [loading, setLoading] = useState(false);
  const [geocoding, setGeocoding] = useState(false);
  const [generatedItinerary, setGeneratedItinerary] = useState<GuestItinerary | null>(null);
  const [downloadingPDF, setDownloadingPDF] = useState(false);
  const [hasGenerated, setHasGenerated] = useState(false);

  const [formData, setFormData] = useState<TripFormData>({
    destination: '',
    start_date: '',
    days: 5,
    travel_style: 'balanced' as TravelStyle,
    walking_tolerance: 'medium' as WalkingTolerance,
    wake_time: '08:00',
    sleep_time: '22:00',
    must_see_places: '',
    consider_weather: true,
    cities: [],
  });

  useEffect(() => {
    const generated = sessionStorage.getItem('guest_itinerary_generated');
    if (generated === 'true') {
      setHasGenerated(true);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (hasGenerated) {
      toast.error('You can only generate one itinerary per session. Create an account for unlimited trips!');
      return;
    }

    if (!formData.destination || !formData.start_date) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!formData.cities || formData.cities.length === 0) {
      toast.error('Please add at least one city');
      return;
    }

    setLoading(true);

    try {
      const itinerary = await generateGuestItinerary(formData);
      setGeneratedItinerary(itinerary);
      sessionStorage.setItem('guest_itinerary_generated', 'true');
      setHasGenerated(true);
      toast.success('Itinerary generated successfully!');
    } catch (error) {
      toast.error(error instanceof Error ? error.message : 'Failed to generate itinerary');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadPDF = async () => {
    if (!generatedItinerary) return;

    setDownloadingPDF(true);
    try {
      await generateItineraryPDF(generatedItinerary.tripData, generatedItinerary.dayPlans);
      toast.success('PDF downloaded successfully!');
    } catch (error) {
      toast.error('Failed to generate PDF');
      console.error(error);
    } finally {
      setDownloadingPDF(false);
    }
  };

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'days' ? parseInt(value) : value,
    }));
  };

  const handleCityInputBlur = async () => {
    const cityNames = parseCityInput(formData.destination);
    if (cityNames.length === 0) {
      setFormData((prev) => ({ ...prev, cities: [] }));
      return;
    }

    setGeocoding(true);
    try {
      const geocodedCities = await geocodeCities(cityNames);

      if (geocodedCities.length === 0) {
        toast.error('Could not find any of the cities entered');
        setFormData((prev) => ({ ...prev, cities: [] }));
      } else if (geocodedCities.length < cityNames.length) {
        toast.error(`Found ${geocodedCities.length} of ${cityNames.length} cities`);
        setFormData((prev) => ({ ...prev, cities: geocodedCities }));
      } else {
        setFormData((prev) => ({ ...prev, cities: geocodedCities }));
      }
    } catch (error) {
      toast.error('Failed to geocode cities');
      console.error(error);
    } finally {
      setGeocoding(false);
    }
  };

  const handleRemoveCity = (index: number) => {
    setFormData((prev) => ({
      ...prev,
      cities: prev.cities?.filter((_, i) => i !== index) || [],
    }));

    const remainingCityNames = (formData.cities || [])
      .filter((_, i) => i !== index)
      .map((city) => city.name)
      .join(', ');

    setFormData((prev) => ({
      ...prev,
      destination: remainingCityNames,
    }));
  };

  if (generatedItinerary) {
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-3xl font-bold text-gray-900">Your Guest Itinerary</h1>
            <button
              onClick={handleDownloadPDF}
              disabled={downloadingPDF}
              className="flex items-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50"
            >
              {downloadingPDF ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Generating PDF...
                </>
              ) : (
                <>
                  <Download className="w-5 h-5" />
                  Download PDF
                </>
              )}
            </button>
          </div>

          <div className="bg-sky-50 border border-sky-200 rounded-lg p-6 mb-6">
            <p className="text-sky-900 font-medium mb-2">
              This is a temporary, unsaved itinerary
            </p>
            <p className="text-sky-800 mb-4">
              Create a free account to save multiple trips, make adjustments, and access your itineraries anywhere!
            </p>
            <div className="flex gap-3">
              <Link
                to="/signup"
                className="px-6 py-2 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
              >
                Create Free Account
              </Link>
              <Link
                to="/login"
                className="px-6 py-2 bg-white text-sky-600 border border-sky-600 rounded-lg font-semibold hover:bg-sky-50 transition-colors"
              >
                Sign In
              </Link>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Trip Details</h2>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Destination:</span>
                <p className="text-gray-900">{generatedItinerary.tripData.destination}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Start Date:</span>
                <p className="text-gray-900">{generatedItinerary.tripData.start_date}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Duration:</span>
                <p className="text-gray-900">{generatedItinerary.tripData.days} days</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Travel Style:</span>
                <p className="text-gray-900">{generatedItinerary.tripData.travel_style}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          {generatedItinerary.dayPlans.map((day, index) => (
            <DayCard key={index} day={day} dayNumber={index + 1} />
          ))}
        </div>

        <div className="mt-8 bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-3">Want to save this itinerary?</h2>
          <p className="text-gray-700 mb-6">
            Create a free account to save, edit, and manage multiple trips!
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
          >
            Create Free Account
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>

      <div className="bg-white rounded-2xl shadow-xl p-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Try TripRhythm</h1>
          <p className="text-gray-600">Generate a one-time itinerary without an account</p>
          <p className="text-sm text-sky-600 mt-2">
            Note: Guest itineraries are not saved. Create an account to save multiple trips!
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="destination" className="block text-sm font-medium text-gray-700 mb-2">
              Destination Cities
            </label>
            <input
              type="text"
              id="destination"
              name="destination"
              value={formData.destination}
              onChange={handleChange}
              onBlur={handleCityInputBlur}
              placeholder="e.g., Paris, Rome, Barcelona"
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
              required
              disabled={loading || hasGenerated}
            />
            <p className="mt-2 text-sm text-gray-600">
              Enter one or more cities separated by commas
            </p>

            {geocoding && (
              <div className="mt-3 flex items-center gap-2 text-sm text-sky-600">
                <Loader2 className="w-4 h-4 animate-spin" />
                Finding cities...
              </div>
            )}

            {formData.cities && formData.cities.length > 0 && (
              <div className="mt-3 flex flex-wrap gap-2">
                {formData.cities.map((city, index) => (
                  <CityChip
                    key={index}
                    city={city}
                    onRemove={() => handleRemoveCity(index)}
                    disabled={loading || hasGenerated}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="start_date" className="block text-sm font-medium text-gray-700 mb-2">
                Start Date
              </label>
              <input
                type="date"
                id="start_date"
                name="start_date"
                value={formData.start_date}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
                disabled={loading || hasGenerated}
              />
            </div>

            <div>
              <label htmlFor="days" className="block text-sm font-medium text-gray-700 mb-2">
                Number of Days
              </label>
              <input
                type="number"
                id="days"
                name="days"
                value={formData.days}
                onChange={handleChange}
                min="1"
                max="14"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                required
                disabled={loading || hasGenerated}
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="travel_style" className="block text-sm font-medium text-gray-700 mb-2">
                Travel Style
              </label>
              <select
                id="travel_style"
                name="travel_style"
                value={formData.travel_style}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                disabled={loading || hasGenerated}
              >
                <option value="chill">Chill</option>
                <option value="balanced">Balanced</option>
                <option value="intense">Intense</option>
              </select>
            </div>

            <div>
              <label htmlFor="walking_tolerance" className="block text-sm font-medium text-gray-700 mb-2">
                Walking Tolerance
              </label>
              <select
                id="walking_tolerance"
                name="walking_tolerance"
                value={formData.walking_tolerance}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                disabled={loading || hasGenerated}
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label htmlFor="wake_time" className="block text-sm font-medium text-gray-700 mb-2">
                Wake Time
              </label>
              <input
                type="time"
                id="wake_time"
                name="wake_time"
                value={formData.wake_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                disabled={loading || hasGenerated}
              />
            </div>

            <div>
              <label htmlFor="sleep_time" className="block text-sm font-medium text-gray-700 mb-2">
                Sleep Time
              </label>
              <input
                type="time"
                id="sleep_time"
                name="sleep_time"
                value={formData.sleep_time}
                onChange={handleChange}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent"
                disabled={loading || hasGenerated}
              />
            </div>
          </div>

          <div>
            <label htmlFor="must_see_places" className="block text-sm font-medium text-gray-700 mb-2">
              Must-See Places (Optional)
            </label>
            <textarea
              id="must_see_places"
              name="must_see_places"
              value={formData.must_see_places}
              onChange={handleChange}
              placeholder="List any specific attractions or experiences you don't want to miss"
              rows={3}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent resize-none"
              disabled={loading || hasGenerated}
            />
          </div>

          <button
            type="submit"
            disabled={loading || hasGenerated || !formData.cities || formData.cities.length === 0}
            className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Generating your itinerary...
              </>
            ) : hasGenerated ? (
              <>One itinerary per session (Create account for unlimited)</>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Itinerary
              </>
            )}
          </button>
        </form>

        {!loading && !generatedItinerary && (
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-700 text-center">
              Want unlimited trips and the ability to save your itineraries?{' '}
              <Link to="/signup" className="text-sky-600 hover:text-sky-700 font-semibold">
                Create a free account
              </Link>
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

function DayCard({ day, dayNumber }: { day: DayPlan; dayNumber: number }) {
  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="mb-4">
        <h3 className="text-xl font-bold text-gray-900">
          Day {dayNumber} - {day.date}
        </h3>
        <p className="text-gray-600 mt-2">{day.summary}</p>
      </div>

      <div className="space-y-4">
        {day.activities.map((activity, index) => (
          <div key={index} className="border-l-4 border-sky-500 pl-4 py-2">
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-sm font-semibold text-sky-600">{activity.time}</span>
                  <span className="text-sm px-2 py-1 bg-gray-100 text-gray-700 rounded">
                    {activity.effortLevel} effort
                  </span>
                </div>
                <h4 className="font-semibold text-gray-900">{activity.name}</h4>
                <p className="text-sm text-gray-600 mt-1">{activity.description}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
