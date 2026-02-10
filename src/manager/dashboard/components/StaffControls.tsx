import React from 'react';
import { UserPlus, Briefcase, MoreHorizontal } from 'lucide-react';
import staffService from '../../../services/staff.service';

import { ROLE_LABELS } from '../../../constants/roles';

const StaffControls: React.FC = () => {
  const [staff, setStaff] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [showAddForm, setShowAddForm] = React.useState(false);
  const [formData, setFormData] = React.useState({ name: '', email: '', password: '' });
  const [error, setError] = React.useState('');
  const [showRoster, setShowRoster] = React.useState(false);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const response = await staffService.getAllStaff();
      if (response.success) {
        // Map backend data to UI format
        // Backend returns: { userId, name, email, role, createdAt }
        // UI expects: { name, role: 'Subtitle', status: 'Active', workload: 'Normal' }
        const mappedStaff = response.data.users.map((u: any) => ({
          id: u.userId,
          name: u.name,
          role: ROLE_LABELS[u.role as keyof typeof ROLE_LABELS] || u.role, // Use friendly label or fallback
          status: 'Active', // Default for now
          workload: 'Normal' // Placeholder
        }));
        setStaff(mappedStaff);
      }
    } catch (err) {
      console.error('Failed to fetch staff', err);
    } finally {
      setLoading(false);
    }
  };

  React.useEffect(() => {
    fetchStaff();
  }, []);

  const handleAddStaff = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await staffService.addStaff({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: 'Staff'
      });
      setShowAddForm(false);
      setFormData({ name: '', email: '', password: '' });
      fetchStaff(); // Refresh list
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to add staff');
    }
  };

  const handleRemoveStaff = async (userId: number) => {
    if (!window.confirm('Are you sure you want to remove this staff member?')) return;
    try {
      await staffService.removeStaff(userId);
      fetchStaff();
    } catch (err) {
      console.error('Failed to remove staff', err);
      alert('Failed to remove staff');
    }
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-full relative">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-gray-500 text-sm font-medium">Staff on Duty</h3>
        <button className="text-gray-400 hover:text-gray-600" onClick={fetchStaff}>
          <MoreHorizontal size={20} />
        </button>
      </div>

      {loading ? (
        <div className="text-center py-4 text-xs text-gray-400">Loading...</div>
      ) : (
        <div className="space-y-4 mb-6 max-h-[200px] overflow-y-auto">
          {staff.length === 0 ? (
            <p className="text-xs text-gray-400 text-center">No staff found.</p>
          ) : (
            staff.map((member) => (
              <div key={member.id} className="flex items-center justify-between group">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-brand-light flex items-center justify-center text-brand text-xs font-bold">
                    {member.name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{member.name}</p>
                    <p className="text-xs text-gray-500">{member.role}</p>
                  </div>
                </div>
                <div className="text-right flex items-center gap-2">
                  <span className={`inline-block px-2 py-0.5 rounded text-[10px] font-medium bg-green-50 text-green-700`}>
                    {member.status}
                  </span>
                  <button
                    onClick={() => handleRemoveStaff(member.id)}
                    className="text-red-400 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity text-xs"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      )}

      {showAddForm ? (
        <div className="absolute inset-0 bg-white p-4 rounded-xl z-10 flex flex-col">
          <h4 className="font-bold text-sm mb-3">Add New Staff</h4>
          {error && <p className="text-red-500 text-xs mb-2">{error}</p>}
          <form onSubmit={handleAddStaff} className="space-y-2 flex-1">
            <input
              type="text"
              placeholder="Full Name"
              className="w-full text-xs p-2 border rounded"
              value={formData.name}
              onChange={e => setFormData({ ...formData, name: e.target.value })}
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="w-full text-xs p-2 border rounded"
              value={formData.email}
              onChange={e => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <input
              type="password"
              placeholder="Password"
              className="w-full text-xs p-2 border rounded"
              value={formData.password}
              onChange={e => setFormData({ ...formData, password: e.target.value })}
              required
              minLength={6}
            />
            <div className="flex gap-2 pt-2">
              <button type="submit" className="flex-1 bg-gray-900 text-white text-xs py-2 rounded">Add</button>
              <button type="button" onClick={() => setShowAddForm(false)} className="flex-1 bg-gray-200 text-gray-800 text-xs py-2 rounded">Cancel</button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-2 gap-3">
          <button
            onClick={() => setShowAddForm(true)}
            className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition"
          >
            <UserPlus size={14} /> Assign Staff
          </button>
          <button className="flex items-center justify-center gap-2 py-2 border border-gray-200 rounded-lg text-xs font-medium text-gray-700 hover:bg-gray-50 transition" onClick={() => setShowRoster(true)}>
            <Briefcase size={14} /> View Roster
          </button>
        </div>
      )}

      {showRoster && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg overflow-hidden">
            <div className="p-4 border-b border-gray-100 flex justify-between items-center">
              <h3 className="font-bold text-lg">Staff Roster</h3>
              <button
                onClick={() => setShowRoster(false)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold"
              >
                &times;
              </button>
            </div>
            <div className="p-4 max-h-[60vh] overflow-y-auto">
              {loading ? (
                <div className="text-center py-8 text-gray-400">Loading roster...</div>
              ) : staff.length === 0 ? (
                <div className="text-center py-8 text-gray-400">No staff members found.</div>
              ) : (
                <div className="space-y-3">
                  {staff.map((member) => (
                    <div key={member.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-brand-light flex items-center justify-center text-brand font-bold">
                          {member.name.charAt(0)}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900">{member.name}</p>
                          <p className="text-xs text-gray-500">{member.role}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className={`inline-block px-2 py-1 rounded text-xs font-medium bg-green-100 text-green-800`}>
                          {member.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            <div className="p-4 border-t border-gray-100 bg-gray-50 text-right">
              <button
                onClick={() => setShowRoster(false)}
                className="px-4 py-2 bg-gray-900 text-white rounded-lg text-sm hover:bg-gray-800"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffControls;
