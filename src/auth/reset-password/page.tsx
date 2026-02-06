import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, ArrowRight, CheckCircle, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const ResetPasswordPage: React.FC = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setError('Passwords do not match');
      return;
    }
    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      return;
    }
    
    setLoading(true);
    setError('');

    // Simulate API reset
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      toast.success("Password reset successfully!");
      setTimeout(() => navigate('/auth/login'), 2000); // Redirect after success message
    }, 1500);
  };

  if (success) {
    return (
       <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
         <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100 text-center animate-in fade-in zoom-in duration-300">
            <div className="mx-auto w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
              <CheckCircle size={32} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Password Reset!</h2>
            <p className="text-gray-500 mt-2">Your password has been updated successfully. Redirecting to login...</p>
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
           <div className="mx-auto w-12 h-12 bg-purple-100 text-purple-600 rounded-full flex items-center justify-center mb-4">
             <Lock size={24} />
           </div>
           <h1 className="text-2xl font-bold text-gray-900">Reset Password</h1>
           <p className="text-sm text-gray-500 mt-2">Create a new strong password for your account.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
              <input 
                 type="password" 
                 value={password}
                 onChange={(e) => setPassword(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                 placeholder="••••••••"
                 required
              />
           </div>

           <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm Password</label>
              <input 
                 type="password" 
                 value={confirmPassword}
                 onChange={(e) => setConfirmPassword(e.target.value)}
                 className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                 placeholder="••••••••"
                 required
              />
           </div>

           {error && <p className="text-sm text-red-600 font-medium">{error}</p>}

           <Button type="submit" isLoading={loading} className="w-full py-3 flex items-center justify-center gap-2">
             Update Password <ArrowRight size={18} />
           </Button>
        </form>

        <div className="mt-6 text-center">
           <Link to="/auth/login" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
             <ArrowLeft size={16} /> Back to Login
           </Link>
        </div>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
