import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuth } from './store/slices/authSlice';
import { initializeSocket } from './store/slices/socketSlice';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
import Pricing from './pages/public/Pricing';
import SuccessStories from './pages/public/SuccessStories';
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Legal Pages
import TermsAndConditions from './pages/legal/TermsAndConditions';
import PrivacyPolicy from './pages/legal/PrivacyPolicy';
import TermsOfService from './pages/legal/TermsOfService';
import CookiesPolicy from './pages/legal/CookiesPolicy';

// Support Pages
import HelpCenter from './pages/support/HelpCenter';
import ContactUs from './pages/support/ContactUs';

// Worker Pages
import WorkerDashboard from './pages/worker/Dashboard';
import TaskBrowser from './pages/worker/TaskBrowser';
import TaskDetail from './pages/worker/TaskDetail';
import MySubmissions from './pages/worker/MySubmissions';

// Employer Pages
import EmployerDashboard from './pages/employer/Dashboard';
import CreateTask from './pages/employer/CreateTask';
import MyTasks from './pages/employer/MyTasks';
import ReviewSubmissions from './pages/employer/ReviewSubmissions';

// Shared Pages
import Wallet from './pages/shared/Wallet';
import Profile from './pages/shared/Profile';
import Settings from './pages/shared/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import TaskManagement from './pages/admin/TaskManagement';

function App() {
  const dispatch = useDispatch();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  useEffect(() => {
    if (isAuthenticated && user) {
      dispatch(initializeSocket(user.id));
    }
  }, [dispatch, isAuthenticated, user]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          <Route path="/pricing" element={<Pricing />} />
          <Route path="/success-stories" element={<SuccessStories />} />
          <Route 
            path="/login" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Login />} 
          />
          <Route 
            path="/register" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <Register />} 
          />
          <Route 
            path="/forgot-password" 
            element={isAuthenticated ? <Navigate to="/dashboard" /> : <ForgotPassword />} 
          />

          {/* Legal Routes */}
          <Route path="/terms-and-conditions" element={<TermsAndConditions />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<TermsOfService />} />
          <Route path="/cookies-policy" element={<CookiesPolicy />} />

          {/* Support Routes */}
          <Route path="/help" element={<HelpCenter />} />
          <Route path="/contact" element={<ContactUs />} />

          {/* Protected Routes */}
          <Route path="/dashboard" element={
            <ProtectedRoute>
              {user?.role === 'worker' && <WorkerDashboard />}
              {user?.role === 'employer' && <EmployerDashboard />}
              {user?.role === 'admin' && <AdminDashboard />}
            </ProtectedRoute>
          } />

          {/* Worker Routes */}
          <Route path="/tasks" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <TaskBrowser />
            </ProtectedRoute>
          } />
          <Route path="/tasks/:id" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <TaskDetail />
            </ProtectedRoute>
          } />
          <Route path="/my-submissions" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <MySubmissions />
            </ProtectedRoute>
          } />

          {/* Employer Routes */}
          <Route path="/create-task" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <CreateTask />
            </ProtectedRoute>
          } />
          <Route path="/my-tasks" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <MyTasks />
            </ProtectedRoute>
          } />
          <Route path="/review-submissions" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <ReviewSubmissions />
            </ProtectedRoute>
          } />

          {/* Shared Protected Routes */}
          <Route path="/wallet" element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute>
              <Profile />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute>
              <Settings />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <UserManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/tasks" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <TaskManagement />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
    </div>
  );
}

export default App;