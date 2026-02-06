import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import Button from '../../components/common/Button';
import { AlertCircle, Coffee } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, isLoading, isAuthenticated, user } = useAuth();
  const navigate = useNavigate();

  // Auto-login check
  React.useEffect(() => {
    if (isAuthenticated && user) {
      switch (user.role) {
        case 'student': navigate('/student/dashboard'); break;
        case 'staff': navigate('/staff/dashboard'); break;
        case 'manager': navigate('/manager/dashboard'); break;
        case 'admin': navigate('/admin/dashboard'); break;
        default: navigate('/');
      }
    }
  }, [isAuthenticated, user, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    try {
      const user = await login(email, password);

      if (user) {
        switch (user.role) {
          case 'student': navigate('/student/dashboard'); break;
          case 'staff': navigate('/staff/dashboard'); break;
          case 'manager': navigate('/manager/dashboard'); break;
          case 'admin': navigate('/admin/dashboard'); break;
          default: navigate('/');
        }
      } else {
        navigate('/');
      }
    } catch (err) {
      setError('Invalid credentials');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md p-8">
        <div className="flex flex-col items-center mb-8">
          <div className="bg-brand-light p-3 rounded-full mb-4">
            <Coffee className="h-8 w-8 text-brand" />
          </div>
          <h1 className="text-2xl font-bold text-gray-900">Welcome Back</h1>
          <p className="text-gray-500 text-sm mt-1">Sign in to Smart Cafeteria</p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 text-sm p-3 rounded-lg flex items-center gap-2 mb-6">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">College Email / Roll Number</label>
            <input
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              placeholder="e.g. 21CS001 or student@college.edu"
            />
            <p className="text-xs text-gray-400 mt-1">Enter your Roll Number or Official Email ID.</p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand focus:border-brand outline-none transition-all"
              placeholder="••••••••"
            />
            <div className="flex justify-end mt-1">
              <Link to="/auth/forgot-password" className="text-xs text-brand hover:text-brand-hover hover:underline">
                Forgot Password?
              </Link>
            </div>
          </div>

          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
          >
            Sign In
          </Button>
        </form>
      </div>
    </div>
  );
};

export default LoginPage;
