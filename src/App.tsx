import React, { Suspense } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { AuthProvider } from './store/auth.store';
import { CartProvider } from './store/cart.store';
import Layout from './layout';
import ProtectedRoute from './components/common/ProtectedRoute';
import LoginPage from './auth/login/page';
import SignUpPage from './auth/signup/page';
import Loader from './components/common/Loader';

const ForgotPasswordPage = React.lazy(() => import('./auth/forgot-password/page'));
const VerifyOtpPage = React.lazy(() => import('./auth/verify-otp/page'));
const ResetPasswordPage = React.lazy(() => import('./auth/reset-password/page'));

// Lazy load pages for better performance
const UserDashboard = React.lazy(() => import('./student/dashboard/page'));
const UserBooking = React.lazy(() => import('./student/booking/page'));
const UserQueue = React.lazy(() => import('./student/queue/page'));
const UserNotifications = React.lazy(() => import('./student/notifications/page'));
const UserSustainability = React.lazy(() => import('./student/sustainability/page'));
const UserCanteens = React.lazy(() => import('./student/canteens/page'));
const UserItemDetail = React.lazy(() => import('./student/item/page'));
const UserCart = React.lazy(() => import('./student/cart/page'));
const UserSlots = React.lazy(() => import('./student/slots/page'));
const UserToken = React.lazy(() => import('./student/token/page'));


const CanteenStaffDashboard = React.lazy(() => import('./staff/dashboard/page'));
const CanteenStaffScanToken = React.lazy(() => import('./staff/scan-token/page'));
const CanteenStaffWalkin = React.lazy(() => import('./staff/walkin/page'));
const CanteenStaffAnnouncements = React.lazy(() => import('./staff/announcements/page'));

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
        <CartProvider>
          <Suspense fallback={<div className="h-screen flex items-center justify-center"><Loader /></div>}>
            <Toaster position="top-right" />
            <Routes>
              <Route path="/auth/login" element={<LoginPage />} />
              <Route path="/auth/signup" element={<SignUpPage />} />
              <Route path="/auth/forgot-password" element={<ForgotPasswordPage />} />
              <Route path="/auth/verify-otp" element={<VerifyOtpPage />} />
              <Route path="/auth/reset-password" element={<ResetPasswordPage />} />

              <Route element={<Layout />}>
                {/* Student Routes */}
                <Route element={<ProtectedRoute allowedRoles={['user', 'student']} />}>
                  <Route path="/student/dashboard" element={<UserDashboard />} />
                  <Route path="/student/booking" element={<UserBooking />} />
                  <Route path="/student/queue" element={<UserQueue />} />
                  <Route path="/student/notifications" element={<UserNotifications />} />

                  <Route path="/student/sustainability" element={<UserSustainability />} />
                  <Route path="/student/canteens" element={<UserCanteens />} />
                  <Route path="/student/item/:id" element={<UserItemDetail />} />
                  <Route path="/student/cart" element={<UserCart />} />
                  <Route path="/student/slots" element={<UserSlots />} />
                  <Route path="/student/token" element={<UserToken />} />

                </Route>

                {/* Canteen Staff Routes */}
                <Route element={<ProtectedRoute allowedRoles={['canteen_staff', 'canteenstaff']} />}>
                  <Route path="/canteen-staff/dashboard" element={<CanteenStaffDashboard />} />
                  <Route path="/canteen-staff/scan-token" element={<CanteenStaffScanToken />} />
                  <Route path="/canteen-staff/walkin" element={<CanteenStaffWalkin />} />
                  <Route path="/canteen-staff/announcements" element={<CanteenStaffAnnouncements />} />
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
        </CartProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
