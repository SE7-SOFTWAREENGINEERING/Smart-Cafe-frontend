import React, { useState, useEffect } from "react";
import { Leaf, Award, Recycle, Loader2 } from "lucide-react";
import Button from "../../components/common/Button";
import * as sustainabilityService from "../../services/sustainability.service";
import type {
  SustainabilityMetrics,
  WasteReport,
} from "../../services/sustainability.service";
import toast from "react-hot-toast";

const StudentSustainability: React.FC = () => {
  const [wasteMealType, setWasteMealType] = useState("LUNCH");
  const [wasteAmount, setWasteAmount] = useState<string>("Little");
  const [wasteReason, setWasteReason] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [metrics, setMetrics] = useState<SustainabilityMetrics | null>(null);
  const [recentReports, setRecentReports] = useState<WasteReport[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [metricsData, reportsData] = await Promise.all([
        sustainabilityService.getSustainabilityMetrics().catch(() => null),
        sustainabilityService
          .getMyWasteReports({ limit: 5 })
          .catch(() => ({ reports: [], total: 0 })),
      ]);
      setMetrics(metricsData);
      setRecentReports(reportsData.reports);
    } catch (error) {
      console.error("Failed to load sustainability data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleWasteReport = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await sustainabilityService.submitWasteReport({
        wasteAmount,
        reason: wasteReason,
        mealType: wasteMealType,
      });
      toast.success("Waste report submitted. Thank you for your honesty!");
      setWasteReason("");
      setWasteAmount("Little");
      // Refresh data
      loadData();
    } catch (error) {
      console.error("Failed to submit waste report:", error);
      toast.error("Failed to submit report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const ecoScore = metrics?.currentEcoScore ?? 0;
  const improvement = metrics?.improvement ?? 0;
  const totalReports = metrics?.totalReportsThisMonth ?? 0;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Sustainability & Eco-Score
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Track your impact and help us reduce waste.
          </p>
        </div>
        <div className="bg-green-100 text-green-800 px-4 py-2 rounded-full font-bold flex items-center gap-2">
          <Leaf size={18} />
          {loading ? "..." : `${ecoScore} pts`}
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
              {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-400">
                  <Loader2 className="animate-spin" size={14} /> Loading...
                </div>
              ) : (
                <p className="text-sm text-gray-500">
                  {improvement > 0
                    ? `Your eco-score improved by ${improvement.toFixed(1)}% this month!`
                    : `${totalReports} report${totalReports !== 1 ? "s" : ""} submitted this month`}
                </p>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Eco Score</span>
                <span className="font-semibold text-gray-900">
                  {ecoScore} / 100
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2">
                <div
                  className="bg-green-500 h-2 rounded-full transition-all"
                  style={{ width: `${Math.min(100, ecoScore)}%` }}
                ></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-600">Reports This Month</span>
                <span className="font-semibold text-gray-900">
                  {totalReports}
                </span>
              </div>
            </div>
          </div>

          {recentReports.length > 0 && (
            <div className="mt-6 pt-6 border-t border-gray-100">
              <h4 className="font-semibold text-gray-900 mb-3">
                Recent Reports
              </h4>
              <div className="space-y-2">
                {recentReports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="flex justify-between items-center text-sm"
                  >
                    <span className="text-gray-600">
                      {report.mealType || "Meal"}
                    </span>
                    <span
                      className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        report.wasteAmount === "None"
                          ? "bg-green-100 text-green-700"
                          : report.wasteAmount === "Little"
                            ? "bg-yellow-100 text-yellow-700"
                            : "bg-red-100 text-red-700"
                      }`}
                    >
                      {report.wasteAmount}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Waste Reporting Form */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-3 mb-6">
            <div className="bg-amber-100 p-3 rounded-full text-amber-600">
              <Recycle size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">
                Report Food Waste
              </h3>
              <p className="text-sm text-gray-500">
                Honest reporting helps us improve portion sizes.
              </p>
            </div>
          </div>

          <form onSubmit={handleWasteReport} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Meal Type
              </label>
              <select
                value={wasteMealType}
                onChange={(e) => setWasteMealType(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="BREAKFAST">Breakfast</option>
                <option value="LUNCH">Lunch</option>
                <option value="DINNER">Dinner</option>
                <option value="SNACKS">Snacks</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Waste Amount
              </label>
              <select
                value={wasteAmount}
                onChange={(e) => setWasteAmount(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none"
              >
                <option value="None">None (ate everything)</option>
                <option value="Little">A Little</option>
                <option value="Some">Some</option>
                <option value="Most">Most</option>
                <option value="All">All (didn't eat)</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Waste (optional)
              </label>
              <textarea
                value={wasteReason}
                onChange={(e) => setWasteReason(e.target.value)}
                placeholder="E.g., Portion too large, Food cold, Taste issue..."
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 outline-none h-24 resize-none"
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
