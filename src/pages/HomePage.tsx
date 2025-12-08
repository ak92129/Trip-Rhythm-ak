import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, MapPin, Calendar, Footprints } from 'lucide-react';
import { getRecentTrips } from '../lib/db';
import type { Trip } from '../types';
import toast from 'react-hot-toast';

export function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadTrips();
  }, []);

  async function loadTrips() {
    try {
      const data = await getRecentTrips(20);
      setTrips(data);
    } catch (error) {
      toast.error('Failed to load trips');
      console.error(error);
    } finally {
      setLoading(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Trips</h2>
          <p className="text-gray-600 mt-1">Plan your next adventure with AI-powered itineraries</p>
        </div>
        <Link
          to="/new-trip"
          className="flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors shadow-md hover:shadow-lg"
        >
          <Plus className="w-5 h-5" />
          Plan New Trip
        </Link>
      </div>

      {trips.length === 0 ? (
        <div className="text-center py-16">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-sky-100 rounded-full mb-4">
            <MapPin className="w-10 h-10 text-sky-600" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No trips yet</h3>
          <p className="text-gray-600 mb-6">Start planning your first adventure!</p>
          <Link
            to="/new-trip"
            className="inline-flex items-center gap-2 bg-sky-600 text-white px-6 py-3 rounded-lg hover:bg-sky-700 transition-colors"
          >
            <Plus className="w-5 h-5" />
            Create Your First Trip
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips.map((trip) => (
            <TripCard key={trip.id} trip={trip} />
          ))}
        </div>
      )}
    </div>
  );
}

function TripCard({ trip }: { trip: Trip }) {
  const startDate = new Date(trip.start_date);
  const endDate = new Date(startDate);
  endDate.setDate(endDate.getDate() + trip.days - 1);

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const displayDestination = trip.cities && trip.cities.length > 0
    ? trip.cities.map(city => `${city.name}, ${city.country}`).join(' • ')
    : trip.destination;

  return (
    <Link
      to={`/trip/${trip.id}`}
      className="block bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-200 overflow-hidden border border-gray-100 hover:border-sky-200"
    >
      <div className="p-6">
        <div className="flex items-start justify-between mb-3">
          <div className="flex items-center gap-2">
            <MapPin className="w-5 h-5 text-sky-600 flex-shrink-0" />
            <h3 className="text-lg font-bold text-gray-900 line-clamp-2">{displayDestination}</h3>
          </div>
        </div>

        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-600">
            <Calendar className="w-4 h-4" />
            <span className="text-sm">
              {formatDate(startDate)} - {formatDate(endDate)}
            </span>
          </div>
          <div className="flex items-center gap-2 text-gray-600">
            <Footprints className="w-4 h-4" />
            <span className="text-sm">{trip.days} days</span>
          </div>
        </div>

        <div className="flex gap-2">
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-sky-100 text-sky-800 capitalize">
            {trip.travel_style}
          </span>
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800 capitalize">
            {trip.walking_tolerance} walking
          </span>
        </div>
      </div>
    </Link>
  );
}
