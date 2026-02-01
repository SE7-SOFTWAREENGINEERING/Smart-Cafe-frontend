import React from 'react';
import Button from '../../components/common/Button';

const AdminRoles: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
         <h1 className="text-2xl font-bold text-gray-900">Role Management</h1>
         <Button size="sm">Add New Role</Button>
      </div>
     
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 border-b border-gray-200">
                <tr>
                    <th className="px-6 py-3">User Name</th>
                    <th className="px-6 py-3">Email</th>
                    <th className="px-6 py-3">Current Role</th>
                    <th className="px-6 py-3">Actions</th>
                </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
                <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">John Doe</td>
                    <td className="px-6 py-4 text-gray-500">john@college.edu</td>
                    <td className="px-6 py-4"><span className="bg-blue-100 text-blue-700 px-2 py-1 rounded-full text-xs font-semibold">Student</span></td>
                    <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
                </tr>
                <tr className="hover:bg-gray-50">
                    <td className="px-6 py-4">Sarah Smith</td>
                    <td className="px-6 py-4 text-gray-500">sarah@admin.edu</td>
                    <td className="px-6 py-4"><span className="bg-purple-100 text-purple-700 px-2 py-1 rounded-full text-xs font-semibold">Admin</span></td>
                    <td className="px-6 py-4 text-blue-600 hover:underline cursor-pointer">Edit</td>
                </tr>
            </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminRoles;
