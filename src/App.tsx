import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './store/auth.store';
import Layout from './layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './auth/login/page';
import Loader from './components/common/Loader';

// Lazy load pages for better performance
const StudentDashboard = React.lazy(() => import('./student/dashboard/page'));
const StudentBooking = React.lazy(() => import('./student/booking/page'));
const StudentQueue = React.lazy(() => import('./student/queue/page'));
const StudentNotifications = React.lazy(() => import('./student/notifications/page'));
const StudentSustainability = React.lazy(() => import('./student/sustainability/page'));
const StudentCanteens = React.lazy(() => import('./student/canteens/page'));
const StudentItemDetail = React.lazy(() => import('./student/item/page'));

const StaffDashboard = React.lazy(() => import('./staff/dashboard/page'));
const StaffScanToken = React.lazy(() => import('./staff/scan-token/page'));
const StaffWalkin = React.lazy(() => import('./staff/walkin/page'));
const StaffAnnouncements = React.lazy(() => import('./staff/announcements/page'));

const ManagerDashboard = React.lazy(() => import('./manager/dashboard/page'));
const ManagerForecasts = React.lazy(() => import('./manager/forecasts/page'));

const AdminDashboard = React.lazy(() => import('./admin/dashboard/page'));
const AdminMenu = React.lazy(() => import('./admin/menu/page'));
const AdminBookings = React.lazy(() => import('./admin/bookings/page'));
const AdminRoles = React.lazy(() => import('./admin/roles/page'));
const AdminTimings = React.lazy(() => import('./admin/timings/page'));
const AdminCapacity = React.lazy(() => import('./admin/capacity/page'));
const AdminAccuracy = React.lazy(() => import('./admin/accuracy/page'));
const AdminSystem = React.lazy(() => import('./admin/system/page'));
const AdminSettings = React.lazy(() => import('./admin/settings/page'));

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
          <Routes>
            <Route path="/auth/login" element={<LoginPage />} />

            <Route element={<Layout />}>
              {/* Student Routes */}
              <Route element={<ProtectedRoute allowedRoles={['student']} />}>
                <Route path="/student/dashboard" element={<StudentDashboard />} />
                <Route path="/student/booking" element={<StudentBooking />} />
                <Route path="/student/queue" element={<StudentQueue />} />
                <Route path="/student/notifications" element={<StudentNotifications />} />
                <Route path="/student/notifications" element={<StudentNotifications />} />
                <Route path="/student/sustainability" element={<StudentSustainability />} />
                <Route path="/student/canteens" element={<StudentCanteens />} />
                <Route path="/student/item/:id" element={<StudentItemDetail />} />
              </Route>

              {/* Staff Routes */}
              <Route element={<ProtectedRoute allowedRoles={['staff']} />}>
                <Route path="/staff/dashboard" element={<StaffDashboard />} />
                <Route path="/staff/scan-token" element={<StaffScanToken />} />
                <Route path="/staff/walkin" element={<StaffWalkin />} />
                <Route path="/staff/announcements" element={<StaffAnnouncements />} />
              </Route>

              {/* Manager Routes */}
              <Route element={<ProtectedRoute allowedRoles={['manager']} />}>
                <Route path="/manager/dashboard" element={<ManagerDashboard />} />
                <Route path="/manager/forecasts" element={<ManagerForecasts />} />
              </Route>

              {/* Admin Routes */}
              <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/menu" element={<AdminMenu />} />
                <Route path="/admin/bookings" element={<AdminBookings />} />
                <Route path="/admin/roles" element={<AdminRoles />} />
                <Route path="/admin/timings" element={<AdminTimings />} />
                <Route path="/admin/capacity" element={<AdminCapacity />} />
                <Route path="/admin/accuracy" element={<AdminAccuracy />} />
                <Route path="/admin/system" element={<AdminSystem />} />
                <Route path="/admin/settings" element={<AdminSettings />} />
              </Route>
            </Route>

            <Route path="/" element={<Navigate to="/auth/login" replace />} />
            <Route path="*" element={<Navigate to="/auth/login" replace />} />
          </Routes>
        </Suspense>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
