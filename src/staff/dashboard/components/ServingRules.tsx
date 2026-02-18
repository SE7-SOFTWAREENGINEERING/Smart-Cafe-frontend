import React, { useState, useEffect } from "react";
import { Utensils, Scale } from "lucide-react";
import { getAllSettings } from "../../../services/system.service";

const ServingRules: React.FC = () => {
  const [rules, setRules] = useState({
    riceLimit: 0,
    curryLimit: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRules = async () => {
      try {
        const settings = await getAllSettings();
        const map: Record<string, string> = {};
        settings.forEach((s) => {
          map[s.settingKey] = s.settingValue;
        });

        setRules({
          riceLimit: parseInt(map["RICE_PORTION_LIMIT_G"]) || 0,
          curryLimit: parseInt(map["CURRY_PORTION_LIMIT_ML"]) || 0,
        });
      } catch (error) {
        console.error("Failed to load serving rules", error);
      } finally {
        setLoading(false);
      }
    };

    fetchRules();
  }, []);

  if (loading) return null;

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
      <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
        <Utensils size={20} className="text-orange-600" />
        <h3>Serving Rules</h3>
      </div>
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white rounded-md shadow-sm text-gray-400">
              <Scale size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700">Rice Portion Limit</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{rules.riceLimit} <span className="text-xs font-normal text-gray-500">g</span></span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg border border-gray-100">
          <div className="flex items-center gap-3">
             <div className="p-2 bg-white rounded-md shadow-sm text-gray-400">
              <Scale size={16} />
            </div>
            <span className="text-sm font-medium text-gray-700">Curry Portion Limit</span>
          </div>
          <span className="text-lg font-bold text-gray-900">{rules.curryLimit} <span className="text-xs font-normal text-gray-500">ml</span></span>
        </div>
      </div>
    </div>
  );
};

export default ServingRules;
