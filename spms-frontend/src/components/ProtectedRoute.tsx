import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import type { Permission, Role } from '../rbac/roles';

type ProtectedRouteProps = {
  roles?: Role[];
  permissions?: Permission[];
};

export function ProtectedRoute({ roles = [], permissions = [] }: ProtectedRouteProps) {
  const { can, is, isAuthenticated } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (roles.length > 0 && !is(roles)) {
    return <Navigate to="/unauthorized" replace />;
  }

  if (permissions.length > 0 && !can(permissions)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
}
