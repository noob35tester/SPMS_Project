import { ROLE_ACCESS, type Permission, type Role } from './roles';

export function getRolePermissions(role: Role): Permission[] {
  return ROLE_ACCESS[role].permissions;
}

export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  return allowedRoles.includes(userRole);
}

export function hasPermission(userRole: Role, requiredPermissions: Permission[]): boolean {
  const permissions = getRolePermissions(userRole);
  return requiredPermissions.every((permission) => permissions.includes(permission));
}

export function getLandingPath(role: Role): string {
  return ROLE_ACCESS[role].landingPath;
}
