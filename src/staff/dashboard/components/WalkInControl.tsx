import React, { useState } from 'react';
import { UserPlus, ShieldAlert, Loader } from 'lucide-react';
import toast from 'react-hot-toast';

interface WalkInControlProps {
    onIssueToken: (email: string, mealType: string) => Promise<boolean>;
}

const WalkInControl: React.FC<WalkInControlProps> = ({ onIssueToken }) => {
  const [email, setEmail] = useState('');
  const [mealType, setMealType] = useState('Lunch'); // Default, could be dynamic
  const [loading, setLoading] = useState(false);
  const [capacityFull, setCapacityFull] = useState(false); // Can be driven by props if needed

  const handleIssue = async () => {
      if (!email) {
          toast.error('Please enter User Email');
          return;
      }
      setLoading(true);
      try {
          const success = await onIssueToken(email, mealType);
          if (success) {
              setEmail('');
              toast.success('Walk-in token issued!');
          }
      } catch (error) {
           console.error(error);
      } finally {
          setLoading(false);
      }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium uppercase tracking-wider">Walk-in Mgmt</h3>
          <p className="text-xs text-gray-400 mt-1">Manual entry for unbooked</p>
        </div>
        <div className={`px-2 py-1 rounded text-[10px] font-bold uppercase ${capacityFull ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
          {capacityFull ? 'Blocked' : 'Allowed'}
        </div>
      </div>

      <div className="flex flex-col gap-3 mb-6">
        <input 
            type="email" 
            placeholder="User Email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand"
        />
        <select 
            value={mealType}
            onChange={(e) => setMealType(e.target.value)}
            className="w-full p-2 border border-gray-200 rounded text-sm focus:outline-none focus:border-brand"
        >
            <option value="Breakfast">Breakfast</option>
            <option value="Lunch">Lunch</option>
            <option value="Snacks">Snacks</option>
            <option value="Dinner">Dinner</option>
        </select>
        
        <button 
           onClick={handleIssue}
           disabled={loading || capacityFull}
           className={`w-full p-3 rounded-lg transition text-white font-medium flex items-center justify-center gap-2 ${
               loading || capacityFull 
               ? 'bg-gray-300 cursor-not-allowed' 
               : 'bg-brand hover:bg-brand-hover'
           }`}
        >
           {loading ? <Loader size={18} className="animate-spin" /> : <UserPlus size={18} />}
           Issue Token
        </button>
      </div>

      {capacityFull ? (
        <div className="p-3 bg-red-50 rounded-lg border border-red-100 flex items-start gap-2 text-red-700">
           <ShieldAlert size={16} className="mt-0.5 shrink-0" />
           <p className="text-xs">Capacity Full. Walk-in token generation is temporarily disabled.</p>
        </div>
      ) : (
        <div className="flex items-center justify-between pt-2 border-t border-gray-100">
           <span className="text-xs text-gray-500">Occupancy is safe</span>
           <button 
             onClick={() => setCapacityFull(true)}
             className="text-xs font-medium text-red-600 hover:text-red-700"
           >
             Block Walk-ins
           </button>
        </div>
      )}
    </div>
  );
};

export default WalkInControl;
