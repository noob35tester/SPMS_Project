import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import { useAuth } from '../context/useAuth';
import { AppLayout } from '../layouts/AppLayout';
import { FirstTimeLoginPage } from '../pages/FirstTimeLoginPage';
import { ForgotPasswordPage } from '../pages/ForgotPasswordPage';
import { LoginPage } from '../pages/LoginPage';
import { LogoutPage } from '../pages/LogoutPage';
import { ResetPasswordPage } from '../pages/ResetPasswordPage';
import { SetPasswordPage } from '../pages/SetPasswordPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';
import { appRoutes } from './routeConfig';

function RoleLandingRedirect() {
  const { landingPath } = useAuth();

  return <Navigate to={landingPath} replace />;
}

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/first-time-login" element={<FirstTimeLoginPage />} />
        <Route path="/set-password" element={<SetPasswordPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />
        <Route path="/access-denied" element={<UnauthorizedPage />} />

        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<RoleLandingRedirect />} />
            <Route path="logout" element={<LogoutPage />} />

            {appRoutes.map((route) => (
              <Route key={route.path} element={<ProtectedRoute permissions={route.permissions} />}>
                <Route path={route.path.slice(1)} element={route.element} />
              </Route>
            ))}
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
