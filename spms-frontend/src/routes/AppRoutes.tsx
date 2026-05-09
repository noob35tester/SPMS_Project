import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../context/useAuth';
import { AppLayout } from '../layouts/AppLayout';
import { AccessArchitecturePage } from '../pages/AccessArchitecturePage';
import { DashboardPage } from '../pages/DashboardPage';
import { FirstTimeLoginPage } from '../pages/FirstTimeLoginPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { OAuthCallbackPage } from '../pages/OAuthCallbackPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { SetPasswordPage } from '../pages/SetPasswordPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { appRoutes } from './routeConfig';

function LandingRedirect() {
  const { landingPath } = useAuth();
  return <Navigate to={landingPath} replace />;
}

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/auth/callback" element={<OAuthCallbackPage />} />
        <Route path="/first-time-login" element={<FirstTimeLoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<LandingRedirect />} />
            <Route path="access-architecture" element={<AccessArchitecturePage />} />
            <Route path="dashboard" element={<DashboardPage />} />
            {appRoutes.map((route) => (
              <Route key={route.path} element={<ProtectedRoute permissions={route.permissions} />}>
                <Route path={route.path.replace(/^\//, '')} element={route.element} />
              </Route>
            ))}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
