import { BrowserRouter, Routes, Route } from 'react-router-dom';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';

// Public Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import Templates from './pages/Templates';
import Pricing from './pages/Pricing';
import PublicInvitation from './pages/PublicInvitation';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyInvitations from './pages/dashboard/MyInvitations';
import CreateInvitation from './pages/dashboard/CreateInvitation';
import InvitationDetails from './pages/dashboard/InvitationDetails';
import Payment from './pages/dashboard/Payment';
import PaymentHistory from './pages/dashboard/PaymentHistory';
import Settings from './pages/dashboard/Settings';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTemplateBuilder from './pages/admin/AdminTemplateBuilder';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route element={<MainLayout />}>
          <Route path="/" element={<Home />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/categories/:categorySlug" element={<Templates />} />
          <Route path="/templates" element={<Templates />} />
          <Route path="/pricing" element={<Pricing />} />
        </Route>

        {/* Public Invitation View */}
        <Route path="/invite/:slug" element={<PublicInvitation />} />

        {/* Auth Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Customer Routes */}
        <Route element={<ProtectedRoute />}>
          <Route element={<DashboardLayout />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/dashboard/invitations" element={<MyInvitations />} />
            <Route path="/dashboard/create" element={<CreateInvitation />} />
            <Route path="/dashboard/invitations/:id" element={<InvitationDetails />} />
            <Route path="/dashboard/payment/:invitationId" element={<Payment />} />
            <Route path="/dashboard/payments" element={<PaymentHistory />} />
            <Route path="/dashboard/settings" element={<Settings />} />
          </Route>
        </Route>

        {/* Admin Routes */}
        <Route element={<AdminRoute />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/admin/categories" element={<AdminCategories />} />
            <Route path="/admin/templates" element={<AdminTemplates />} />
            <Route path="/admin/users" element={<AdminUsers />} />
            <Route path="/admin/payments" element={<AdminPayments />} />
            <Route path="/admin/settings" element={<AdminSettings />} />
          </Route>
          {/* Template Builder - Full page without sidebar */}
          <Route path="/admin/templates/new" element={<AdminTemplateBuilder />} />
          <Route path="/admin/templates/:id/edit" element={<AdminTemplateBuilder />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
};

export default App;
