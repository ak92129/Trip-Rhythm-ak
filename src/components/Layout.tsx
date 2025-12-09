import { Link, Outlet, useLocation } from 'react-router-dom';
import { Plane } from 'lucide-react';
import { Toaster } from 'react-hot-toast';
import { useAuth } from '../contexts/AuthContext';
import { UserMenu } from './UserMenu';

export function Layout() {
  const { user } = useAuth();
  const location = useLocation();
  const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset-password'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-50 via-white to-blue-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link to={user ? "/home" : "/"} className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Plane className="w-8 h-8 text-sky-600" />
              <h1 className="text-2xl font-bold text-gray-900">TripRhythm</h1>
            </Link>

            {!isAuthPage && (
              <div>
                {user ? (
                  <UserMenu />
                ) : (
                  <div className="flex items-center gap-3">
                    <Link
                      to="/login"
                      className="px-4 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors"
                    >
                      Sign In
                    </Link>
                    <Link
                      to="/signup"
                      className="px-4 py-2 text-sm font-medium bg-sky-600 text-white rounded-lg hover:bg-sky-700 transition-colors"
                    >
                      Sign Up
                    </Link>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Outlet />
      </main>

      <Toaster position="top-right" />
    </div>
  );
}
