import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Database, Download, RefreshCw, CheckCircle, Power, History } from 'lucide-react';
import { cn } from '../../utils/cn';

interface BackupRecord {
  id: string;
  date: string;
  size: string;
  type: 'Automated' | 'Manual';
  status: 'Success' | 'Failed';
}

const MOCK_BACKUPS: BackupRecord[] = [
  { id: 'BK-2024-001', date: '2024-03-15 02:00 AM', size: '1.2 GB', type: 'Automated', status: 'Success' },
  { id: 'BK-2024-002', date: '2024-03-14 02:00 AM', size: '1.2 GB', type: 'Automated', status: 'Success' },
  { id: 'BK-2024-003', date: '2024-03-13 04:30 PM', size: '1.1 GB', type: 'Manual', status: 'Success' },
];

const MOCK_AUDIT_LOGS = [
  { id: 1, action: 'Manual Backup Initiated', user: 'Admin User', time: 'Today, 2:30 PM' },
  { id: 2, action: 'User Login: sarah@admin.edu', user: 'System', time: 'Today, 09:00 AM' },
  { id: 3, action: 'Capacity Limit Updated', user: 'Admin User', time: 'Yesterday, 5:45 PM' },
  { id: 4, action: 'User Logout: mike@staff.edu', user: 'System', time: 'Yesterday, 5:30 PM' },
  { id: 5, action: 'Holiday Calendar Modified', user: 'Manager User', time: 'Mar 12, 11:20 AM' },
];

const AdminSystem: React.FC = () => {
  const [backups, setBackups] = useState<BackupRecord[]>(MOCK_BACKUPS);
  const [isBackupRunning, setIsBackupRunning] = useState(false);
  const [autoBackupEnabled, setAutoBackupEnabled] = useState(true);
  const [systemActive, setSystemActive] = useState(true);

  const handleBackup = () => {
    setIsBackupRunning(true);
    // Simulate backup process
    setTimeout(() => {
      const newBackup: BackupRecord = {
        id: `BK-2024-${String(Date.now()).slice(-3)}`,
        date: new Date().toLocaleString(),
        size: '1.2 GB',
        type: 'Manual',
        status: 'Success',
      };
      setBackups([newBackup, ...backups]);
      setIsBackupRunning(false);
      alert('Backup completed successfully!');
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-2xl font-bold text-gray-900">System Maintenance & Governance</h1>
        <p className="text-sm text-gray-500 mt-1">Manage backups, system status, and view audit logs.</p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Column */}
        <div className="lg:col-span-2 space-y-6">

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
                onChange={() => setSystemActive(!systemActive)}
                className="sr-only peer"
              />
              <div className="w-14 h-7 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-red-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-0.5 after:left-[4px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-6 after:w-6 after:transition-all peer-checked:bg-green-600"></div>
            </label>
          </div>

          {/* Backup Controls */}
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <h3 className="font-semibold text-gray-900 flex items-center gap-2">
                  <Database size={20} className="text-blue-600" />
                  Database Backup
                </h3>
                <p className="text-sm text-gray-500 mt-1">Last successful backup: {backups[0]?.date}</p>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={autoBackupEnabled}
                    onChange={() => setAutoBackupEnabled(!autoBackupEnabled)}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                  <span className="text-sm font-medium text-gray-700">Auto-Daily</span>
                </label>

                <Button onClick={handleBackup} disabled={isBackupRunning} variant="primary">
                  {isBackupRunning ? (
                    <>
                      <RefreshCw size={16} className="animate-spin mr-2" />
                      running...
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

          {/* Recent Backups List */}
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">Recent Backups</h3>
            </div>

            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-500">
                <tr>
                  <th className="px-6 py-3">Date</th>
                  <th className="px-6 py-3">Size</th>
                  <th className="px-6 py-3">Type</th>
                  <th className="px-6 py-3">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {backups.map((backup) => (
                  <tr key={backup.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 text-gray-900 font-medium">{backup.date}</td>
                    <td className="px-6 py-4 text-gray-500">{backup.size}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${backup.type === 'Automated' ? 'bg-blue-50 text-blue-700' : 'bg-purple-50 text-purple-700'
                        }`}>
                        {backup.type}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-1.5 text-green-700">
                        <CheckCircle size={14} className="text-green-500" /> Success
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Sidebar Column: Audit Logs */}
        <div className="lg:col-span-1">
          <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2 mb-6">
              <History size={20} className="text-gray-500" />
              Audit Log
            </h3>

            <div className="space-y-6">
              {MOCK_AUDIT_LOGS.map((log) => (
                <div key={log.id} className="relative pl-6 border-l-2 border-gray-100 last:border-0">
                  <div className="absolute -left-[5px] top-1 w-2.5 h-2.5 rounded-full bg-gray-300"></div>
                  <p className="text-sm font-medium text-gray-900">{log.action}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{log.user}</span>
                    <span className="text-xs text-gray-400">{log.time}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t border-gray-100">
              <button className="w-full py-2 text-sm text-blue-600 font-medium hover:bg-blue-50 rounded-lg transition-colors">
                View Full Logs
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminSystem;
