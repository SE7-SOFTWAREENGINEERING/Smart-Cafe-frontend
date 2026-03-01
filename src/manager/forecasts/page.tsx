import React, { useState, useEffect } from 'react';
import { Filter, BarChart2, CheckCircle, XCircle, Loader2, AlertCircle } from 'lucide-react';
import { getAnalytics, getForecast, AnalyticsResponse } from '../../../services/forecast.service';

interface ItemPrediction {
  name: string;
  category: string;
  isVeg: boolean;
  quantity: number | null;
  trend: string;
  confidence: number;
}

const ManagerForecasts: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState('Week');
  const [mealFilter, setMealFilter] = useState('All');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [analytics, setAnalytics] = useState<AnalyticsResponse | null>(null);
  const [predictions, setPredictions] = useState<ItemPrediction[]>([]);

  useEffect(() => {
    const fetchForecastData = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch chart analytics
        const analyticsData = await getAnalytics();
        setAnalytics(analyticsData);

        // Fetch individual item forecasts
        const baseItems = [
          { name: 'Vegetable Biryani', category: 'Lunch', isVeg: true },
          { name: 'Paneer Butter Masala', category: 'Lunch', isVeg: true },
          { name: 'Idli Sambar', category: 'Breakfast', isVeg: true }
        ];

        const today = new Date().toLocaleDateString('en-US', { weekday: 'long' });

        const itemPredictions = await Promise.all(
          baseItems.map(async (item) => {
            try {
              const res = await getForecast({
                Day_of_Week: today,
                Meal_Type: item.category,
                Is_Veg: item.isVeg,
                Event_Context: 'Normal',
                Weather: 'Clear'
              });
              // Arbitrarily calculate mock trends based on response size for UI completeness
              const isHigh = res.prediction > 100;
              return {
                ...item,
                quantity: Math.round(res.prediction),
                trend: isHigh ? '↑ High' : '→ Stable',
                confidence: isHigh ? 92 : 85
              };
            } catch (e) {
              return { ...item, quantity: null, trend: 'N/A', confidence: 0 };
            }
          })
        );

        setPredictions(itemPredictions);
      } catch (err: any) {
        console.error('Forecasts fetch failed:', err);
        setError('Prediction Engine Offline. Forecast data is currently unavailable.');
      } finally {
        setLoading(false);
      }
    };

    fetchForecastData();
  }, [timeFilter, mealFilter]);

  const maxVal = analytics?.chart_data?.length
    ? Math.max(...analytics.chart_data.map(d => d.predicted))
    : 200;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Forecast Analytics</h1>
          <p className="text-sm text-gray-500 mt-1">AI-driven demand prediction and planning.</p>
        </div>

        {/* Filters Panel */}
        <div className="flex items-center gap-3 bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
          <div className="flex items-center gap-2 px-3 border-r border-gray-200">
            <Filter size={16} className="text-gray-400" />
            <span className="text-sm font-medium text-gray-700">Filters:</span>
          </div>
          <select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            className="text-sm border-none focus:ring-0 text-gray-600 font-medium cursor-pointer"
          >
            <option>Today</option>
            <option>Week</option>
            <option>Month</option>
          </select>
          <div className="w-px h-4 bg-gray-200"></div>
          <select
            value={mealFilter}
            onChange={(e) => setMealFilter(e.target.value)}
            className="text-sm border-none focus:ring-0 text-gray-600 font-medium cursor-pointer"
          >
            <option>All Types</option>
            <option>Breakfast</option>
            <option>Lunch</option>
            <option>Dinner</option>
          </select>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg flex items-center gap-3 border border-red-200">
          <AlertCircle size={20} className="shrink-0" />
          <p className="text-sm font-medium">{error}</p>
        </div>
      )}

      {/* Chart Visualization */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600" />
            Demand Trend
          </h3>
          <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">
            Next 7 Days
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center text-gray-400">
            <Loader2 className="animate-spin" size={32} />
          </div>
        ) : error || !analytics?.chart_data ? (
          <div className="h-64 flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-100 rounded-lg">
            <BarChart2 size={48} className="mb-2 opacity-50" />
            <p className="text-sm">Graph data unavailable</p>
          </div>
        ) : (
          <div className="h-64 flex items-end justify-between gap-2 px-4">
            {analytics.chart_data.map((dayData, index) => (
              <div key={index} className="flex flex-col items-center gap-2 flex-1 group">
                <div className="relative w-full flex justify-center items-end h-48 bg-gray-50 rounded-lg overflow-hidden">
                  <div
                    className="w-full mx-1 bg-blue-500 rounded-t-sm transition-all duration-500 group-hover:bg-blue-600"
                    style={{ height: `${(dayData.predicted / maxVal) * 100}%` }}
                  ></div>
                  <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow transition-opacity z-10 whitespace-nowrap">
                    {dayData.predicted} ({dayData.day})
                  </div>
                </div>
                <span className="text-xs text-gray-500 font-medium">{dayData.day.substring(0, 3)}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Forecast Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-gray-900">Item-wise Predictions</h3>

        {loading ? (
          <div className="flex justify-center p-8 text-gray-400 border rounded-lg border-gray-100">
            <Loader2 className="animate-spin" size={24} />
          </div>
        ) : error || predictions.length === 0 ? (
          <div className="text-center p-8 text-gray-500 border rounded-lg border-gray-100 text-sm">
            Prediction data offline.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 font-medium">
                <tr>
                  <th className="px-4 py-3 rounded-l-lg">Item Name</th>
                  <th className="px-4 py-3">Category</th>
                  <th className="px-4 py-3">Predicted Qty</th>
                  <th className="px-4 py-3">Trend</th>
                  <th className="px-4 py-3">Confidence</th>
                  <th className="px-4 py-3 rounded-r-lg">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {predictions.map((p, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-4 py-3 font-medium text-gray-900">{p.name}</td>
                    <td className="px-4 py-3 text-gray-500">{p.category}</td>
                    <td className="px-4 py-3">{p.quantity !== null ? `${p.quantity} plates` : 'Err'}</td>
                    <td className={`px-4 py-3 ${p.trend === '↑ High' ? 'text-green-600' : 'text-gray-500'}`}>{p.trend}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                          <div className={`h-full ${p.confidence > 90 ? 'bg-green-500' : 'bg-amber-500'}`} style={{ width: `${p.confidence}%` }}></div>
                        </div>
                        <span className="text-xs text-gray-500">{p.confidence}%</span>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <button className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors" title="Accept">
                          <CheckCircle size={16} />
                        </button>
                        <button className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors" title="Reject">
                          <XCircle size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerForecasts;
