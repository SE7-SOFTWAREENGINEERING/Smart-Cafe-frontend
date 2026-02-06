import React, { useState } from 'react';
import { BarChart, Settings, Sliders, Check, Activity, Save } from 'lucide-react';
import Button from '../../components/common/Button';

const AdminAccuracy: React.FC = () => {
  // Mock Data
  const accuracyData = [
    { day: 'Mon', predicted: 1200, actual: 1150 },
    { day: 'Tue', predicted: 1250, actual: 1280 },
    { day: 'Wed', predicted: 1300, actual: 1290 },
    { day: 'Thu', predicted: 1180, actual: 1200 },
    { day: 'Fri', predicted: 1350, actual: 1320 },
    { day: 'Sat', predicted: 900, actual: 850 },
    { day: 'Sun', predicted: 950, actual: 980 },
  ];

  const maxVal = Math.max(...accuracyData.map(d => Math.max(d.predicted, d.actual)));

  // Tuning State
  const [activeModel, setActiveModel] = useState('LSTM (Production)');
  const [weights, setWeights] = useState({
    weather: 30,
    calendar: 50,
    sales: 80
  });

  return (
    <div className="space-y-6">
      <header>
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Forecast Accuracy & Governance</h1>
            <p className="text-sm text-gray-500 mt-1">Evaluate and tune AI model performance.</p>
          </div>
          <Button>
            <Activity size={16} className="mr-2" />
            Retrain Model
          </Button>
        </div>
      </header>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">MAPE (Error Rate)</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">3.2%</p>
          <span className="text-xs text-green-600 font-medium">Excellent Performance</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Root Mean Sq. Error</h3>
          <p className="text-3xl font-bold text-gray-900 mt-2">45.2</p>
          <span className="text-xs text-gray-400">Meals per day deviation</span>
        </div>
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-gray-500 text-sm font-medium">Active Model</h3>
          <div className="flex items-center gap-2 mt-2">
            <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
            <p className="text-lg font-bold text-green-700">{activeModel}</p>
          </div>
          <span className="text-xs text-gray-400">Last retrained: 2 days ago</span>
        </div>
      </div>

      {/* Model Tuning Section (New) */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <Sliders size={20} className="text-brand" />
            Model Parameter Tuning
          </h3>
          <Button size="sm">
            <Save size={16} className="mr-2" />
            Save Weights
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Weather Influence</label>
              <span className="text-sm text-brand font-bold">{weights.weather}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.weather}
              onChange={(e) => setWeights({ ...weights, weather: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
            />
            <p className="text-xs text-gray-500 mt-2">Impact of rain/temp forecasts on demand.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Calendar Events</label>
              <span className="text-sm text-brand font-bold">{weights.calendar}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.calendar}
              onChange={(e) => setWeights({ ...weights, calendar: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
            />
            <p className="text-xs text-gray-500 mt-2">Weight of exams, holidays, and campus events.</p>
          </div>

          <div>
            <div className="flex justify-between mb-2">
              <label className="text-sm font-medium text-gray-700">Historical Trend</label>
              <span className="text-sm text-brand font-bold">{weights.sales}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={weights.sales}
              onChange={(e) => setWeights({ ...weights, sales: parseInt(e.target.value) })}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand"
            />
            <p className="text-xs text-gray-500 mt-2">Reliance on past sales data (Rolling avg).</p>
          </div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-8">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart size={18} className="text-brand" />
            Predicted vs Actual Demand
          </h3>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand-light"></span> Predicted
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-brand"></span> Actual
            </div>
          </div>
        </div>

        <div className="h-64 flex items-end justify-between gap-4 px-2">
          {accuracyData.map((data, index) => (
            <div key={index} className="flex-1 flex flex-col items-center gap-2 group">
              <div className="w-full h-full flex items-end justify-center gap-1 relative">
                {/* Predicted Bar */}
                <div
                  className="w-1/2 bg-brand/30 rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(data.predicted / maxVal) * 100}%` }}
                ></div>
                {/* Actual Bar */}
                <div
                  className="w-1/2 bg-brand rounded-t-sm transition-all hover:opacity-80"
                  style={{ height: `${(data.actual / maxVal) * 100}%` }}
                ></div>

                {/* Tooltip */}
                <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-gray-800 text-white text-xs p-2 rounded pointer-events-none whitespace-nowrap z-10">
                  <div className="font-semibold mb-1">{data.day}</div>
                  <div>Pred: {data.predicted}</div>
                  <div>Actual: {data.actual}</div>
                </div>
              </div>
              <span className="text-xs text-gray-500 font-medium">{data.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Model Governance Section (FR-22) */}
      <div className="grid grid-cols-1 gap-6">
        {/* Model Comparison */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-6">
            <Settings size={20} className="text-gray-600" />
            Model Comparison
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500 border-b border-gray-100">
                <tr>
                  <th className="px-4 py-3">Model</th>
                  <th className="px-4 py-3">MAPE</th>
                  <th className="px-4 py-3">Speed</th>
                  <th className="px-4 py-3">Status</th>
                  <th className="px-4 py-3"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                <tr className="bg-green-50/50">
                  <td className="px-4 py-3 font-medium text-brand">LSTM (v3.2)</td>
                  <td className="px-4 py-3 text-green-600 font-bold">3.2%</td>
                  <td className="px-4 py-3">Slow</td>
                  <td className="px-4 py-3"><span className="px-2 py-0.5 bg-green-100 text-green-700 rounded-full text-xs">Active</span></td>
                  <td className="px-4 py-3"></td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">ARIMA</td>
                  <td className="px-4 py-3">5.8%</td>
                  <td className="px-4 py-3">Fast</td>
                  <td className="px-4 py-3"><span className="text-gray-400 text-xs">Sandbox</span></td>
                  <td className="px-4 py-3">
                    <button className="text-gray-600 hover:text-gray-800 text-xs font-medium">Details</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-4 py-3 font-medium text-gray-900">Prophet</td>
                  <td className="px-4 py-3">4.1%</td>
                  <td className="px-4 py-3">Medium</td>
                  <td className="px-4 py-3"><span className="text-gray-400 text-xs">Sandbox</span></td>
                  <td className="px-4 py-3">
                    <button onClick={() => setActiveModel('Prophet')} className="text-brand hover:text-brand-hover text-xs font-medium">Activate</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="mt-4 pt-4 border-t border-gray-100 text-xs text-gray-500 flex items-start gap-2">
            <Check size={14} className="mt-0.5 text-green-500" />
            Active model (LSTM) is currently performing within optimal parameters.
          </div>
        </div>
      </div>
    </div >
  );
};

export default AdminAccuracy;
