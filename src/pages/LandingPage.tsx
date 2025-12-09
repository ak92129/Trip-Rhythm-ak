import { Link, Navigate } from 'react-router-dom';
import { Plane, MapPin, Calendar, Zap, Clock, Users } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LandingPage() {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (user) {
    return <Navigate to="/home" replace />;
  }

  return (
    <div className="min-h-[calc(100vh-200px)]">
      <div className="max-w-6xl mx-auto px-4 py-16 sm:py-24">
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <Plane className="w-20 h-20 text-sky-600" />
          </div>
          <h1 className="text-5xl sm:text-6xl font-bold text-gray-900 mb-6">
            Welcome to TripRhythm
          </h1>
          <p className="text-xl sm:text-2xl text-gray-600 mb-12 max-w-3xl mx-auto">
            AI-powered travel itineraries tailored to your rhythm. Plan your perfect trip with personalized daily schedules, activity suggestions, and energy management.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <Link
              to="/guest-itinerary"
              className="w-full sm:w-auto px-8 py-4 bg-white text-sky-600 border-2 border-sky-600 rounded-lg font-semibold hover:bg-sky-50 transition-all transform hover:scale-105 shadow-lg"
            >
              Try Without an Account
            </Link>
            <Link
              to="/signup"
              className="w-full sm:w-auto px-8 py-4 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-all transform hover:scale-105 shadow-lg"
            >
              Create Free Account
            </Link>
          </div>

          <div className="text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold">
              Sign in
            </Link>
          </div>
        </div>

        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Energy-Aware Planning</h3>
            <p className="text-gray-600">
              Intelligent itineraries that adapt to your energy levels, ensuring you never burn out during your trip.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
              <Clock className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Your Schedule, Your Way</h3>
            <p className="text-gray-600">
              Set your wake and sleep times, walking tolerance, and travel style. We'll build the perfect day around you.
            </p>
          </div>

          <div className="bg-white rounded-lg p-8 shadow-md hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-sky-100 rounded-lg flex items-center justify-center mb-4">
              <MapPin className="w-6 h-6 text-sky-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Smart Recommendations</h3>
            <p className="text-gray-600">
              Get AI-powered suggestions for activities, restaurants, and attractions that match your preferences.
            </p>
          </div>
        </div>

        <div className="bg-gradient-to-r from-sky-50 to-blue-50 rounded-2xl p-8 sm:p-12 text-center shadow-lg">
          <Calendar className="w-16 h-16 text-sky-600 mx-auto mb-6" />
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Ready to Plan Your Next Adventure?
          </h2>
          <p className="text-lg text-gray-600 mb-8 max-w-2xl mx-auto">
            Join thousands of travelers who trust TripRhythm to create unforgettable journeys. Start planning in minutes.
          </p>
          <Link
            to="/signup"
            className="inline-block px-8 py-4 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-all transform hover:scale-105 shadow-lg"
          >
            Get Started Free
          </Link>
        </div>
      </div>
    </div>
  );
}
