import React, { useState, useEffect } from 'react';
import { BarChart, Sliders, Activity } from 'lucide-react';
import Button from '../../components/common/Button';
import { getAnalytics } from '../../services/forecast.service';
import type { AnalyticsResponse } from '../../services/forecast.service';

const AdminAccuracy: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<AnalyticsResponse | null>(null);

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await getAnalytics();
      setData(response);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const chartData = data?.chart_data || [];
  const maxVal = Math.max(...chartData.map(d => Math.max(d.predicted, d.actual)), 100);

  if (loading) return <div className="p-10 text-center">Loading Analytics...</div>;

  return (
    <div className="space-y-6">
      <header>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Forecast Accuracy & Governance</h1>
            <p className="text-sm text-gray-500 mt-1">Evaluate and tune AI model performance via Forecasting API.</p>
          </div>
          <Button onClick={fetchAnalytics}>
            <Activity size={16} className="mr-2" />
            Refresh Data
          </Button>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">MAPE (Error Rate)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data?.metrics.mape}%</p>
          <span className="text-xs text-green-600 font-medium">Model Performance</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Root Mean Sq. Error</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">{data?.metrics.rmse}</p>
          <span className="text-xs text-gray-400">Deviation</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Active Model</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-lg font-bold text-green-700">RandomForest</p>
          </div>
          <span className="text-xs text-gray-400">Total Records: {data?.total_records}</span>
        </div>
      </div>

       {/* Top Drivers (Replacing Tuning Section for visual clarity connection to API) */}
       <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Sliders size={20} className="text-brand" />
            Top Demand Drivers (Feature Importance)
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           {data?.top_drivers.map((driver, idx) => (
               <div key={idx}>
                   <div className="flex justify-between mb-2">
                       <label className="text-sm font-medium text-gray-700">{driver.factor}</label>
                       <span className="text-sm text-brand font-bold">{Math.round(driver.importance * 100)}%</span>
                   </div>
                   <div className="w-full bg-gray-200 rounded-full h-2.5">
                       <div className="bg-blue-600 h-2.5 rounded-full" style={{ width: `${driver.importance * 100}%` }}></div>
                   </div>
               </div>
           ))}
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart size={18} className="text-brand" />
            Predicted vs Actual Demand (Test Set Sample)
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-200"></span> Predicted
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-blue-600"></span> Actual
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 px-2 overflow-x-auto">
          {chartData.map((d, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group min-w-[40px]">
              <div className="w-full h-full flex items-end justify-center gap-1 relative">
                {/* Predicted Bar */}
                <div
                  className="w-1/2 bg-blue-200 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(d.predicted / maxVal) * 100}%` }}
                ></div>
                {/* Actual Bar */}
                <div
                  className="w-1/2 bg-blue-600 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(d.actual / maxVal) * 100}%` }}
                ></div>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-10">
                  <div className="font-semibold mb-1">{d.day}</div>
                  <div>Pred: {d.predicted}</div>
                  <div>Actual: {d.actual}</div>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">{d.day}</span>
            </div>
          ))}
        </div>
      </div>
    </div >
  );
};

export default AdminAccuracy;
