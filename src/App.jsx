import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import ErrorBoundary from './components/ErrorBoundary';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';
import AdminLayout from './layouts/AdminLayout';

// Route Guards
import ProtectedRoute from './components/ProtectedRoute';
import AdminRoute from './components/AdminRoute';
import PublicAuthRoute from './components/PublicAuthRoute';

// Public Pages
import Home from './pages/Home';
import Categories from './pages/Categories';
import Templates from './pages/Templates';
import TemplatePreview from './pages/TemplatePreview';
import Pricing from './pages/Pricing';
import PublicInvitation from './pages/PublicInvitation';
import TermsOfService from './pages/TermsOfService';
import PrivacyPolicy from './pages/PrivacyPolicy';
import ContactUs from './pages/ContactUs';
import NotFound from './pages/NotFound';

// Auth Pages
import Login from './pages/auth/Login';
import Register from './pages/auth/Register';
import ForgotPassword from './pages/auth/ForgotPassword';
import ResetPassword from './pages/auth/ResetPassword';
import VerifyEmail from './pages/auth/VerifyEmail';

// Dashboard Pages
import Dashboard from './pages/dashboard/Dashboard';
import MyInvitations from './pages/dashboard/MyInvitations';
import CreateInvitation from './pages/dashboard/CreateInvitation';
import InvitationDetails from './pages/dashboard/InvitationDetails';
import Payment from './pages/dashboard/Payment';
import PaymentHistory from './pages/dashboard/PaymentHistory';
import Settings from './pages/dashboard/Settings';
import WhatsAppBlast from './pages/dashboard/WhatsAppBlast';

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminCategories from './pages/admin/AdminCategories';
import AdminTemplates from './pages/admin/AdminTemplates';
import AdminUsers from './pages/admin/AdminUsers';
import AdminPayments from './pages/admin/AdminPayments';
import AdminSettings from './pages/admin/AdminSettings';
import AdminTemplateBuilder from './pages/admin/AdminTemplateBuilder';

const router = createBrowserRouter([
  // Public Routes — with Navbar + Footer
  {
    element: <MainLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      { path: '/', element: <Home /> },
      { path: '/categories', element: <Categories /> },
      { path: '/categories/:categorySlug', element: <Templates /> },
      { path: '/templates', element: <Templates /> },
      { path: '/pricing', element: <Pricing /> },
      { path: '/terms', element: <TermsOfService /> },
      { path: '/privacy', element: <PrivacyPolicy /> },
      { path: '/contact', element: <ContactUs /> },
      { path: '/templates/preview/:id', element: <TemplatePreview /> },
    ],
  },

  // Public Invitation View
  { path: '/invite/:slug', element: <PublicInvitation /> },

  // Auth Routes — redirect to /dashboard if already logged in
  {
    element: <PublicAuthRoute />,
    children: [
      { path: '/login', element: <Login /> },
      { path: '/register', element: <Register /> },
      { path: '/forgot-password', element: <ForgotPassword /> },
      { path: '/reset-password/:resettoken', element: <ResetPassword /> },
    ],
  },

  // Verify email — accessible whether logged in or not
  { path: '/verify-email/:token', element: <VerifyEmail /> },

  // Protected Customer Routes
  {
    element: <ProtectedRoute />,
    children: [
      {
        element: <DashboardLayout />,
        children: [
          { path: '/dashboard', element: <Dashboard /> },
          { path: '/dashboard/invitations', element: <MyInvitations /> },
          { path: '/dashboard/create', element: <CreateInvitation /> },
          { path: '/dashboard/edit/:id', element: <CreateInvitation /> },
          { path: '/dashboard/invitations/:id', element: <InvitationDetails /> },
          { path: '/dashboard/payment/:invitationId', element: <Payment /> },
          { path: '/dashboard/payments', element: <PaymentHistory /> },
          { path: '/dashboard/settings', element: <Settings /> },
          { path: '/dashboard/whatsapp/:invitationId', element: <WhatsAppBlast /> },
        ],
      },
    ],
  },

  // Admin Routes
  {
    element: <AdminRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { path: '/admin', element: <AdminDashboard /> },
          { path: '/admin/categories', element: <AdminCategories /> },
          { path: '/admin/templates', element: <AdminTemplates /> },
          { path: '/admin/users', element: <AdminUsers /> },
          { path: '/admin/payments', element: <AdminPayments /> },
          { path: '/admin/settings', element: <AdminSettings /> },
        ],
      },
      { path: '/admin/templates/new', element: <AdminTemplateBuilder /> },
      { path: '/admin/templates/:id/edit', element: <AdminTemplateBuilder /> },
    ],
  },

  // 404 Catch-all
  { path: '*', element: <NotFound /> },
]);

const App = () => {
  return <RouterProvider router={router} />;
};

export default App;
