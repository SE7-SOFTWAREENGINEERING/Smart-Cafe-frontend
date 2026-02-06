import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const ForgotPasswordPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setLoading(true);
    // Simulate API call
    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      
      // Simulate checking if email exists (Mock: fail if email is 'fail@test.com')
      if (email === 'fail@test.com') {
         toast.error("Email not found in our records.");
         return;
      }

      toast.success("OTP sent to your email!");
      // Navigate to OTP page, passing email in state for context
      navigate('/auth/verify-otp', { state: { email } });
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
           <div className="mx-auto w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mb-4">
             <Mail size={24} />
           </div>
           <h1 className="text-2xl font-bold text-gray-900">Forgot Password?</h1>
           <p className="text-sm text-gray-500 mt-2">Enter your registered email details to get reset instructions.</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
              <div className="relative">
                 <input 
                   type="email" 
                   id="email" 
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                   className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition"
                   placeholder="student@university.edu"
                   required
                 />
                 <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
              </div>
           </div>

           <Button type="submit" isLoading={loading} className="w-full py-3 flex items-center justify-center gap-2">
             Send OTP <ArrowRight size={18} />
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

export default ForgotPasswordPage;
