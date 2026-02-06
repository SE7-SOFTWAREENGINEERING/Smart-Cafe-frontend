import React, { useState } from 'react';
import { TrendingUp, TrendingDown, Sun, Calendar, Info, Check, X, ChevronDown, ChevronUp } from 'lucide-react';

const DemandForecast: React.FC = () => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(true);

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">Predicted Demand</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-900">1,250</h2>
            <span className="text-sm text-gray-500">meals</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 mb-1">
            <Sun size={12} /> Sunny (32°C)
          </div>
          <div className="bg-blue-50 text-blue-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
            <Calendar size={12} /> Exam Week
          </div>
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span className="flex items-center text-green-600 text-sm font-medium bg-green-50 px-2 py-0.5 rounded-full">
          <TrendingUp size={14} className="mr-1" />
          +12%
        </span>
        <span className="text-xs text-gray-400">vs last week (1,115)</span>
      </div>

      {showAIRecommendation && (
        <div className="bg-indigo-50 border border-indigo-100 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 text-indigo-600"><Info size={16} /></div>
            <div className="flex-1">
              <p className="text-xs font-medium text-indigo-900">AI Recommendation</p>
              <p className="text-xs text-indigo-700 mt-0.5">Prepare 15% more North Indian Thali due to exam schedule.</p>
              <div className="flex gap-2 mt-2">
                <button 
                  onClick={() => setShowAIRecommendation(false)}
                  className="bg-indigo-600 text-white text-xs px-2 py-1 rounded hover:bg-indigo-700 transition flex items-center gap-1"
                >
                  <Check size={12} /> Accept
                </button>
                <button 
                  onClick={() => setShowAIRecommendation(false)}
                  className="bg-white text-gray-600 border border-gray-200 text-xs px-2 py-1 rounded hover:bg-gray-50 transition flex items-center gap-1"
                >
                  <X size={12} /> Dismiss
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="border-t border-gray-100 pt-4">
        <button 
          onClick={() => setShowBreakdown(!showBreakdown)}
          className="flex items-center justify-between w-full text-sm font-medium text-gray-700 hover:text-gray-900"
        >
          <span>Meal-wise Breakdown</span>
          {showBreakdown ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>
        
        {showBreakdown && (
          <div className="mt-3 space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">North Indian Thali</span>
              <span className="font-medium text-gray-900">450</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-orange-500 h-full rounded-full" style={{ width: '45%' }}></div>
            </div>
            
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">South Indian Meals</span>
              <span className="font-medium text-gray-900">320</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-green-500 h-full rounded-full" style={{ width: '30%' }}></div>
            </div>

            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-500">Chinese Combo</span>
              <span className="font-medium text-gray-900">280</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
              <div className="bg-red-500 h-full rounded-full" style={{ width: '25%' }}></div>
            </div>
            
            <button className="text-xs text-blue-600 font-medium mt-2 hover:underline">
              View Item-wise Details &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandForecast;
