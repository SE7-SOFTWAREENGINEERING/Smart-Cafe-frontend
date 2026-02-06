import React, { useState } from 'react';
import { AlertTriangle, Leaf, ChevronDown, CheckCircle, Package } from 'lucide-react';

const FoodWasteControl: React.FC = () => {
  const [portionSize, setPortionSize] = useState<'Standard' | 'Small'>('Standard');
  const [surplusAvailable, setSurplusAvailable] = useState(false);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Food Waste Risk</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-3xl font-bold text-green-600">Low</h2>
          </div>
        </div>
        <div className="p-2 bg-green-50 text-green-600 rounded-full">
          <Leaf size={20} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <AlertTriangle size={16} className="text-yellow-500" />
        <span>Expected variance: <span className="font-medium">~1.8%</span></span>
      </div>

      <div className="space-y-4">
        {/* Portion Control */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">Portion Sizes</label>
          <div className="flex bg-white rounded-md border border-gray-200 p-1">
            <button 
              onClick={() => setPortionSize('Standard')}
              className={`flex-1 text-xs py-1.5 rounded font-medium transition ${portionSize === 'Standard' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Standard
            </button>
            <button 
              onClick={() => setPortionSize('Small')}
              className={`flex-1 text-xs py-1.5 rounded font-medium transition ${portionSize === 'Small' ? 'bg-green-600 text-white shadow-sm' : 'text-gray-500 hover:bg-gray-50'}`}
            >
              Small (-10%)
            </button>
          </div>
        </div>

        {/* Surplus Management */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Surplus Food Donation</span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input 
                type="checkbox" 
                name="toggle" 
                id="surplus-toggle" 
                checked={surplusAvailable}
                onChange={() => setSurplusAvailable(!surplusAvailable)}
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 checked:border-green-500"
                style={{ right: surplusAvailable ? '0' : 'auto', left: surplusAvailable ? 'auto' : '0' }}
              />
              <label 
                htmlFor="surplus-toggle" 
                className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${surplusAvailable ? 'bg-green-500' : 'bg-gray-300'}`}
              ></label>
            </div>
          </div>
          
          {surplusAvailable ? (
            <div className="bg-green-50 text-green-800 text-xs p-3 rounded-lg border border-green-100 flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5" />
              <div>
                <p className="font-medium opacity-90">Marked for Donation</p>
                <p className="mt-1 opacity-75">NGO partner 'FoodForAll' has been notified for pickup at 3:00 PM.</p>
              </div>
            </div>
          ) : (
             <div className="bg-gray-50 text-gray-500 text-xs p-3 rounded-lg border border-gray-100 flex items-start gap-2">
              <Package size={14} className="mt-0.5" />
              <p>No surplus flagged yet. Toggle when leftover food is confirmed available.</p>
            </div>
          )}
        </div>
      </div>
      
      <button className="w-full mt-4 text-center text-xs text-gray-500 hover:text-gray-900 border-t border-gray-100 pt-3">
        View detailed Waste Reports
      </button>
    </div>
  );
};

export default FoodWasteControl;
