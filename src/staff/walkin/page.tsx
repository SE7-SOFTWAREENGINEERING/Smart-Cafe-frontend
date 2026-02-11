import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import { UserPlus, Check, AlertTriangle, Loader2 } from 'lucide-react';
import { cn } from '../../utils/cn';
import { staffService } from '../../services/staff.service';
import toast from 'react-hot-toast';

const StaffWalkin: React.FC = () => {
  const [email, setEmail] = useState('');
  const [mealType, setMealType] = useState('Lunch');
  const [tokenGenerated, setTokenGenerated] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [capacity, setCapacity] = useState({ current: 0, max: 50, available: 50 });
  const [loadingCapacity, setLoadingCapacity] = useState(true);

  // Fetch real capacity data
  useEffect(() => {
    const fetchCapacity = async () => {
      try {
        const today = new Date().toISOString().split('T')[0];
        const slots = await staffService.getAvailableSlots(today);
        
        if (slots && slots.length > 0) {
          // Calculate total capacity
          const totalMax = slots.reduce((acc, slot) => acc + slot.maxCapacity, 0);
          const totalBooked = slots.reduce((acc, slot) => acc + slot.bookedCount, 0);
          const totalAvailable = slots.reduce((acc, slot) => acc + slot.remainingSlots, 0);
          
          setCapacity({
            max: totalMax,
            current: totalBooked,
            available: totalAvailable
          });
        }
      } catch (error) {
        console.error('Error fetching capacity:', error);
        // Keep default values on error
      } finally {
        setLoadingCapacity(false);
      }
    };

    fetchCapacity();
  }, []);

  const isEligible = capacity.available > 0;

  const handleGenerate = async () => {
    if (!email.trim()) {
      toast.error('Please enter a user email');
      return;
    }

    setIsLoading(true);
    try {
      const response = await staffService.issueWalkInToken(email, mealType);
      
      if (response.success) {
        // Backend returns data.token.qrCode (the UUID)
        const tokenString = response.data?.token?.qrCode || response.data?.token?.tokenId;
        setTokenGenerated(tokenString);
        toast.success('Walk-in token issued successfully!');
        
        // Update capacity
        setCapacity(prev => ({
          ...prev,
          current: prev.current + 1,
          available: prev.available - 1
        }));
      } else {
        toast.error(response.message || 'Failed to issue token');
      }
    } catch (error: any) {
      console.error('Error issuing token:', error);
      toast.error(error.response?.data?.message || 'Failed to issue walk-in token');
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setTokenGenerated(null);
    setEmail('');
  };

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Issue Walk-in Token</h1>
        <p className="text-sm text-gray-500 mt-1">For faculty, guests, or students without pre-booking.</p>
      </header>
      
      {/* Capacity Status */}
      {loadingCapacity ? (
        <div className="p-4 rounded-lg border bg-gray-50 flex items-center justify-center">
          <Loader2 className="animate-spin text-gray-400" size={20} />
          <span className="ml-2 text-gray-500">Loading capacity...</span>
        </div>
      ) : (
        <div className={cn("p-4 rounded-lg border flex items-center gap-4", isEligible ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800")}>
           <div className={cn("p-2 rounded-full", isEligible ? "bg-green-100" : "bg-red-100")}>
             {isEligible ? <Check size={20} /> : <AlertTriangle size={20} />}
           </div>
           <div className="flex-1">
             <h3 className="font-semibold">{isEligible ? 'Walk-ins Allowed' : 'Capacity Full'}</h3>
             <p className="text-sm opacity-90">
               {capacity.available} seats available (Current Occupancy: {capacity.max > 0 ? Math.round((capacity.current/capacity.max)*100) : 0}%)
             </p>
           </div>
        </div>
      )}

      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        {tokenGenerated ? (
           <div className="text-center py-8 animate-in zoom-in-95">
             <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
               <Check size={32} />
             </div>
             <h3 className="text-2xl font-bold text-gray-900">Token Generated!</h3>
             <div className="my-4 text-4xl font-mono font-bold text-blue-600 tracking-wider p-4 bg-gray-50 rounded-lg inline-block border border-gray-200">
               {tokenGenerated}
             </div>
             <p className="text-gray-500">Token issued for: {email}</p>
             <p className="text-gray-400 text-sm">Meal: {mealType}</p>
             <Button variant="secondary" className="mt-6" onClick={resetForm}>Issue Another</Button>
           </div>
        ) : (
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">User Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter user email..."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Meal Type</label>
              <select
                value={mealType}
                onChange={(e) => setMealType(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                disabled={isLoading}
              >
                <option value="Breakfast">Breakfast</option>
                <option value="Lunch">Lunch</option>
                <option value="Snacks">Snacks</option>
                <option value="Dinner">Dinner</option>
              </select>
            </div>

            <Button 
              className="w-full h-12 text-lg" 
              disabled={!isEligible || isLoading || !email.trim()}
              onClick={handleGenerate}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 animate-spin" size={20} />
                  Issuing Token...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2" />
                  {isEligible ? 'Generate Walk-in Token' : 'Capacity Full'}
                </>
              )}
            </Button>
            
            {!isEligible && (
              <p className="text-center text-red-500 text-sm font-medium">Cannot issue token: No available seats.</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default StaffWalkin;
