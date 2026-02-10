import React, { useState, useEffect } from 'react';
import { AlertCircle, Settings, Scale, Utensils, Users, Timer, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import { getAllSettings, bulkUpdateSettings } from '../../services/system.service';
import toast from 'react-hot-toast';

const AdminCapacity: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState<Record<string, any>>({});

  // Define keys mapping
  const SETTING_KEYS = {
    MAX_BOOKINGS: 'MAX_BOOKINGS_PER_STUDENT',
    PEAK_WINDOW: 'PEAK_BOOKING_WINDOW_MINS',
    TOKEN_EXPIRY: 'TOKEN_EXPIRY_MINS',
    GRACE_PERIOD: 'NO_SHOW_GRACE_MINS',
    PENALTY_DAYS: 'NO_SHOW_PENALTY_DAYS',
    RICE_LIMIT: 'RICE_PORTION_LIMIT_G',
    CURRY_LIMIT: 'CURRY_PORTION_LIMIT_ML',
    MAX_CAPACITY: 'MAX_CAPACITY_PER_SLOT',
    RESERVED_FACULTY: 'PRIORITY_RESERVED_FACULTY',
    RESERVED_GUESTS: 'PRIORITY_RESERVED_GUESTS'
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const data = await getAllSettings();
      const settingsMap: Record<string, any> = {};
      data.forEach(s => {
        settingsMap[s.settingKey] = s.settingValue;
      });
      setSettings(settingsMap);
    } catch (error) {
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (key: string, value: string) => {
    setSettings(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updates = Object.values(SETTING_KEYS).map(key => ({
        key,
        value: settings[key] || ''
      })).filter(u => u.value !== '');

      await bulkUpdateSettings(updates);
      toast.success('Policies saved successfully');
    } catch (error) {
      console.error(error);
      toast.error('Failed to save policies');
    }
  };

  if (loading) return <div className="p-10 text-center">Loading policies...</div>;

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policies & Capacity</h1>
          <p className="text-sm text-gray-500 mt-1">Manage capacity limits, fairness rules, and serving policies.</p>
        </div>
        <Button onClick={handleSave}>
          <Save size={16} className="mr-2" />
          Save Changes
        </Button>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left Column: Constraints & Token Rules */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Scale size={20} className="text-blue-600" />
              <h3>Fairness Constraints</h3>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700">Max Bookings / Student / Day</label>
                <input
                  type="number"
                  value={settings[SETTING_KEYS.MAX_BOOKINGS] || 2}
                  onChange={(e) => handleChange(SETTING_KEYS.MAX_BOOKINGS, e.target.value)}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700">Peak Booking Window (mins)</label>
                <input
                  type="number"
                  value={settings[SETTING_KEYS.PEAK_WINDOW] || 30}
                  onChange={(e) => handleChange(SETTING_KEYS.PEAK_WINDOW, e.target.value)}
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
                  <label className="block text-sm font-medium text-gray-900">Token Expiry Duration</label>
                  <p className="text-xs text-gray-500">Mins after slot end</p>
                </div>
                <input
                  type="number"
                  value={settings[SETTING_KEYS.TOKEN_EXPIRY] || 60}
                  onChange={(e) => handleChange(SETTING_KEYS.TOKEN_EXPIRY, e.target.value)}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-red-700"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-red-50 rounded-lg border border-red-100">
                <div>
                  <label className="block text-sm font-medium text-gray-900">No-Show Grace Period</label>
                  <p className="text-xs text-gray-500">Mins before penalty</p>
                </div>
                <input
                  type="number"
                  value={settings[SETTING_KEYS.GRACE_PERIOD] || 15}
                  onChange={(e) => handleChange(SETTING_KEYS.GRACE_PERIOD, e.target.value)}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold text-red-700"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <div>
                  <label className="block text-sm font-medium text-gray-700">No-Show Penalty</label>
                  <p className="text-xs text-gray-400">Days to block after violation</p>
                </div>
                <input
                  type="number"
                  value={settings[SETTING_KEYS.PENALTY_DAYS] || 7}
                  onChange={(e) => handleChange(SETTING_KEYS.PENALTY_DAYS, e.target.value)}
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
                <label className="text-sm text-gray-700">Rice Portion Limit (g)</label>
                <input
                  type="number"
                  value={settings[SETTING_KEYS.RICE_LIMIT] || 250}
                  onChange={(e) => handleChange(SETTING_KEYS.RICE_LIMIT, e.target.value)}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Curry Portion Limit (ml)</label>
                <input
                  type="number"
                  value={settings[SETTING_KEYS.CURRY_LIMIT] || 150}
                  onChange={(e) => handleChange(SETTING_KEYS.CURRY_LIMIT, e.target.value)}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Capacity & Priorities */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-6 text-gray-900 font-semibold">
              <Settings size={20} className="text-gray-600" />
              <h3>Global Capacity</h3>
            </div>

            <div className="flex justify-between items-center p-4 bg-gray-50 rounded-lg mb-6">
              <div>
                <label className="block text-sm font-medium text-gray-900">Max Capacity per Slot</label>
                <p className="text-xs text-gray-500 mt-1">Limit across all meal types</p>
              </div>
              <input
                type="number"
                value={settings[SETTING_KEYS.MAX_CAPACITY] || 200}
                onChange={(e) => handleChange(SETTING_KEYS.MAX_CAPACITY, e.target.value)}
                className="w-24 border border-gray-300 rounded px-3 py-2 text-center font-bold text-lg"
              />
            </div>

            <div className="p-4 border border-orange-100 bg-orange-50 rounded-lg flex gap-3 text-sm text-orange-700 mb-6">
              <AlertCircle size={20} className="shrink-0" />
              <p>Warning: Reducing capacity below predicted demand (avg 180) may increase queue wait times.</p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex items-center gap-2 mb-4 text-gray-900 font-semibold">
              <Users size={20} className="text-purple-600" />
              <h3>Fairness & Priority Logic</h3>
            </div>

            <div className="space-y-6">
              {/* Priority Config */}
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-3">Priority Segments</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 bg-purple-50 rounded-lg border border-purple-100">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-purple-600 rounded" />
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Faculty & Staff</span>
                        <p className="text-xs text-gray-500">Guaranteed slots</p>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={settings[SETTING_KEYS.RESERVED_FACULTY] || 50}
                      onChange={(e) => handleChange(SETTING_KEYS.RESERVED_FACULTY, e.target.value)}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm" placeholder="Rsrv"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <input type="checkbox" defaultChecked className="w-4 h-4 text-blue-600 rounded" />
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Guests / Events</span>
                        <p className="text-xs text-gray-500">High priority allocation</p>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={settings[SETTING_KEYS.RESERVED_GUESTS] || 20}
                      onChange={(e) => handleChange(SETTING_KEYS.RESERVED_GUESTS, e.target.value)}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm" placeholder="Rsrv"
                    />
                  </div>
                </div>
              </div>

              {/* Logic Visualizer */}
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200">
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Token Assignment Logic</h4>
                <p className="text-sm text-gray-700 font-mono bg-white p-2 rounded border border-gray-100">
                  IF User.Group == Priority THEN Assign_Reserved_Slot<br />
                  ELSE IF Slot.Capacity &gt; 0 THEN Assign_Standard_Slot<br />
                  ELSE Add_To_Waitlist
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCapacity;
