import React, { useState, useEffect } from 'react';
import { AlertCircle, Settings, Scale, Utensils, Users, Timer, Save } from 'lucide-react';
import Button from '../../components/common/Button';
import { getSettingByKey, saveSystemSetting } from '../../services/system.service';
import toast from 'react-hot-toast';

const AdminCapacity: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [config, setConfig] = useState({
    maxBookingsPerStudent: 2,
    peakBookingWindow: 30,
    tokenExpiryDuration: 60,
    noShowGracePeriod: 15,
    noShowPenaltyDays: 7,
    ricePortionLimit: 250,
    curryPortionLimit: 150,
    maxCapacityPerSlot: 200,
    reservedFaculty: 50,
    reservedGuests: 20
  });

  useEffect(() => {
    loadSettings();
  }, []);

  const loadSettings = async () => {
    setLoading(true);
    try {
      const setting = await getSettingByKey('CAPACITY_CONFIG');
      if (setting) {
        setConfig(prev => ({ ...prev, ...JSON.parse(setting.settingValue) }));
      }
    } catch (error) {
      toast.error("Failed to load capacity settings");
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      await saveSystemSetting('CAPACITY_CONFIG', config, 'CAPACITY', 'Capacity and Fairness Rules');
      toast.success("Policies saved successfully");
    } catch (error) {
      toast.error("Failed to save policies");
    }
  };

  const handleChange = (key: string, value: number) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-6">
      <header className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Policies & Capacity</h1>
          <p className="text-sm text-gray-500 mt-1">Manage capacity limits, fairness rules, and serving policies.</p>
        </div>
        <Button onClick={handleSave} disabled={loading}>
          <Save size={16} className="mr-2" />
          {loading ? 'Saving...' : 'Save Policies'}
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
                  value={config.maxBookingsPerStudent}
                  onChange={(e) => handleChange('maxBookingsPerStudent', parseInt(e.target.value))}
                  className="w-16 border border-gray-300 rounded px-2 py-1 text-center font-bold"
                />
              </div>

              <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                <label className="block text-sm font-medium text-gray-700">Peak Booking Window (mins)</label>
                <input
                  type="number"
                  value={config.peakBookingWindow}
                  onChange={(e) => handleChange('peakBookingWindow', parseInt(e.target.value))}
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
                  value={config.tokenExpiryDuration}
                  onChange={(e) => handleChange('tokenExpiryDuration', parseInt(e.target.value))}
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
                  value={config.noShowGracePeriod}
                  onChange={(e) => handleChange('noShowGracePeriod', parseInt(e.target.value))}
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
                  value={config.noShowPenaltyDays}
                  onChange={(e) => handleChange('noShowPenaltyDays', parseInt(e.target.value))}
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
                  value={config.ricePortionLimit}
                  onChange={(e) => handleChange('ricePortionLimit', parseInt(e.target.value))}
                  className="w-20 border border-gray-300 rounded px-2 py-1 text-right"
                />
              </div>
              <div className="flex justify-between items-center">
                <label className="text-sm text-gray-700">Curry Portion Limit (ml)</label>
                <input
                  type="number"
                  value={config.curryPortionLimit}
                  onChange={(e) => handleChange('curryPortionLimit', parseInt(e.target.value))}
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
                value={config.maxCapacityPerSlot}
                onChange={(e) => handleChange('maxCapacityPerSlot', parseInt(e.target.value))}
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
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Faculty & Staff</span>
                        <p className="text-xs text-gray-500">Guaranteed slots</p>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={config.reservedFaculty}
                      onChange={(e) => handleChange('reservedFaculty', parseInt(e.target.value))}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm" placeholder="Rsrv"
                    />
                  </div>

                  <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg border border-blue-100">
                    <div className="flex items-center gap-3">
                      <div>
                        <span className="text-sm font-semibold text-gray-900">Guests / Events</span>
                        <p className="text-xs text-gray-500">High priority allocation</p>
                      </div>
                    </div>
                    <input
                      type="number"
                      value={config.reservedGuests}
                      onChange={(e) => handleChange('reservedGuests', parseInt(e.target.value))}
                      className="w-16 border border-gray-300 rounded px-2 py-1 text-center text-sm" placeholder="Rsrv"
                    />
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminCapacity;
