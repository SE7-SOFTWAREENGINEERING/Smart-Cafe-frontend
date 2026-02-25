import React from "react";
import { useAuth } from "../../store/auth.store";
import { LogOut, User as UserIcon } from "lucide-react";

const Navbar: React.FC = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200 h-16 flex items-center justify-between px-6 z-30 fixed top-0 left-0 right-0">
      <div className="flex items-center gap-2">
        <h1 className="text-xl font-bold text-gray-900 tracking-tight">
          Smart Cafeteria
        </h1>
      </div>

      <div className="flex items-center gap-4">
        {user && (
          <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
            <UserIcon size={18} className="text-gray-500" />
            <span>
              {user.name} ({user.role})
            </span>
          </div>
        )}
        <button
          onClick={logout}
          className="flex items-center gap-1 text-sm font-medium text-red-600 hover:text-red-700 hover:bg-red-50 px-3 py-1.5 rounded-md transition-colors"
        >
          <LogOut size={16} />
          Logout
        </button>
      </div>
    </nav>
  );
};

export default Navbar;

