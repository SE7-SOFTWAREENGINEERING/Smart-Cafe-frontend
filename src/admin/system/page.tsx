import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import { Database, Download, RefreshCw, Power } from 'lucide-react';
import { cn } from '../../utils/cn';
import { getSystemSettings, saveSystemSetting, getSettingByKey } from '../../services/system.service';
import toast from 'react-hot-toast';

const AdminSystem: React.FC = () => {
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [systemActive, setSystemActive] = useState(true);

  useEffect(() => {
    loadSystemData();
  }, []);

  const loadSystemData = async () => {
    try {
      // Load Settings
      const settings = await getSettingByKey('SYSTEM_CONTROL');
      if (settings) {
        const config = JSON.parse(settings.settingValue);
        setSystemActive(config.systemActive);
        setAutoBackupEnabled(config.autoBackupEnabled);
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to load system data");
    }
  };

  const saveSettings = async (active: boolean, autoBackup: boolean) => {
    try {
      await saveSystemSetting('SYSTEM_CONTROL', { systemActive: active, autoBackupEnabled: autoBackup }, 'SECURITY', 'Master system controls');
      toast.success('Settings saved');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleToggleSystem = (newState: boolean) => {
    setSystemActive(newState);
    saveSettings(newState, autoBackupEnabled); // Auto-save on toggle
  };

  const handleBackup = async () => {
    setIsBackupRunning(true);
    try {
      const { triggerBackup } = await import('../../services/system.service');
      const result = await triggerBackup();
      if (result.path) {
        toast.success(`Backup saved to ${result.path}`);
      } else {
        toast.success('Backup initiated successfully!');
      }
      setIsBackupRunning(false);
    } catch (error) {
      console.error(error);
      toast.error('Backup failed');
      setIsBackupRunning(false);
    }
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">System Maintenance & Governance</h1>
        <p className="text-sm text-gray-500 mt-1">Manage system status and perform manual backups.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Master Control */}
        <div className={cn("p-6 rounded-xl shadow-sm border flex items-center justify-between", systemActive ? "bg-white border-gray-100" : "bg-red-50 border-red-100")}>
          <div>
            <h3 className="font-bold text-gray-900 flex items-center gap-2">
              <Power size={20} className={systemActive ? "text-green-600" : "text-red-600"} />
              Master Booking Control
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {systemActive
                ? "Booking engine is currently ACTIVE. Students can place orders."
                : "SYSTEM LOCKDOWN. All booking operations are SUSPENDED."}
            </p>
          </div>
          <label className="relative inline-flex items-center cursor-pointer">
            <input
              type="checkbox"
              checked={systemActive}
              onChange={() => handleToggleSystem(!systemActive)}
              className="sr-only peer"
            />
            <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
          </label>
        </div>

        {/* Backup Controls */}
        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
          <div className="flex flex-col justify-between gap-4 h-full">
            <div>
              <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                <Database size={20} className="text-blue-600" />
                Database Backup
              </h3>
              <p className="text-sm text-gray-500 mt-1">
                Create an immediate JSON dump of all system data.
              </p>
            </div>

            <div className="flex items-center justify-between mt-auto pt-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={autoBackupEnabled}
                  onChange={() => {
                    setAutoBackupEnabled(!autoBackupEnabled);
                    saveSettings(systemActive, !autoBackupEnabled);
                  }}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <span className="text-sm font-medium text-gray-700">Auto-Daily</span>
              </label>

              <Button onClick={handleBackup} disabled={isBackupRunning} variant="primary">
                {isBackupRunning ? (
                  <>
                    <RefreshCw size={16} className="animate-spin mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Download size={16} className="mr-2" />
                    Backup Now
                  </>
                )}
              </Button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AdminSystem;
