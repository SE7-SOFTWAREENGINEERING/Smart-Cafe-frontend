import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../../store/auth.store';
import type { Role } from '../../types';

interface ProtectedRouteProps {
  allowedRoles: Role[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles }) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div className="flex h-screen items-center justify-center">Loading...</div>;
  }

  if (!isAuthenticated || !user) {
    return <Navigate to="/auth/login" replace />;
  }

  if (!allowedRoles.includes(user.role)) {
    // Redirect to their specific dashboard based on their role
    // or a 403 Access Denied page. For now, redirect to their role dashboard.
    switch (user.role) {
      case 'student': return <Navigate to="/student/dashboard" replace />;
      case 'staff': return <Navigate to="/staff/dashboard" replace />;
      case 'manager': return <Navigate to="/manager/dashboard" replace />;
      case 'admin': return <Navigate to="/admin/dashboard" replace />;
      default: return <Navigate to="/auth/login" replace />;
    }
  }

  return <Outlet />;
};

export default ProtectedRoute;
