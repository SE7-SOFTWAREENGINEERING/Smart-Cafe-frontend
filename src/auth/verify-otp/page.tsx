import React, { useState, useRef } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import Button from '../../components/common/Button';
import toast from 'react-hot-toast';

const VerifyOtpPage: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || 'your-email@example.com';

  const handleChange = (index: number, value: string) => {
    if (isNaN(Number(value))) return;
    
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, 6).split('');
    const newOtp = [...otp];
    data.forEach((value, index) => {
       if (index < 6 && !isNaN(Number(value))) newOtp[index] = value;
    });
    setOtp(newOtp);
    inputRefs.current[Math.min(data.length, 5)]?.focus();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const enteredOtp = otp.join('');
    
    if (enteredOtp.length !== 6) {
      setError('Please enter a complete 6-digit code.');
      return;
    }

    setLoading(true);

    import('../../services/auth.service').then(async (authService) => {
        try {
            await authService.verifyOtp(email, enteredOtp);
            toast.success("Identity verified successfully!");
            // Pass email and OTP to reset password page so it can be used for final submission
            navigate('/auth/reset-password', { state: { email, otp: enteredOtp } });
        } catch (error: any) {
            toast.error(error.message || "Invalid OTP");
            setError('Invalid OTP. Please try again.');
        } finally {
            setLoading(false);
        }
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-lg p-8 border border-gray-100">
        <div className="text-center mb-8">
           <div className="mx-auto w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mb-4">
             <ShieldCheck size={24} />
           </div>
           <h1 className="text-2xl font-bold text-gray-900">Verify OTP</h1>
           <p className="text-sm text-gray-500 mt-2">Enter the code sent to <span className="font-semibold text-gray-800">{email}</span></p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
           <div className="flex gap-2 justify-center" onPaste={handlePaste}>
             {otp.map((digit, index) => (
                <input
                  key={index}
                  ref={(el) => { inputRefs.current[index] = el; }}
                  type="text"
                  maxLength={1}
                  value={digit}
                  onChange={(e) => handleChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                  className="w-10 h-12 sm:w-12 sm:h-14 border border-gray-300 rounded-lg text-center text-xl font-bold focus:ring-2 focus:ring-brand focus:border-transparent outline-none transition"
                />
             ))}
           </div>
           
           {error && <p className="text-sm text-red-600 font-medium text-center">{error}</p>}

           <Button type="submit" isLoading={loading} className="w-full py-3 flex items-center justify-center gap-2">
             Verify Code <ArrowRight size={18} />
           </Button>
        </form>

        <div className="mt-6 text-center space-y-4">
           <p className="text-xs text-gray-500">Didn't receive code? <button className="text-brand font-medium hover:underline">Resend</button></p>
           
           <Link to="/auth/forgot-password" className="inline-flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition">
             <ArrowLeft size={16} /> Back to Email
           </Link>
        </div>
      </div>
    </div>
  );
};

export default VerifyOtpPage;
