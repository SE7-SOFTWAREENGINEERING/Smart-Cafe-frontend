import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { UserPlus, Check, AlertTriangle } from 'lucide-react';
import { cn } from '../../utils/cn';

const StaffWalkin: React.FC = () => {
  const [personCount, setPersonCount] = useState(1);
  const [tokenGenerated, setTokenGenerated] = useState<string | null>(null);

  // Mock Capacity Data
  const capacity = { current: 120, max: 140, available: 20 };
  const isEligible = capacity.available >= personCount;

  const handleGenerate = () => {
    setTokenGenerated('WK-' + Math.floor(Math.random() * 1000));
    // Simulate reset
    setTimeout(() => setTokenGenerated(null), 5000);
  };

  return (
    <div className="max-w-2xl space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">Issue Walk-in Token</h1>
        <p className="text-sm text-gray-500 mt-1">For faculty, guests, or students without pre-booking.</p>
      </header>
      
      {/* Capacity Status */}
      <div className={cn("p-4 rounded-lg border flex items-center gap-4", isEligible ? "bg-green-50 border-green-100 text-green-800" : "bg-red-50 border-red-100 text-red-800")}>
         <div className={cn("p-2 rounded-full", isEligible ? "bg-green-100" : "bg-red-100")}>
           {isEligible ? <Check size={20} /> : <AlertTriangle size={20} />}
         </div>
         <div className="flex-1">
           <h3 className="font-semibold">{isEligible ? 'Walk-ins Allowed' : 'Capacity Full'}</h3>
           <p className="text-sm opacity-90">
             {capacity.available} seats available (Current Occupancy: {Math.round((capacity.current/capacity.max)*100)}%)
           </p>
         </div>
      </div>

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
             <p className="text-gray-500">Please issue this token number to the guest.</p>
             <Button variant="secondary" className="mt-6" onClick={() => setTokenGenerated(null)}>Issue Another</Button>
           </div>
        ) : (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-3">Number of People</label>
            <div className="flex gap-3 mb-8">
              {[1, 2, 3, 4, 5].map(n => (
                <button 
                  key={n} 
                  onClick={() => setPersonCount(n)}
                  className={cn(
                    "w-12 h-12 rounded-full border flex items-center justify-center font-bold transition-all",
                    personCount === n 
                      ? "border-blue-600 bg-blue-600 text-white shadow-md scale-105" 
                      : "border-gray-200 text-gray-700 hover:border-blue-400 hover:bg-blue-50"
                  )}
                >
                  {n}
                </button>
              ))}
            </div>

            <Button 
              className="w-full h-12 text-lg" 
              disabled={!isEligible}
              onClick={handleGenerate}
            >
              <UserPlus className="mr-2" />
              {isEligible ? `Generate Token for ${personCount} ${personCount > 1 ? 'People' : 'Person'}` : 'Checking Capacity...'}
            </Button>
            
            {!isEligible && (
              <p className="text-center text-red-500 text-sm mt-3 font-medium">Cannot issue token: Not enough seats.</p>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StaffWalkin;
