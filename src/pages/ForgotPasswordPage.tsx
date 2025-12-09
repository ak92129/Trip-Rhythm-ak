import { useState, FormEvent } from 'react';
import { Link } from 'react-router-dom';
import { Mail, Loader2, ArrowLeft } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const { resetPassword } = useAuth();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setLoading(true);

    try {
      const { error } = await resetPassword(email);

      if (error) {
        toast.error(error.message);
      } else {
        setEmailSent(true);
        toast.success('Password reset email sent!');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Reset password error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
              <Mail className="w-8 h-8 text-sky-600" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Reset Password
          </h2>
          <p className="text-center text-gray-600 mb-8">
            {emailSent
              ? 'Check your email for reset instructions'
              : 'Enter your email and we\'ll send you reset instructions'}
          </p>

          {emailSent ? (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-green-800 text-sm">
                  We've sent a password reset link to <strong>{email}</strong>. Please check your inbox and follow the instructions to reset your password.
                </p>
              </div>

              <Link
                to="/login"
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
                Back to Sign In
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                  placeholder="you@example.com"
                  disabled={loading}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Mail className="w-5 h-5" />
                    Send Reset Link
                  </>
                )}
              </button>

              <Link
                to="/login"
                className="flex items-center justify-center gap-2 text-gray-600 hover:text-gray-900 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Sign In
              </Link>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
