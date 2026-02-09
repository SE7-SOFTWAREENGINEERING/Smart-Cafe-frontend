import React, { useState, useEffect } from 'react';
import Button from '../../components/common/Button';
import { Search, Save, Edit2, Filter, Trash2, AlertTriangle, LogOut, X, Plus, Loader2 } from 'lucide-react';
import type { Role } from '../../types';
import * as userService from '../../services/user.service';

interface UserRow {
  id: string;
  name: string;
  fullName: string;
  email: string;
  role: Role;
  status: 'active' | 'suspended';
  isOnline?: boolean;
}

const AdminRoles: React.FC = () => {
  const [users, setUsers] = useState<UserRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [tempRole, setTempRole] = useState<Role | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<Role | 'all'>('all');

  // Add User Modal State
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', role: 'user' as Role });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await userService.getUsers({ limit: 100 });
      const mappedUsers: UserRow[] = response.users.map(u => ({
        id: u.id,
        name: u.name || u.fullName,
        fullName: u.fullName,
        email: u.email,
        role: u.role as Role,
        status: u.status as 'active' | 'suspended',
        isOnline: u.isOnline,
      }));
      setUsers(mappedUsers);
    } catch (error) {
      console.error('Failed to load users:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user: UserRow) => {
    setEditingId(user.id);
    setTempRole(user.role);
  };

  const handleSave = async (id: string) => {
    if (tempRole) {
      try {
        setSaving(true);
        await userService.updateUserRole(id, tempRole);
        setUsers(users.map(u => u.id === id ? { ...u, role: tempRole } : u));
        setEditingId(null);
        setTempRole(null);
      } catch (error) {
        console.error('Failed to update role:', error);
        alert('Failed to update role');
      } finally {
        setSaving(false);
      }
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await userService.deleteUser(id);
        setUsers(users.filter(u => u.id !== id));
      } catch (error) {
        console.error('Failed to delete user:', error);
        alert('Failed to delete user');
      }
    }
  };

  const handleToggleStatus = async (id: string) => {
    const user = users.find(u => u.id === id);
    if (!user) return;
    
    const newStatus = user.status === 'active' ? 'suspended' : 'active';
    try {
      await userService.updateUserStatus(id, newStatus);
      setUsers(users.map(u => u.id === id ? { ...u, status: newStatus } : u));
    } catch (error) {
      console.error('Failed to toggle status:', error);
      alert('Failed to update status');
    }
  };

  const handleForceLogout = async (id: string) => {
    if (window.confirm('Force logout this user? They will be required to sign in again.')) {
      try {
        await userService.forceLogout(id);
        setUsers(users.map(u => u.id === id ? { ...u, isOnline: false } : u));
        // alert('User has been logged out.'); // Optional: Toast is better if available, or just silent success
      } catch (error) {
        console.error('Failed to force logout:', error);
        alert('Failed to force logout user');
      }
    }
  };

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setSaving(true);
      const created = await userService.createUser({
        fullName: newUser.name,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
      });
      setUsers([...users, {
        id: created.id,
        name: created.name || created.fullName,
        fullName: created.fullName,
        email: created.email,
        role: created.role as Role,
        status: created.status as 'active' | 'suspended',
        isOnline: created.isOnline,
      }]);
      setIsAddUserOpen(false);
      setNewUser({ name: '', email: '', password: '', role: 'user' });
      alert(`Account created for ${created.fullName} as ${created.role}`);
    } catch (error: any) {
      console.error('Failed to create user:', error);
      alert(error.message || 'Failed to create user');
    } finally {
      setSaving(false);
    }
  };

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    return matchesSearch && matchesRole;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 size={32} className="animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Loading users...</span>
      </div>
    );
  }

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
            <option value="user">User</option>
            <option value="canteen_staff">Canteen Staff</option>
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
                        <option value="user">User</option>
                        <option value="canteen_staff">Canteen Staff</option>
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
                      className={`relative inline-flex items-center h-5 rounded-full w-9 transition-colors focus:outline-none ${user.status === 'active' ? 'bg-green-500' : 'bg-gray-300'}`}
                    >
                      <span className={`${user.status === 'active' ? 'translate-x-5' : 'translate-x-1'} inline-block w-3 h-3 transform bg-white rounded-full transition-transform`} />
                    </button>
                    <span className="ml-2 text-xs text-gray-500 capitalize">{user.status}</span>
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
                        <button onClick={() => handleSave(user.id)} className="text-green-600 hover:bg-green-50 p-1.5 rounded-lg transition-colors" title="Save" disabled={saving}>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
                <input
                  required
                  type="password"
                  minLength={6}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newUser.password}
                  onChange={e => setNewUser({ ...newUser, password: e.target.value })}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assign Role</label>
                <select
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  value={newUser.role}
                  onChange={e => setNewUser({ ...newUser, role: e.target.value as Role })}
                >
                  <option value="user">User</option>
                  <option value="canteen_staff">Canteen Staff</option>
                  <option value="manager">Manager</option>
                  <option value="admin">Admin</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3">
                <Button variant="secondary" onClick={() => setIsAddUserOpen(false)} type="button">Cancel</Button>
                <Button type="submit" disabled={saving}>
                  {saving ? 'Creating...' : 'Create Account'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminRoles;
