import React, { useState, useEffect } from "react";
import {
  Filter,
  BarChart2,
  CheckCircle,
  Loader2,
  TrendingUp,
  RefreshCw,
  AlertCircle,
  Cloud,
  Sun,
  CloudRain,
} from "lucide-react";
import {
  getWeeklyForecast,
  getDailyForecast,
  getAccuracyMetrics,
  recordActual,
  type DailyForecast,
  type MealForecast,
  type AccuracyMetrics,
} from "../../services/forecast.service";
import { API_CONFIG } from "../../services/api.config";
import axios from "axios";
import toast from "react-hot-toast";

// Python ML API Types
interface MLAnalyticsData {
  total_records: number;
  average_demand: number;
  metrics: { mape: number; rmse: number };
  top_drivers: Array<{ factor: string; importance: number }>;
  chart_data: Array<{ day: string; actual: number; predicted: number }>;
}

const FORECAST_API_URL = API_CONFIG.FORECAST_API_URL;

const ManagerForecasts: React.FC = () => {
  const [timeFilter, setTimeFilter] = useState("Week");
  const [mealFilter, setMealFilter] = useState("All");
  const [loading, setLoading] = useState(true);

  // Chart data from weekly forecast
  const [chartData, setChartData] = useState<number[]>([]);
  const [chartLabels, setChartLabels] = useState<string[]>([]);

  // Item-wise predictions from daily forecast
  const [predictions, setPredictions] = useState<MealForecast[]>([]);
  const [accuracy, setAccuracy] = useState<AccuracyMetrics | null>(null);

  // ML Engine State
  const [mlData, setMlData] = useState<MLAnalyticsData | null>(null);
  const [mlOnline, setMlOnline] = useState(false);
  const [mlLoading, setMlLoading] = useState(true);
  const [predictionInput, setPredictionInput] = useState({
    Day_of_Week: "Monday",
    Meal_Type: "Lunch",
    Is_Veg: 1,
    Event_Context: "Normal",
    Weather: "Sunny",
  });
  const [predictionResult, setPredictionResult] = useState<number | null>(null);
  const [mlChartTitle, setMlChartTitle] = useState(
    "Overall Model Accuracy (Test Data)",
  );

  // Fetch ML analytics from Python API
  const fetchMlAnalytics = async () => {
    setMlLoading(true);
    try {
      const response = await axios.get(`${FORECAST_API_URL}/analytics`);
      setMlData(response.data);
      setMlOnline(true);
      setMlChartTitle("Overall Model Accuracy (Test Data)");
    } catch {
      setMlOnline(false);
      setMlData(null);
    } finally {
      setMlLoading(false);
    }
  };

  // Run scenario simulation
  const handleSimulate = async () => {
    try {
      const predResponse = await axios.post(
        `${FORECAST_API_URL}/predict`,
        predictionInput,
      );
      setPredictionResult(predResponse.data.prediction);

      const statsResponse = await axios.post(
        `${FORECAST_API_URL}/scenario-stats`,
        {
          Day_of_Week: predictionInput.Day_of_Week,
          Meal_Type: predictionInput.Meal_Type,
        },
      );

      if (
        statsResponse.data.chart_data &&
        statsResponse.data.chart_data.length > 0
      ) {
        setMlData((prev) =>
          prev ? { ...prev, chart_data: statsResponse.data.chart_data } : null,
        );
        setMlChartTitle(
          `Historical Trends: ${predictionInput.Day_of_Week} - ${predictionInput.Meal_Type}`,
        );
      }
      toast.success("Prediction & Charts Updated!");
    } catch {
      toast.error("Prediction failed. Is the Forecasting API running?");
    }
  };

  // Fetch ML analytics on mount
  useEffect(() => {
    fetchMlAnalytics();
  }, []);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [weekly, daily, acc] = await Promise.all([
          getWeeklyForecast().catch(() => []),
          getDailyForecast().catch(() => null),
          getAccuracyMetrics().catch(() => null),
        ]);

        // Process weekly data for chart
        const weeklyArr = Array.isArray(weekly) ? weekly : [];
        const labels: string[] = [];
        const values: number[] = [];
        weeklyArr.forEach((day: DailyForecast) => {
          const d = new Date(day.date);
          labels.push(d.toLocaleDateString("en-IN", { weekday: "short" }));
          const dayTotal = (day.forecasts || []).reduce(
            (s: number, f: MealForecast) => s + (f.predictedCount || 0),
            0,
          );
          values.push(dayTotal);
        });
        setChartLabels(labels);
        setChartData(values);

        // Process daily predictions for table
        if (daily?.forecasts) {
          let filtered = daily.forecasts;
          if (mealFilter !== "All") {
            filtered = filtered.filter(
              (f) => f.mealType === mealFilter.toUpperCase(),
            );
          }
          setPredictions(filtered);
        }

        if (acc) setAccuracy(acc);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [timeFilter, mealFilter]);

  const maxVal = chartData.length > 0 ? Math.max(...chartData) : 1;

  const getAccuracyForMeal = (mealType: string) => {
    if (!accuracy?.byMealType) return null;
    return accuracy.byMealType.find((m) => m._id === mealType);
  };

  const handleAccept = async (forecast: MealForecast) => {
    try {
      await recordActual(
        forecast.date,
        forecast.mealType,
        forecast.predictedCount,
      );
      toast.success(`Accepted forecast for ${forecast.mealType}`);
    } catch {
      toast.error("Failed to record acceptance");
    }
  };

  const getWeatherIcon = (condition: string) => {
    const lower = condition?.toLowerCase() || "";
    if (lower.includes("rain")) return <CloudRain size={14} />;
    if (lower.includes("cloud")) return <Cloud size={14} />;
    return <Sun size={14} />;
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Forecast Analytics
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            AI-driven demand prediction and planning.
          </p>
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
            <option value="All">All Types</option>
            <option value="BREAKFAST">Breakfast</option>
            <option value="LUNCH">Lunch</option>
            <option value="DINNER">Dinner</option>
          </select>
        </div>
      </div>

      {/* Chart Visualization */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-6">
          <h3 className="font-semibold text-gray-900 flex items-center gap-2">
            <BarChart2 size={18} className="text-blue-600" />
            Demand Trend
          </h3>
          <span className="text-xs font-medium px-2 py-1 bg-blue-50 text-blue-600 rounded">
            {chartLabels.length > 0 ? `${chartLabels.length} Days` : "No Data"}
          </span>
        </div>

        {loading ? (
          <div className="h-64 flex items-center justify-center">
            <Loader2 className="animate-spin text-gray-300" size={32} />
          </div>
        ) : chartData.length === 0 ? (
          <div className="h-64 flex items-center justify-center text-gray-400 text-sm">
            No forecast data available
          </div>
        ) : (
          <div className="h-64 flex">
            {/* Y-axis labels */}
            <div className="flex flex-col justify-between h-48 pr-2 text-right self-start mt-1">
              <span className="text-[10px] text-gray-400">{maxVal}</span>
              <span className="text-[10px] text-gray-400">
                {Math.round(maxVal * 0.75)}
              </span>
              <span className="text-[10px] text-gray-400">
                {Math.round(maxVal * 0.5)}
              </span>
              <span className="text-[10px] text-gray-400">
                {Math.round(maxVal * 0.25)}
              </span>
              <span className="text-[10px] text-gray-400">0</span>
            </div>
            {/* Bars */}
            <div className="flex-1 flex items-end justify-between gap-2">
              {chartData.map((value, index) => {
                // Ensure minimum 8% height so bars with similar values are distinguishable
                const barPct = Math.max(
                  (value / maxVal) * 100,
                  value > 0 ? 8 : 0,
                );
                return (
                  <div
                    key={index}
                    className="flex flex-col items-center gap-1 flex-1 group"
                  >
                    {/* Value label above bar */}
                    <span className="text-[10px] font-semibold text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity">
                      {value}
                    </span>
                    <div className="relative w-full flex justify-center items-end h-48 bg-gray-50 rounded-lg overflow-hidden border border-gray-100">
                      <div
                        className="w-full mx-1 rounded-t-sm transition-all duration-500 group-hover:opacity-90"
                        style={{
                          height: `${barPct}%`,
                          background: `linear-gradient(to top, #2563eb, #60a5fa)`,
                        }}
                      >
                        {/* Value inside bar for taller bars */}
                        {barPct > 30 && (
                          <div className="text-[10px] text-white font-bold text-center mt-1">
                            {value}
                          </div>
                        )}
                      </div>
                      {/* Tooltip */}
                      <div className="absolute opacity-0 group-hover:opacity-100 bottom-full mb-2 bg-gray-800 text-white text-xs py-1 px-2 rounded shadow transition-opacity z-10 whitespace-nowrap">
                        {chartLabels[index]}: {value} meals
                      </div>
                    </div>
                    <span className="text-xs text-gray-500 font-medium">
                      {chartLabels[index] || ""}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Forecast Table */}
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 className="font-semibold mb-4 text-gray-900">
          Meal-wise Predictions
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 font-medium">
              <tr>
                <th className="px-4 py-3 rounded-l-lg">Meal Type</th>
                <th className="px-4 py-3">Predicted Qty</th>
                <th className="px-4 py-3">Actual</th>
                <th className="px-4 py-3">Weather</th>
                <th className="px-4 py-3">Accuracy</th>
                <th className="px-4 py-3 rounded-r-lg">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan={6} className="text-center py-8">
                    <Loader2
                      className="animate-spin inline text-gray-300"
                      size={24}
                    />
                  </td>
                </tr>
              ) : predictions.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-8 text-gray-400">
                    No forecast predictions available
                  </td>
                </tr>
              ) : (
                predictions.map((forecast) => {
                  const mealAcc = getAccuracyForMeal(forecast.mealType);
                  const accPct =
                    forecast.accuracy || mealAcc?.averageAccuracy || 0;
                  return (
                    <tr
                      key={forecast.id || forecast.mealType}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-3 font-medium text-gray-900">
                        {forecast.mealType}
                      </td>
                      <td className="px-4 py-3">
                        {forecast.predictedCount} meals
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        {forecast.actualCount ?? "—"}
                      </td>
                      <td className="px-4 py-3 text-gray-500">
                        <span className="flex items-center gap-1">
                          {getWeatherIcon(forecast.weatherCondition)}
                          {forecast.weatherCondition || "Unknown"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <div className="w-16 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className={`h-full ${accPct >= 80 ? "bg-green-500" : accPct >= 60 ? "bg-yellow-500" : "bg-red-500"}`}
                              style={{ width: `${accPct}%` }}
                            ></div>
                          </div>
                          <span className="text-xs text-gray-500">
                            {Math.round(accPct)}%
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => handleAccept(forecast)}
                            className="p-1.5 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            title="Accept Prediction"
                          >
                            <CheckCircle size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ========== AI FORECASTING ENGINE (Python ML API) ========== */}
      <div className="border-t-2 border-gray-200 pt-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
              <TrendingUp size={22} className="text-indigo-600" />
              AI Forecasting Engine
            </h2>
            <p className="text-sm text-gray-500 mt-1">
              ML-powered demand prediction via Random Forest model
            </p>
          </div>
          <div className="flex gap-2 items-center">
            <span
              className={`px-3 py-1 rounded-full text-xs font-medium border ${mlOnline ? "bg-green-100 text-green-700 border-green-200" : "bg-red-100 text-red-700 border-red-200"}`}
            >
              {mlOnline ? "Engine Online" : "Engine Offline"}
            </span>
            {mlData?.metrics && (
              <span className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                MAPE: {mlData.metrics.mape}%
              </span>
            )}
            <button
              onClick={fetchMlAnalytics}
              className="p-2 text-gray-400 hover:text-gray-600"
            >
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {mlLoading ? (
          <div className="p-8 text-center text-gray-500">
            <Loader2 className="animate-spin inline mr-2" size={20} />
            Connecting to Forecasting Engine...
          </div>
        ) : !mlOnline || !mlData ? (
          <div className="p-8 flex flex-col items-center justify-center bg-white rounded-xl border border-gray-100 shadow-sm">
            <AlertCircle className="w-12 h-12 text-red-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-700">
              Forecasting Engine Offline
            </h3>
            <p className="text-gray-500 mt-2 text-center max-w-md">
              The Python forecasting service (port 5001) is not running. Start
              it to view ML analytics and run simulations.
            </p>
            <button
              onClick={fetchMlAnalytics}
              className="mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 flex items-center gap-2"
            >
              <RefreshCw size={16} /> Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* ML Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              {/* Actual vs Predicted Chart */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-800 mb-4 flex items-center gap-2">
                  <TrendingUp size={18} className="text-indigo-600" />
                  {mlChartTitle}
                </h3>
                <div className="space-y-2">
                  {mlData.chart_data.slice(0, 10).map((item, idx) => (
                    <div key={idx} className="flex items-center gap-3 text-sm">
                      <span className="w-16 text-gray-500 text-xs truncate">
                        {item.day}
                      </span>
                      <div className="flex-1 flex gap-1 items-center">
                        <div
                          className="h-3 bg-gray-300 rounded"
                          style={{
                            width: `${(item.actual / Math.max(...mlData.chart_data.map((d) => Math.max(d.actual, d.predicted)))) * 100}%`,
                          }}
                          title={`Actual: ${item.actual}`}
                        ></div>
                      </div>
                      <div className="flex-1 flex gap-1 items-center">
                        <div
                          className="h-3 bg-indigo-500 rounded"
                          style={{
                            width: `${(item.predicted / Math.max(...mlData.chart_data.map((d) => Math.max(d.actual, d.predicted)))) * 100}%`,
                          }}
                          title={`Predicted: ${Math.round(item.predicted)}`}
                        ></div>
                      </div>
                      <span className="text-xs text-gray-400 w-20 text-right">
                        {item.actual} / {Math.round(item.predicted)}
                      </span>
                    </div>
                  ))}
                </div>
                <div className="flex gap-4 mt-3 text-xs text-gray-400">
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-gray-300 rounded inline-block"></span>
                    Actual
                  </span>
                  <span className="flex items-center gap-1">
                    <span className="w-3 h-2 bg-indigo-500 rounded inline-block"></span>
                    AI Forecast
                  </span>
                </div>
              </div>

              {/* Key Demand Drivers */}
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="text-base font-semibold text-gray-800 mb-4">
                  Key Demand Drivers
                </h3>
                <div className="space-y-3">
                  {mlData.top_drivers.map((driver, idx) => {
                    const maxImp = Math.max(
                      ...mlData.top_drivers.map((d) => d.importance),
                    );
                    const pct =
                      maxImp > 0 ? (driver.importance / maxImp) * 100 : 0;
                    return (
                      <div key={idx}>
                        <div className="flex justify-between text-sm mb-1">
                          <span className="text-gray-600 truncate">
                            {driver.factor}
                          </span>
                          <span className="text-gray-900 font-medium">
                            {(driver.importance * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="w-full bg-gray-100 rounded-full h-2">
                          <div
                            className="bg-indigo-400 h-full rounded-full"
                            style={{ width: `${pct}%` }}
                          ></div>
                        </div>
                      </div>
                    );
                  })}
                </div>
                <div className="mt-4 pt-3 border-t border-gray-100 text-xs text-gray-400">
                  <p>
                    {mlData.total_records.toLocaleString()} records analysed |
                    Avg. demand: {mlData.average_demand.toFixed(0)} units
                  </p>
                </div>
              </div>
            </div>

            {/* Scenario Simulator */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
              <h3 className="text-base font-semibold text-gray-800 mb-6 border-b pb-2">
                Scenario Simulator
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end">
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Day
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm"
                    value={predictionInput.Day_of_Week}
                    onChange={(e) =>
                      setPredictionInput({
                        ...predictionInput,
                        Day_of_Week: e.target.value,
                      })
                    }
                  >
                    {[
                      "Monday",
                      "Tuesday",
                      "Wednesday",
                      "Thursday",
                      "Friday",
                      "Saturday",
                      "Sunday",
                    ].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Meal
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm"
                    value={predictionInput.Meal_Type}
                    onChange={(e) =>
                      setPredictionInput({
                        ...predictionInput,
                        Meal_Type: e.target.value,
                      })
                    }
                  >
                    {["Breakfast", "Lunch", "Dinner", "Snacks"].map((d) => (
                      <option key={d} value={d}>
                        {d}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Type
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm"
                    value={predictionInput.Is_Veg}
                    onChange={(e) =>
                      setPredictionInput({
                        ...predictionInput,
                        Is_Veg: parseInt(e.target.value),
                      })
                    }
                  >
                    <option value={1}>Veg</option>
                    <option value={0}>Non-Veg</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-500 mb-1">
                    Context
                  </label>
                  <select
                    className="w-full p-2 border rounded-lg text-sm"
                    value={predictionInput.Event_Context}
                    onChange={(e) =>
                      setPredictionInput({
                        ...predictionInput,
                        Event_Context: e.target.value,
                      })
                    }
                  >
                    <option value="Normal">Normal Day</option>
                    <option value="Exam Week">Exam Week</option>
                    <option value="Holiday">Holiday/Festival</option>
                    <option value="Graduation">Event/Graduation</option>
                  </select>
                </div>
                <button
                  onClick={handleSimulate}
                  className="bg-indigo-600 hover:bg-indigo-700 text-white py-2 px-4 rounded-lg text-sm font-medium transition-colors"
                >
                  Simulate Demand
                </button>
              </div>

              {predictionResult !== null && (
                <div className="mt-6 bg-indigo-50 border border-indigo-100 p-4 rounded-lg flex items-center justify-between">
                  <div>
                    <span className="text-indigo-600 font-medium text-xs uppercase tracking-wider">
                      Predicted Consumption
                    </span>
                    <div className="text-2xl font-bold text-gray-900 mt-1">
                      {predictionResult}{" "}
                      <span className="text-sm font-normal text-gray-500">
                        units
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">
                      Based on historical patterns for
                    </p>
                    <p className="text-sm font-medium text-indigo-900">
                      {predictionInput.Day_of_Week}, {predictionInput.Meal_Type}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ManagerForecasts;

