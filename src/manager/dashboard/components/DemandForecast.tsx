import React, { useState, useEffect } from "react";
import {
  TrendingUp,
  TrendingDown,
  Sun,
  Calendar,
  Info,
  Check,
  X,
  ChevronDown,
  ChevronUp,
  Loader2,
} from "lucide-react";
import {
  getDailyForecast,
  type MealForecast,
} from "../../../services/forecast.service";

interface Props {
  mealType?: string;
}

const DemandForecast: React.FC<Props> = ({ mealType }) => {
  const [showBreakdown, setShowBreakdown] = useState(false);
  const [showAIRecommendation, setShowAIRecommendation] = useState(true);
  const [loading, setLoading] = useState(true);
  const [forecasts, setForecasts] = useState<MealForecast[]>([]);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const data = await getDailyForecast();
        setForecasts(data.forecasts || []);
      } catch {
        setForecasts([]);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [mealType]);

  // Sum approximation rounding: individual meals to nearest 5, total to nearest 10
  const roundTo5 = (v: number) => Math.round(v / 5) * 5;
  const roundTo10 = (v: number) => Math.round(v / 10) * 10;

  const rawTotal = forecasts.reduce(
    (s, f) => s + (f.predictedCount || 0),
    0,
  );
  const totalPredicted = roundTo10(rawTotal);
  const totalActual = forecasts.reduce((s, f) => s + (f.actualCount || 0), 0);
  const changePercent =
    totalActual > 0
      ? Math.round(((totalPredicted - totalActual) / totalActual) * 100)
      : 0;
  const weatherInfo = forecasts[0]?.weatherCondition || "";
  const specialPeriod = forecasts[0]?.isSpecialPeriod
    ? forecasts[0].specialPeriodType
    : "";

  if (loading) {
    return (
      <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full flex items-center justify-center min-h-[250px]">
        <Loader2 className="animate-spin text-gray-400" size={28} />
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-gray-500 text-sm font-medium">
            Predicted Demand
          </h3>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className="text-3xl font-bold text-gray-900">
              {totalPredicted.toLocaleString()}
            </h2>
            <span className="text-sm text-gray-500">meals</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          {weatherInfo && (
            <div className="bg-orange-50 text-orange-600 px-2 py-1 rounded text-xs font-medium flex items-center gap-1 mb-1">
              <Sun size={12} /> {weatherInfo}
            </div>
          )}
          {specialPeriod && (
            <div className="bg-brand-light text-brand px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
              <Calendar size={12} /> {specialPeriod}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6">
        <span
          className={`flex items-center text-sm font-medium px-2 py-0.5 rounded-full ${changePercent >= 0 ? "text-green-600 bg-green-50" : "text-red-600 bg-red-50"}`}
        >
          {changePercent >= 0 ? (
            <TrendingUp size={14} className="mr-1" />
          ) : (
            <TrendingDown size={14} className="mr-1" />
          )}
          {changePercent >= 0 ? "+" : ""}
          {changePercent}%
        </span>
        {totalActual > 0 && (
          <span className="text-xs text-gray-400">
            vs last actual ({totalActual.toLocaleString()})
          </span>
        )}
      </div>

      {showAIRecommendation && totalPredicted > 0 && (
        <div className="bg-brand-light border border-brand/20 rounded-lg p-3 mb-4">
          <div className="flex items-start gap-2">
            <div className="mt-0.5 text-brand">
              <Info size={16} />
            </div>
            <div className="flex-1">
              <p className="text-xs font-medium text-gray-900">
                AI Recommendation
              </p>
              <p className="text-xs text-brand-hover mt-0.5">
                Prepare for {totalPredicted.toLocaleString()} meals today
                {specialPeriod ? ` (${specialPeriod})` : ""}.
              </p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => setShowAIRecommendation(false)}
                  className="bg-brand text-white text-xs px-2 py-1 rounded hover:bg-brand-hover transition flex items-center gap-1"
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
            {forecasts.map((f) => {
              const roundedCount = roundTo5(f.predictedCount);
              const pct =
                totalPredicted > 0
                  ? Math.round((roundedCount / totalPredicted) * 100)
                  : 0;
              const colors: Record<string, string> = {
                BREAKFAST: "bg-orange-500",
                LUNCH: "bg-green-500",
                DINNER: "bg-blue-500",
                SNACKS: "bg-red-500",
              };
              return (
                <div key={f.id || f.mealType}>
                  <div className="flex justify-between items-center text-sm">
                    <span className="text-gray-500">{f.mealType}</span>
                    <span className="font-medium text-gray-900">
                      {roundedCount}
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                    <div
                      className={`${colors[f.mealType] || "bg-gray-500"} h-full rounded-full`}
                      style={{ width: `${pct}%` }}
                    ></div>
                  </div>
                </div>
              );
            })}

            <button className="text-xs text-brand font-medium mt-2 hover:underline">
              View Item-wise Details &rarr;
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DemandForecast;
