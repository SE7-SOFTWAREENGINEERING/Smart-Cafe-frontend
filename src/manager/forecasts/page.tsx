import React, { useState, useEffect } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, LineChart, Line } from 'recharts';
import { Calendar, TrendingUp, AlertCircle, RefreshCw } from 'lucide-react';
import axios from 'axios';
import toast from 'react-hot-toast';

const FORECAST_API_URL = 'http://localhost:5001';

interface ForecastData {
  total_records: number;
  average_demand: number;
  metrics: {
    mape: number;
    rmse: number;
  };
  top_drivers: Array<{ factor: string; importance: number }>;
  chart_data: Array<{ day: string; actual: number; predicted: number }>;
}

const ManagerForecasts: React.FC = () => {
  const [data, setData] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(true);
  const [predictionInput, setPredictionInput] = useState({
    Day_of_Week: 'Monday',
    Meal_Type: 'Lunch',
    Is_Veg: 1,
    Event_Context: 'Normal',
    Weather: 'Sunny'
  });
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  /* New State for Dynamic Chart Title */
  const [chartTitle, setChartTitle] = useState("Overall Model Accuracy (Test Data)");

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${FORECAST_API_URL}/analytics`);
      setData(response.data);
      setChartTitle("Overall Model Accuracy (Test Data)");
    } catch (error) {
      console.error("Failed to fetch forecast analytics", error);
      toast.error("Could not connect to Forecasting Engine. Is it running?");
    } finally {
      setLoading(false);
    }
  };

  const handlePredict = async () => {
    try {
      // 1. Get Prediction
      const predResponse = await axios.post(`${FORECAST_API_URL}/predict`, predictionInput);
      setPredictionResult(predResponse.data.prediction);

      // 2. Get Historical Context for Chart
      const statsResponse = await axios.post(`${FORECAST_API_URL}/scenario-stats`, {
        Day_of_Week: predictionInput.Day_of_Week,
        Meal_Type: predictionInput.Meal_Type
      });

      if (statsResponse.data.chart_data && statsResponse.data.chart_data.length > 0) {
        setData(prev => prev ? ({
          ...prev,
          chart_data: statsResponse.data.chart_data
        }) : null);
        setChartTitle(`Historical Trends: ${predictionInput.Day_of_Week} - ${predictionInput.Meal_Type}`);
      }

      toast.success("Prediction & Charts Updated!");
    } catch (error) {
      console.error(error);
      toast.error("Prediction failed");
    }
  };

  if (loading) {
    return <div className="p-8 text-center text-gray-500">Loading Forecasting Models...</div>;
  }

  if (!data) {
    return (
      <div className="p-8 flex flex-col items-center justify-center h-full">
        <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
        <h3 className="text-xl font-semibold text-gray-700">Forecasting Engine Offline</h3>
        <p className="text-gray-500 mt-2 text-center max-w-md">The Python forecasting service (port 5001) looks down. Please start the forecasting API to view analytics.</p>
        <button onClick={fetchAnalytics} className="mt-4 px-4 py-2 bg-brand text-white rounded hover:bg-brand-hover flex items-center gap-2">
          <RefreshCw size={16} /> Retry Connection
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Demand Forecasting</h1>
          <p className="text-gray-500">AI-powered insights for inventory and preparation planning.</p>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium border border-green-200">Model Active (RF)</span>
          <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">MAPE: {data.metrics.mape}%</span>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
            <TrendingUp size={20} className="text-brand" /> {chartTitle}
          </h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.chart_data}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
                <Tooltip
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}
                />
                <Legend />
                <Line type="monotone" dataKey="actual" stroke="#94a3b8" strokeWidth={2} dot={{ r: 4 }} name="Actual Usage" />
                <Line type="monotone" dataKey="predicted" stroke="#4f46e5" strokeWidth={3} dot={{ r: 4 }} name="AI Forecast" />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <h3 className="text-lg font-semibold text-gray-800 mb-4">Key Demand Drivers</h3>
          <div className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.top_drivers} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#f0f0f0" />
                <XAxis type="number" hide />
                <YAxis dataKey="factor" type="category" width={100} tick={{ fontSize: 11 }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: 'transparent' }} />
                <Bar dataKey="importance" fill="#818cf8" radius={[0, 4, 4, 0]} barSize={20} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Simulator */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-6 border-b pb-2">Scenario Simulator</h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Day</label>
            <select
              className="w-full p-2 border rounded-lg text-sm"
              value={predictionInput.Day_of_Week}
              onChange={(e) => setPredictionInput({ ...predictionInput, Day_of_Week: e.target.value })}
            >
              {['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Meal</label>
            <select
              className="w-full p-2 border rounded-lg text-sm"
              value={predictionInput.Meal_Type}
              onChange={(e) => setPredictionInput({ ...predictionInput, Meal_Type: e.target.value })}
            >
              {['Breakfast', 'Lunch', 'Dinner', 'Snacks'].map(d => (
                <option key={d} value={d}>{d}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Type</label>
            <select
              className="w-full p-2 border rounded-lg text-sm"
              value={predictionInput.Is_Veg}
              onChange={(e) => setPredictionInput({ ...predictionInput, Is_Veg: parseInt(e.target.value) })}
            >
              <option value={1}>Veg</option>
              <option value={0}>Non-Veg</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-500 mb-1">Context</label>
            <select
              className="w-full p-2 border rounded-lg text-sm"
              value={predictionInput.Event_Context}
              onChange={(e) => setPredictionInput({ ...predictionInput, Event_Context: e.target.value })}
            >
              <option value="Normal">Normal Day</option>
              <option value="Exam Week">Exam Week</option>
              <option value="Holiday">Holiday/Festival</option>
              <option value="Graduation">Event/Graduation</option>
            </select>
          </div>
          <button
            onClick={handlePredict}
            className="bg-brand hover:bg-brand-hover text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
          >
            Simulate Demand
          </button>
        </div>

        {predictionResult !== null && (
          <div className="mt-6 bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between animate-in fade-in slide-in-from-top-2">
            <div>
              <span className="text-indigo-600 font-medium text-xs uppercase tracking-wider">Predicted Consumption</span>
              <div className="text-2xl font-bold text-gray-900 mt-1">{predictionResult} <span className="text-sm font-normal text-gray-500">units</span></div>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Based on historical patterns for</p>
              <p className="text-sm font-medium text-indigo-900">{predictionInput.Day_of_Week}, {predictionInput.Meal_Type}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ManagerForecasts;
