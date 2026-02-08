import React, { useState, useEffect } from "react";
import {
  AlertCircle,
  Settings,
  Scale,
  Utensils,
  Users,
  Timer,
  RefreshCw,
  Save,
} from "lucide-react";
import Button from "../../components/common/Button";
import {
  getAllSettings,
  bulkUpdateSettings,
} from "../../services/system.service";
import toast from "react-hot-toast";

const POLICY_KEYS = {
  maxBookingsPerDay: "MAX_BOOKINGS_PER_STUDENT_PER_DAY",
  peakBookingWindow: "PEAK_BOOKING_WINDOW_MINS",
  tokenExpiry: "TOKEN_EXPIRY_DURATION_MINS",
  noShowGrace: "NO_SHOW_GRACE_PERIOD_MINS",
  noShowPenalty: "NO_SHOW_PENALTY_DAYS",
  ricePortionLimit: "RICE_PORTION_LIMIT_G",
  curryPortionLimit: "CURRY_PORTION_LIMIT_ML",
  maxCapacityPerSlot: "MAX_CAPACITY_PER_SLOT",
  facultyReserved: "FACULTY_RESERVED_SLOTS",
  guestReserved: "GUEST_RESERVED_SLOTS",
};

const AdminCapacity: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [policies, setPolicies] = useState({
    maxBookingsPerDay: 2,
    peakBookingWindow: 30,
    tokenExpiry: 60,
    noShowGrace: 15,
    noShowPenalty: 7,
    ricePortionLimit: 250,
    curryPortionLimit: 150,
    maxCapacityPerSlot: 200,
    facultyReserved: 50,
    guestReserved: 20,
  });

  useEffect(() => {
    loadPolicies();
  }, []);

  const loadPolicies = async () => {
    setLoading(true);
    try {
      const settings = await getAllSettings("CAPACITY");
      const allSettings = await getAllSettings();
      const map: Record<string, string> = {};
      [...settings, ...allSettings].forEach((s) => {
        map[s.settingKey] = s.settingValue;
      });

      setPolicies({
        maxBookingsPerDay: parseInt(map[POLICY_KEYS.maxBookingsPerDay]) || 2,
        peakBookingWindow: parseInt(map[POLICY_KEYS.peakBookingWindow]) || 30,
        tokenExpiry: parseInt(map[POLICY_KEYS.tokenExpiry]) || 60,
        noShowGrace: parseInt(map[POLICY_KEYS.noShowGrace]) || 15,
        noShowPenalty: parseInt(map[POLICY_KEYS.noShowPenalty]) || 7,
        ricePortionLimit: parseInt(map[POLICY_KEYS.ricePortionLimit]) || 250,
        curryPortionLimit: parseInt(map[POLICY_KEYS.curryPortionLimit]) || 150,
        maxCapacityPerSlot:
          parseInt(map[POLICY_KEYS.maxCapacityPerSlot]) || 200,
        facultyReserved: parseInt(map[POLICY_KEYS.facultyReserved]) || 50,
        guestReserved: parseInt(map[POLICY_KEYS.guestReserved]) || 20,
      });
    } catch {
      toast.error("Failed to load policy settings");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: keyof typeof policies, value: number) => {
    setPolicies((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await bulkUpdateSettings(
        Object.entries(POLICY_KEYS).map(([stateKey, settingKey]) => ({
          key: settingKey,
          value: String(policies[stateKey as keyof typeof policies]),
        })),
      );
      toast.success("All policy changes saved");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save policies");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <RefreshCw size={24} className="animate-spin mr-2" /> Loading
        policies...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">
            Policies & Capacity
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage capacity limits, fairness rules, and serving policies.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw size={16} className="animate-spin mr-2" />
          ) : (
            <Save size={16} className="mr-2" />
          )}
          {saving ? "Saving..." : "Save All Policies"}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Scale size={20} className="text-blue-600" />
              <h3>Fairness Constraints</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Max Bookings / Student / Day
                </label>
                <input
                  type="number"
                  value={policies.maxBookingsPerDay}
                  onChange={(e) =>
                    handleChange(
                      "maxBookingsPerDay",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold"
                />
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700">
                  Peak Booking Window (mins)
                </label>
                <input
                  type="number"
                  value={policies.peakBookingWindow}
                  onChange={(e) =>
                    handleChange(
                      "peakBookingWindow",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Timer size={20} className="text-red-600" />
              <h3>Token Lifecycle Rules</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    Token Expiry Duration
                  </label>
                  <p className="text-xs text-gray-500">Mins after slot end</p>
                </div>
                <input
                  type="number"
                  value={policies.tokenExpiry}
                  onChange={(e) =>
                    handleChange("tokenExpiry", parseInt(e.target.value) || 0)
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-red-700"
                />
              </div>
              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <label className="block text-sm font-medium text-gray-900">
                    No-Show Grace Period
                  </label>
                  <p className="text-xs text-gray-500">Mins before penalty</p>
                </div>
                <input
                  type="number"
                  value={policies.noShowGrace}
                  onChange={(e) =>
                    handleChange("noShowGrace", parseInt(e.target.value) || 0)
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-red-700"
                />
              </div>
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    No-Show Penalty
                  </label>
                  <p className="text-xs text-gray-400">
                    Days to block after violation
                  </p>
                </div>
                <input
                  type="number"
                  value={policies.noShowPenalty}
                  onChange={(e) =>
                    handleChange("noShowPenalty", parseInt(e.target.value) || 0)
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold"
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Utensils size={20} className="text-orange-600" />
              <h3>Serving Rules</h3>
            </div>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">
                  Rice Portion Limit (g)
                </label>
                <input
                  type="number"
                  value={policies.ricePortionLimit}
                  onChange={(e) =>
                    handleChange(
                      "ricePortionLimit",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">
                  Curry Portion Limit (ml)
                </label>
                <input
                  type="number"
                  value={policies.curryPortionLimit}
                  onChange={(e) =>
                    handleChange(
                      "curryPortionLimit",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Settings size={20} className="text-gray-600" />
              <h3>Global Capacity</h3>
            </div>
            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">
                  Max Capacity per Slot
                </label>
                <p className="text-xs text-gray-500 mt-1">
                  Limit across all meal types
                </p>
              </div>
              <input
                type="number"
                value={policies.maxCapacityPerSlot}
                onChange={(e) =>
                  handleChange(
                    "maxCapacityPerSlot",
                    parseInt(e.target.value) || 0,
                  )
                }
                className="w-24 border border-gray-300 rounded px-3 py-2 text-center font-bold text-lg"
              />
            </div>
            <div className="p-4 border border-orange-100 bg-orange-50 rounded-lg flex gap-3 text-sm text-orange-700 mb-6">
              <AlertCircle size={20} className="shrink-0" />
              <p>
                Warning: Reducing capacity below predicted demand may increase
                queue wait times.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
              <Users size={20} className="text-purple-600" />
              <h3>Priority Segments</h3>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    Faculty & Staff
                  </span>
                  <p className="text-xs text-gray-500">
                    Guaranteed reserved slots
                  </p>
                </div>
                <input
                  type="number"
                  value={policies.facultyReserved}
                  onChange={(e) =>
                    handleChange(
                      "facultyReserved",
                      parseInt(e.target.value) || 0,
                    )
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                <div>
                  <span className="text-sm font-semibold text-gray-900">
                    Guests / Events
                  </span>
                  <p className="text-xs text-gray-500">
                    High priority allocation
                  </p>
                </div>
                <input
                  type="number"
                  value={policies.guestReserved}
                  onChange={(e) =>
                    handleChange("guestReserved", parseInt(e.target.value) || 0)
                  }
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm"
                />
              </div>
            </div>

            <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                Token Assignment Logic
              </h4>
              <p className="text-sm text-gray-700 font-mono bg-white p-2 rounded border border-gray-100">
                IF User.Group == Priority THEN Assign_Reserved_Slot
                <br />
                ELSE IF Slot.Capacity &gt; 0 THEN Assign_Standard_Slot
                <br />
                ELSE Add_To_Waitlist
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCapacity;
