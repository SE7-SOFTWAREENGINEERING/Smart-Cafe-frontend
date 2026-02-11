import React, { useState, useEffect } from "react";
import {
  AlertTriangle,
  Leaf,
  CheckCircle,
  Package,
  Loader2,
} from "lucide-react";
import {
  getWasteStats,
  type WasteStats,
} from "../../../services/sustainability.service";
import {
  updateSettingValue,
  getSetting,
} from "../../../services/system.service";
import toast from "react-hot-toast";

const FoodWasteControl: React.FC = () => {
  const [portionSize, setPortionSize] = useState<"Standard" | "Small">(
    "Standard",
  );
  const [surplusAvailable, setSurplusAvailable] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<WasteStats | null>(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        const [wasteStats, portionSetting, surplusSetting] = await Promise.all([
          getWasteStats().catch(() => null),
          getSetting("portion_size").catch(() => null),
          getSetting("surplus_donation_enabled").catch(() => null),
        ]);
        if (wasteStats) setStats(wasteStats);
        if (portionSetting?.settingValue === "Small") setPortionSize("Small");
        if (surplusSetting?.settingValue === "true") setSurplusAvailable(true);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const handlePortionChange = async (size: "Standard" | "Small") => {
    setPortionSize(size);
    try {
      await updateSettingValue("portion_size", size);
    } catch {
      toast.error("Failed to update portion size");
    }
  };

  const handleSurplusToggle = async () => {
    const next = !surplusAvailable;
    setSurplusAvailable(next);
    try {
      await updateSettingValue("surplus_donation_enabled", String(next));
      toast.success(
        next ? "Surplus marked for donation" : "Surplus donation disabled",
      );
    } catch {
      toast.error("Failed to update surplus setting");
    }
  };

  // Compute risk level from waste stats
  const getWasteRisk = () => {
    if (!stats) return { label: "N/A", color: "gray", variance: 0 };
    const highWaste = stats.byWasteAmount
      .filter((w) => ["Most", "All"].includes(w._id))
      .reduce((s, w) => s + w.count, 0);
    const total = stats.totalReports || 1;
    const pct = (highWaste / total) * 100;
    if (pct < 10) return { label: "Low", color: "green", variance: pct };
    if (pct < 30) return { label: "Medium", color: "amber", variance: pct };
    return { label: "High", color: "red", variance: pct };
  };

  const risk = getWasteRisk();

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
          <h3 className="text-gray-500 text-sm font-medium">Food Waste Risk</h3>
          <div className="flex items-baseline gap-2 mt-2">
            <h2 className={`text-3xl font-bold text-${risk.color}-600`}>
              {risk.label}
            </h2>
          </div>
        </div>
        <div className="p-2 bg-green-50 text-green-600 rounded-full">
          <Leaf size={20} />
        </div>
      </div>

      <div className="flex items-center gap-2 mb-6 text-sm text-gray-600">
        <AlertTriangle size={16} className="text-amber-500" />
        <span>
          High-waste reports:{" "}
          <span className="font-medium">~{risk.variance.toFixed(1)}%</span> (
          {stats?.totalReports || 0} total)
        </span>
      </div>

      <div className="space-y-4">
        {/* Portion Control */}
        <div className="bg-gray-50 p-3 rounded-lg">
          <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 block">
            Portion Sizes
          </label>
          <div className="flex bg-white rounded-md border border-gray-200 p-1">
            <button
              onClick={() => handlePortionChange("Standard")}
              className={`flex-1 text-xs py-1.5 rounded font-medium transition ${portionSize === "Standard" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Standard
            </button>
            <button
              onClick={() => handlePortionChange("Small")}
              className={`flex-1 text-xs py-1.5 rounded font-medium transition ${portionSize === "Small" ? "bg-green-600 text-white shadow-sm" : "text-gray-500 hover:bg-gray-50"}`}
            >
              Small (-10%)
            </button>
          </div>
        </div>

        {/* Surplus Management */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">
              Surplus Food Donation
            </span>
            <div className="relative inline-block w-10 mr-2 align-middle select-none transition duration-200 ease-in">
              <input
                type="checkbox"
                name="toggle"
                id="surplus-toggle"
                checked={surplusAvailable}
                onChange={handleSurplusToggle}
                className="toggle-checkbox absolute block w-5 h-5 rounded-full bg-white border-4 appearance-none cursor-pointer peer checked:right-0 checked:border-green-500"
                style={{
                  right: surplusAvailable ? "0" : "auto",
                  left: surplusAvailable ? "auto" : "0",
                }}
              />
              <label
                htmlFor="surplus-toggle"
                className={`toggle-label block overflow-hidden h-5 rounded-full cursor-pointer ${surplusAvailable ? "bg-green-500" : "bg-gray-300"}`}
              ></label>
            </div>
          </div>

          {surplusAvailable ? (
            <div className="bg-green-50 text-green-800 text-xs p-3 rounded-lg border border-green-100 flex items-start gap-2">
              <CheckCircle size={14} className="mt-0.5" />
              <div>
                <p className="font-medium opacity-90">Marked for Donation</p>
                <p className="mt-1 opacity-75">
                  Surplus food has been marked available for donation pickup.
                </p>
              </div>
            </div>
          ) : (
            <div className="bg-gray-50 text-gray-500 text-xs p-3 rounded-lg border border-gray-100 flex items-start gap-2">
              <Package size={14} className="mt-0.5" />
              <p>
                No surplus flagged yet. Toggle when leftover food is confirmed
                available.
              </p>
            </div>
          )}
        </div>
      </div>

      <button className="w-full mt-4 text-center text-xs text-gray-500 hover:text-gray-900 border-t border-gray-100 pt-3">
        View detailed Waste Reports
      </button>
    </div>
  );
};

export default FoodWasteControl;
