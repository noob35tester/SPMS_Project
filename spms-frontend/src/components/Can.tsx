import type { ReactNode } from 'react';
import { useAuth } from '../context/useAuth';
import type { Permission, Role } from '../rbac/roles';

type CanProps = {
  roles?: Role[];
  permissions?: Permission[];
  children: ReactNode;
};

export function Can({ roles = [], permissions = [], children }: CanProps) {
  const { can, is } = useAuth();
  const roleAllowed = roles.length === 0 || is(roles);
  const permissionAllowed = permissions.length === 0 || can(permissions);

  if (!roleAllowed || !permissionAllowed) {
    return null;
  }

  return <>{children}</>;
}
