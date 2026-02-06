import React, { useState } from 'react';
import { Leaf, Award, Recycle } from 'lucide-react';
import Button from '../../components/common/Button';

const StudentSustainability: React.FC = () => {
  const [wasteMealType, setWasteMealType] = useState('Lunch');
  const [wasteReason, setWasteReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleWasteReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSubmitting(false);
    alert('Waste report submitted. Thank you for your honesty!');
    setWasteReason('');
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Sustainability & Eco-Score</h1>
          <p className="text-gray-500 text-sm mt-1">Track your impact and help us reduce waste.</p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
          <Leaf size={18} />
          850 pts
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Eco Score Details */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-green-100 p-3 rounded-full text-green-600">
              <Award size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Your Impact</h3>
              <p className="text-sm text-gray-500">You are in the top 15% of sustainable eaters!</p>
            </div>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Zero Waste Streak</span>
                <span className="font-semibold text-gray-900">5 Days</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '70%' }}></div>
              </div>
            </div>
          </div>
          
          <div className="mt-8 pt-6 border-t border-gray-100">
            <h4 className="font-semibold text-gray-900 mb-3">Dietary Preferences</h4>
            <div className="flex gap-2 flex-wrap">
              <span className="px-3 py-1 bg-green-50 text-green-700 text-xs font-semibold rounded-full border border-green-100">Vegetarian</span>
              <span className="px-3 py-1 bg-blue-50 text-blue-700 text-xs font-semibold rounded-full border border-blue-100">Lactose Free</span>
              <span className="px-3 py-1 bg-gray-100 text-gray-600 text-xs font-semibold rounded-full">+ Add Preference</span>
            </div>
          </div>
        </div>

        {/* Waste Reporting Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <Recycle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Report Food Waste</h3>
              <p className="text-sm text-gray-500">Honest reporting helps us improve portion sizes.</p>
            </div>
          </div>

          <form onSubmit={handleWasteReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Meal Type</label>
              <select 
                value={wasteMealType}
                onChange={(e) => setWasteMealType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option>Breakfast</option>
                <option>Lunch</option>
                <option>Dinner</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Reason for Waste</label>
              <textarea 
                value={wasteReason}
                onChange={(e) => setWasteReason(e.target.value)}
                placeholder="E.g., Portion too large, Food cold, Taste issue..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-24 resize-none"
                required
              />
            </div>

            <Button 
              type="submit" 
              className="w-full bg-green-600 hover:bg-green-700 focus:ring-green-500"
              isLoading={isSubmitting}
            >
              Submit Report
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentSustainability;
