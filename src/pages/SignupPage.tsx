import { useState, FormEvent } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, Loader2, Check, X } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import toast from 'react-hot-toast';

export function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const { signUp } = useAuth();
  const navigate = useNavigate();

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasLetter: /[a-zA-Z]/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);
  const doPasswordsMatch = password === confirmPassword && password.length > 0;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    if (!email || !password || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (!isPasswordValid) {
      toast.error('Please meet all password requirements');
      return;
    }

    if (!doPasswordsMatch) {
      toast.error('Passwords do not match');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password);

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Email already in use');
        } else {
          toast.error(error.message);
        }
      } else {
        toast.success('Account created successfully!');
        navigate('/home');
      }
    } catch (error) {
      toast.error('An unexpected error occurred');
      console.error('Signup error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[calc(100vh-200px)] flex items-center justify-center px-4 py-8">
      <div className="max-w-md w-full">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-sky-100 rounded-full flex items-center justify-center">
              <UserPlus className="w-8 h-8 text-sky-600" />
            </div>
          </div>

          <h2 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Create Account
          </h2>
          <p className="text-center text-gray-600 mb-8">
            Start planning your perfect trips today
          </p>

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

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="Create a strong password"
                disabled={loading}
                required
              />

              {password && (
                <div className="mt-3 space-y-2">
                  <div className="flex items-center gap-2 text-sm">
                    {passwordRequirements.minLength ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.minLength ? 'text-green-600' : 'text-gray-600'}>
                      At least 8 characters
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordRequirements.hasNumber ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.hasNumber ? 'text-green-600' : 'text-gray-600'}>
                      Contains a number
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    {passwordRequirements.hasLetter ? (
                      <Check className="w-4 h-4 text-green-600" />
                    ) : (
                      <X className="w-4 h-4 text-gray-400" />
                    )}
                    <span className={passwordRequirements.hasLetter ? 'text-green-600' : 'text-gray-600'}>
                      Contains a letter
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                Confirm Password
              </label>
              <input
                id="confirmPassword"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
                placeholder="Confirm your password"
                disabled={loading}
                required
              />

              {confirmPassword && (
                <div className="mt-2 flex items-center gap-2 text-sm">
                  {doPasswordsMatch ? (
                    <>
                      <Check className="w-4 h-4 text-green-600" />
                      <span className="text-green-600">Passwords match</span>
                    </>
                  ) : (
                    <>
                      <X className="w-4 h-4 text-red-600" />
                      <span className="text-red-600">Passwords do not match</span>
                    </>
                  )}
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={loading || !isPasswordValid || !doPasswordsMatch}
              className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-sky-600 text-white rounded-lg font-semibold hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Creating account...
                </>
              ) : (
                <>
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </>
              )}
            </button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-600 hover:text-sky-700 font-semibold">
                Sign in
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
