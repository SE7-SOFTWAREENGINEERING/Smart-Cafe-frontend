import React, { useState, useEffect } from "react";
import {
  Settings,
  Bell,
  Calendar,
  ShieldAlert,
  Save,
  RefreshCw,
} from "lucide-react";
import Button from "../../components/common/Button";
import {
  getAllSettings,
  bulkUpdateSettings,
} from "../../services/system.service";
import toast from "react-hot-toast";

const SETTING_KEYS = {
  maintenanceMode: "maintenance_mode",
  publicRegistration: "public_registration",
  betaFeatures: "beta_features",
  reminderTime: "reminder_time_mins",
  digestTime: "daily_digest_time",
  semStart: "semester_start",
  semEnd: "semester_end",
};

const DEFAULTS = {
  maintenanceMode: false,
  publicRegistration: true,
  betaFeatures: false,
  reminderTime: 30,
  digestTime: "09:00",
  semStart: "2024-01-01",
  semEnd: "2024-05-31",
};

const AdminSettings: React.FC = () => {
  const [config, setConfig] = useState(DEFAULTS);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const settings = await getAllSettings();
      const map: Record<string, string> = {};
      settings.forEach((s) => {
        map[s.settingKey] = s.settingValue;
      });

      setConfig({
        maintenanceMode: map[SETTING_KEYS.maintenanceMode] === "true",
        publicRegistration: map[SETTING_KEYS.publicRegistration] !== "false",
        betaFeatures: map[SETTING_KEYS.betaFeatures] === "true",
        reminderTime: parseInt(map[SETTING_KEYS.reminderTime]) || 30,
        digestTime: map[SETTING_KEYS.digestTime] || "09:00",
        semStart: map[SETTING_KEYS.semStart] || "2024-01-01",
        semEnd: map[SETTING_KEYS.semEnd] || "2024-05-31",
      });
    } catch {
      toast.error("Failed to load settings");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (key: keyof typeof config) => {
    setConfig((prev) => ({
      ...prev,
      [key]: !prev[key as keyof typeof config],
    }));
  };

  const handleChange = (key: keyof typeof config, value: string | number) => {
    setConfig((prev) => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await bulkUpdateSettings([
        {
          key: SETTING_KEYS.maintenanceMode,
          value: String(config.maintenanceMode),
        },
        {
          key: SETTING_KEYS.publicRegistration,
          value: String(config.publicRegistration),
        },
        { key: SETTING_KEYS.betaFeatures, value: String(config.betaFeatures) },
        { key: SETTING_KEYS.reminderTime, value: String(config.reminderTime) },
        { key: SETTING_KEYS.digestTime, value: config.digestTime },
        { key: SETTING_KEYS.semStart, value: config.semStart },
        { key: SETTING_KEYS.semEnd, value: config.semEnd },
      ]);
      toast.success("Settings saved successfully");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const handleReset = async () => {
    if (
      !window.confirm(
        "DANGER: This will reset all system configurations to default. Continue?",
      )
    )
      return;
    setSaving(true);
    try {
      const defaults = DEFAULTS;
      await bulkUpdateSettings([
        {
          key: SETTING_KEYS.maintenanceMode,
          value: String(defaults.maintenanceMode),
        },
        {
          key: SETTING_KEYS.publicRegistration,
          value: String(defaults.publicRegistration),
        },
        {
          key: SETTING_KEYS.betaFeatures,
          value: String(defaults.betaFeatures),
        },
        {
          key: SETTING_KEYS.reminderTime,
          value: String(defaults.reminderTime),
        },
        { key: SETTING_KEYS.digestTime, value: defaults.digestTime },
        { key: SETTING_KEYS.semStart, value: defaults.semStart },
        { key: SETTING_KEYS.semEnd, value: defaults.semEnd },
      ]);
      setConfig(defaults);
      toast.success("Configuration reset to defaults");
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Failed to reset");
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-gray-400">
        <RefreshCw size={24} className="animate-spin mr-2" /> Loading
        settings...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Global Settings</h1>
          <p className="text-sm text-gray-500 mt-1">
            Configure application-wide parameters and preferences.
          </p>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          {saving ? (
            <RefreshCw size={16} className="animate-spin mr-2" />
          ) : (
            <Save size={16} className="mr-2" />
          )}
          {saving ? "Saving..." : "Save Changes"}
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Feature Toggles */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
            <Settings size={20} className="text-blue-600" />
            <h3>Feature Toggles</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Maintenance Mode
                </span>
                <p className="text-xs text-gray-500">
                  Disable access for non-admins
                </p>
              </div>
              <button
                onClick={() => handleToggle("maintenanceMode")}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${config.maintenanceMode ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${config.maintenanceMode ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Public Registration
                </span>
                <p className="text-xs text-gray-500">
                  Allow new users to sign up
                </p>
              </div>
              <button
                onClick={() => handleToggle("publicRegistration")}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${config.publicRegistration ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${config.publicRegistration ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>

            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <span className="text-sm font-medium text-gray-900">
                  Beta Features
                </span>
                <p className="text-xs text-gray-500">
                  Enable experimental tools
                </p>
              </div>
              <button
                onClick={() => handleToggle("betaFeatures")}
                className={`w-11 h-6 flex items-center rounded-full transition-colors ${config.betaFeatures ? "bg-blue-600" : "bg-gray-300"}`}
              >
                <span
                  className={`w-4 h-4 bg-white rounded-full shadow transform transition-transform ${config.betaFeatures ? "translate-x-6" : "translate-x-1"}`}
                />
              </button>
            </div>
          </div>
        </div>

        {/* Notifications & Calendar */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Bell size={20} className="text-orange-600" />
              <h3>Notification Config</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Reminder Time (mins)
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={config.reminderTime}
                  onChange={(e) =>
                    handleChange("reminderTime", parseInt(e.target.value) || 0)
                  }
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Daily Digest Time
                </label>
                <input
                  type="time"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={config.digestTime}
                  onChange={(e) => handleChange("digestTime", e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Calendar size={20} className="text-purple-600" />
              <h3>Academic Calendar</h3>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester Start
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={config.semStart}
                  onChange={(e) => handleChange("semStart", e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Semester End
                </label>
                <input
                  type="date"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  value={config.semEnd}
                  onChange={(e) => handleChange("semEnd", e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Danger Zone */}
      <div className="mt-8 border-t border-gray-200 pt-8">
        <div className="bg-red-50 border border-red-100 rounded-xl p-6 flex items-center justify-between">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-red-100 rounded-full text-red-600">
              <ShieldAlert size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-red-900">Danger Zone</h3>
              <p className="text-sm text-red-700 mt-1">
                Resetting system configurations will revert all settings to
                their default factory state. This action cannot be undone.
              </p>
            </div>
          </div>
          <Button variant="danger" onClick={handleReset} disabled={saving}>
            <RefreshCw size={16} className="mr-2" />
            Reset System Config
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AdminSettings;

