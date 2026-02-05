import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Search, Save, Edit2, Filter, Trash2, AlertTriangle, LogOut, X, Plus } from 'lucide-react';
import type { Role } from '../../types';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: Role;
  status: 'Active' | 'Suspended';
  isOnline?: boolean;
}

const MOCK_USERS: UserRow[] = [
  { id: 1, name: 'John Doe', email: 'john@college.edu', role: 'student', status: 'Active', isOnline: true },
  { id: 2, name: 'Sarah Smith', email: 'sarah@admin.edu', role: 'admin', status: 'Active', isOnline: true },
  { id: 3, name: 'Mike Johnson', email: 'mike@staff.edu', role: 'counter_staff', status: 'Active', isOnline: true },
  { id: 4, name: 'Emily Davis', email: 'emily@manager.edu', role: 'manager', status: 'Suspended', isOnline: false },
  { id: 5, name: 'Chef Gordon', email: 'gordon@kitchen.edu', role: 'kitchen_staff', status: 'Active', isOnline: false },
  { id: 6, name: 'Lisa Wilson', email: 'lisa@staff.edu', role: 'staff', status: 'Active', isOnline: true }
];

const AdminRoles: React.FC = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempRole, setTempRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', role: 'student' as Role });

  const handleEdit = (user: UserRow) => {
    setEditingId(user.id);
    setTempRole(user.role);
  };

  const handleSave = (id: number) => {
    if (tempRole) {
      setUsers(users.map(u => u.id === id ? { ...u, role: tempRole } : u));
      setEditingId(null);
      setTempRole(null);
    }
  };

  const handleDelete = (id: number) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      setUsers(users.filter(u => u.id !== id));
    }
  };

  const handleToggleStatus = (id: number) => {
    setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'Active' ? 'Suspended' : 'Active' } : u));
  };

  const handleForceLogout = (id: number) => {
    if (window.confirm('Force logout this user? They will be required to sign in again.')) {
      setUsers(users.map(u => u.id === id ? { ...u, isOnline: false } : u));
      alert('User has been logged out.');
    }
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserRow = {
      id: users.length + 1,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      status: 'Active',
      isOnline: false
    };
    setUsers([...users, user]);
    setIsAddUserOpen(false);
    setNewUser({ name: '', email: '', role: 'student' });
    alert(`Account created for ${user.name} as ${user.role}`);
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">User Roles & Access</h1>
          <p className="text-sm text-gray-500 mt-1">Manage system privileges, staff accounts, and sessions.</p>
        </div>
        <Button size="sm" onClick={() => setIsAddUserOpen(true)}>
          <Plus size={16} className="mr-2" />
          Create Account
        </Button>
      </div>

      {/* Controls Bar */}
      <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
        {/* Search */}
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Filter */}
        <div className="relative min-w-[200px]">
          <Filter className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value as Role | 'all')}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 appearance-none bg-white"
          >
            <option value="all">All Roles</option>
            <option value="student">Student</option>
            <option value="staff">General Staff</option>
            <option value="kitchen_staff">Kitchen Staff</option>
            <option value="counter_staff">Counter Staff</option>
            <option value="manager">Manager</option>
            <option value="admin">Admin</option>
          </select>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 font-medium">User</th>
              <th className="px-6 py-3 font-medium">Role</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 font-medium text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredUsers.length > 0 ? (
              filteredUsers.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50 transition-colors group">
                  <td className="px-6 py-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-gray-900">{user.name}</p>
                        {user.isOnline && (
                          <span className="w-2 h-2 rounded-full bg-green-500" title="Online now"></span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500">{user.email}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    {editingId === user.id ? (
                      <select
                        value={tempRole || user.role}
                        onChange={(e) => setTempRole(e.target.value as Role)}
                        className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2"
                      >
                        <option value="student">Student</option>
                        <option value="staff">General Staff</option>
                        <option value="kitchen_staff">Kitchen Staff</option>
                        <option value="counter_staff">Counter Staff</option>
                        <option value="manager">Manager</option>
                        <option value="admin">Admin</option>
                      </select>
                    ) : (
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize inline-flex items-center
                                ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                          user.role === 'manager' ? 'bg-orange-100 text-orange-700' :
                            user.role.includes('staff') ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                        }`}>
                        {user.role.replace('_', ' ')}
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4">
                    <button
                      onClick={() => handleToggleStatus(user.id)}
                      className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none ${user.status === 'Active' ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`${user.status === 'Active' ? 'translate-x-5' : 'translate-x-1'} inline-block w-3 h-3 transform bg-white rounded-full transition-transform`} />
                    </button>
                    <span className="ml-2 text-xs text-gray-500">{user.status}</span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      {/* Force Logout Button */}
                      {user.isOnline && (
                        <button onClick={() => handleForceLogout(user.id)} className="text-amber-600 hover:bg-amber-50 p-1.5 rounded-lg transition-colors" title="Force Logout">
                          <LogOut size={18} />
                        </button>
                      )}

                      {editingId === user.id ? (
                        <button onClick={() => handleSave(user.id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors" title="Save">
                          <Save size={18} />
                        </button>
                      ) : (
                        <button onClick={() => handleEdit(user)} className="text-blue-600 hover:bg-blue-50 p-1.5 rounded-lg transition-colors" title="Edit Role">
                          <Edit2 size={18} />
                        </button>
                      )}
                      <button onClick={() => handleDelete(user.id)} className="text-red-500 hover:bg-red-50 p-1.5 rounded-lg transition-colors" title="Delete User">
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className="px-6 py-12 text-center text-gray-500">
                  <div className="flex flex-col items-center justify-center">
                    <AlertTriangle size={32} className="text-gray-300 mb-2" />
                    <p>No users found matching your filters.</p>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Add User Modal */}
      {isAddUserOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-lg w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-lg font-bold text-gray-900">Create New Account</h3>
              <button onClick={() => setIsAddUserOpen(false)} className="text-gray-400 hover:text-gray-600">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleAddUser} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                <input
                  required
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newUser.name}
                  onChange={e => setNewUser({ ...newUser, name: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                <input
                  required
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newUser.email}
                  onChange={e => setNewUser({ ...newUser, email: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                >
                  <option value="student">Student</option>
                  <option value="staff">General Staff</option>
                  <option value="kitchen_staff">Kitchen Staff</option>
                  <option value="counter_staff">Counter Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsAddUserOpen(false)} type="button">Cancel</Button>
                <Button type="submit">Create Account</Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
