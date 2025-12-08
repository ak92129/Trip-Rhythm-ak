import { Link, Outlet } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

export function Layout() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <Plane className="w-8 h-8 text-sky-600" />
            <h1 className="text-2xl font-bold text-gray-900">TripRhythm</h1>
          </Link>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
