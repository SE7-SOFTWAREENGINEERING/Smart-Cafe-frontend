import React, { useState } from 'react';
import Button from '../../components/common/Button';
import { Search, Save, Edit2 } from 'lucide-react';
import type { Role } from '../../types';

interface UserRow {
  id: number;
  name: string;
  email: string;
  role: Role;
}

const MOCK_USERS: UserRow[] = [
  { id: 1, name: 'John Doe', email: 'john@college.edu', role: 'student' },
  { id: 2, name: 'Sarah Smith', email: 'sarah@admin.edu', role: 'admin' },
  { id: 3, name: 'Mike Johnson', email: 'mike@staff.edu', role: 'staff' },
  { id: 4, name: 'Emily Davis', email: 'emily@manager.edu', role: 'manager' },
];

const AdminRoles: React.FC = () => {
  const [users, setUsers] = useState(MOCK_USERS);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [tempRole, setTempRole] = useState<Role | null>(null);

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

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <div>
            <h1 className="text-2xl font-bold text-gray-900">User Roles</h1>
            <p className="text-sm text-gray-500 mt-1">Manage system access privileges.</p>
         </div>
         <Button size="sm">Add New Role</Button>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
        <input 
          type="text" 
          placeholder="Search by name or email..." 
          className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>
     
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-3 font-medium">User Name</th>
                    <th className="px-6 py-3 font-medium">Email</th>
                    <th className="px-6 py-3 font-medium">Current Role</th>
                    <th className="px-6 py-3 font-medium">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                {users.map((user) => (
                  <tr key={user.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-6 py-4 font-medium text-gray-900">{user.name}</td>
                      <td className="px-6 py-4 text-gray-500">{user.email}</td>
                      <td className="px-6 py-4">
                        {editingId === user.id ? (
                          <select 
                            value={tempRole || user.role}
                            onChange={(e) => setTempRole(e.target.value as Role)}
                            className="bg-white border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                          >
                            <option value="student">Student</option>
                            <option value="staff">Staff</option>
                            <option value="manager">Manager</option>
                            <option value="admin">Admin</option>
                          </select>
                        ) : (
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold capitalize
                            ${user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                              user.role === 'manager' ? 'bg-orange-100 text-orange-700' :
                              user.role === 'staff' ? 'bg-blue-100 text-blue-700' :
                              'bg-green-100 text-green-700'
                            }`}>
                            {user.role}
                          </span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        {editingId === user.id ? (
                           <button onClick={() => handleSave(user.id)} className="text-green-600 hover:text-green-800 font-medium flex items-center gap-1">
                             <Save size={16} /> Save
                           </button>
                        ) : (
                          <button onClick={() => handleEdit(user)} className="text-blue-600 hover:text-blue-800 font-medium flex items-center gap-1">
                            <Edit2 size={16} /> Edit
                          </button>
                        )}
                      </td>
                  </tr>
                ))}
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoles;
