import React, { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Toaster } from 'react-hot-toast';
import { checkAuth, setSession } from './store/slices/authSlice';
import { supabase } from './services/authentication';

// Layout Components
import Navbar from './components/layout/Navbar';
import Footer from './components/layout/Footer';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoadingSpinner from './components/ui/LoadingSpinner';
import DatabaseStatus from './components/ui/DatabaseStatus';
import MobileNav from './components/layout/MobileNav';
import ErrorBoundary from './components/error/ErrorBoundary';
// import AuthDebug from './components/debug/AuthDebug'; // Removed debug component

// Public Pages
import Home from './pages/public/Home';
import About from './pages/public/About';
import HowItWorks from './pages/public/HowItWorks';
// import Pricing from './pages/public/Pricing'; // Removed pricing feature
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
import EditTask from './pages/employer/EditTask';
import TaskDetailView from './pages/employer/TaskDetailView';
import MyTasks from './pages/employer/MyTasks';
import ReviewSubmissions from './pages/employer/ReviewSubmissions';

// Shared Pages
import UserDashboard from './pages/shared/UserDashboard';
import Wallet from './pages/shared/Wallet';
import PaymentMethods from './pages/shared/PaymentMethods';
import Profile from './pages/shared/Profile';
import Settings from './pages/shared/Settings';

// Admin Pages
import AdminOverview from './pages/admin/AdminOverview';
import AdminDashboard from './pages/admin/Dashboard';
import UserManagement from './pages/admin/UserManagement';
import TaskManagement from './pages/admin/TaskManagement';
import PaymentManagement from './pages/admin/PaymentManagement';
import ManualPayments from './pages/admin/ManualPayments';
import Analytics from './pages/admin/Analytics';
import Reports from './pages/admin/Reports';
import SystemSettings from './pages/admin/SystemSettings';

// Debug Pages
import AdminTest from './pages/debug/AdminTest';
import TaskNavigationTest from './pages/debug/TaskNavigationTest';

function App() {
  const dispatch = useDispatch();
  const { profile, isAuthenticated, loading } = useSelector((state) => state.auth);

  useEffect(() => {
    // Initialize authentication

    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      dispatch(setSession({ user: session?.user, session }));
      if (session?.user) {
        dispatch(checkAuth());
      }
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      dispatch(setSession({ user: session?.user, session }));
      if (session?.user) {
        dispatch(checkAuth());
      }
    });

    return () => subscription.unsubscribe();
  }, [dispatch]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Check if we're in demo mode
  const isDemoMode = !process.env.REACT_APP_SUPABASE_URL || 
    process.env.REACT_APP_SUPABASE_URL.includes('demo-project');

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-primary-50/30 flex flex-col">
        <Navbar />
      
      {/* Demo Mode Banner */}
      {isDemoMode && (
        <div className="bg-gradient-to-r from-amber-50 to-yellow-50 border-b border-amber-200/50 backdrop-blur-sm">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center justify-center">
              <div className="flex items-center space-x-3 bg-white/60 backdrop-blur-sm rounded-xl px-6 py-3 border border-amber-200/50">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                </div>
                <div>
                  <p className="text-sm text-amber-800 font-medium">
                    <span className="font-bold">Demo Mode Active</span> • Try these accounts: 
                    <code className="bg-amber-100/80 px-2 py-1 rounded-md mx-1 text-xs">demo@worker.com</code>
                    <code className="bg-amber-100/80 px-2 py-1 rounded-md mx-1 text-xs">demo@employer.com</code>
                    <code className="bg-amber-100/80 px-2 py-1 rounded-md mx-1 text-xs">admin@demo.com</code>
                    with password <code className="bg-amber-100/80 px-2 py-1 rounded-md mx-1 text-xs">demo123</code>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <main className="flex-grow relative">
        {/* Background Pattern */}
        <div className="absolute inset-0 opacity-30 pointer-events-none">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23D4AF37' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='4'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}></div>
        </div>
        
        {/* Database Status Check */}
        <div className="relative z-10">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-6">
            <DatabaseStatus />
          </div>
        </div>
        
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/about" element={<About />} />
          <Route path="/how-it-works" element={<HowItWorks />} />
          {/* <Route path="/pricing" element={<Pricing />} /> */} {/* Removed pricing feature */}
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
              <UserDashboard />
            </ProtectedRoute>
          } />

          {/* Specific Dashboard Routes */}
          <Route path="/employer/dashboard" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EmployerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/worker/dashboard" element={
            <ProtectedRoute allowedRoles={['worker']}>
              <WorkerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
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
          <Route path="/employer/create-task" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <CreateTask />
            </ProtectedRoute>
          } />
          <Route path="/employer/edit-task/:id" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <EditTask />
            </ProtectedRoute>
          } />
          <Route path="/employer/task/:id" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <TaskDetailView />
            </ProtectedRoute>
          } />
          <Route path="/employer/my-tasks" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <MyTasks />
            </ProtectedRoute>
          } />
          <Route path="/employer/review-submissions" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <ReviewSubmissions />
            </ProtectedRoute>
          } />
          
          {/* Legacy Routes - Redirect to new paths */}
          <Route path="/create-task" element={<Navigate to="/employer/create-task" replace />} />
          <Route path="/my-tasks" element={<Navigate to="/employer/my-tasks" replace />} />
          <Route path="/review-submissions" element={<Navigate to="/employer/review-submissions" replace />} />

          {/* Shared Protected Routes */}
          <Route path="/wallet" element={
            <ProtectedRoute>
              <Wallet />
            </ProtectedRoute>
          } />
          <Route path="/payment-methods" element={
            <ProtectedRoute>
              <PaymentMethods />
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
          <Route path="/admin" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminOverview />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
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
          <Route path="/admin/payments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <PaymentManagement />
            </ProtectedRoute>
          } />
          <Route path="/admin/manual-payments" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <ManualPayments />
            </ProtectedRoute>
          } />
          <Route path="/admin/analytics" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Analytics />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <Reports />
            </ProtectedRoute>
          } />
          <Route path="/admin/settings" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <SystemSettings />
            </ProtectedRoute>
          } />

          {/* Debug Routes */}
          <Route path="/debug/admin" element={<AdminTest />} />
          <Route path="/debug/tasks" element={
            <ProtectedRoute allowedRoles={['employer']}>
              <TaskNavigationTest />
            </ProtectedRoute>
          } />

          {/* Catch all route */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </main>

      <Footer />
      <MobileNav />
      
      {/* Toast Notifications */}
      <Toaster
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            style: {
              background: '#10b981',
            },
          },
          error: {
            style: {
              background: '#ef4444',
            },
          },
        }}
      />
      </div>
    </ErrorBoundary>
  );
}

export default App;