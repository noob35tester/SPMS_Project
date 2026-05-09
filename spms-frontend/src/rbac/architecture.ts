import { ROLE_ACCESS, type Role } from './roles';

const profileVisuals: Record<Role, { tone: string; icon: string }> = {
  SUPER_ADMIN: { tone: 'purple', icon: 'SA' },
  ADMIN: { tone: 'blue', icon: 'A' },
  HR: { tone: 'green', icon: 'HR' },
  MANAGER_TEAM_LEAD: { tone: 'orange', icon: 'MT' },
  EMPLOYEE: { tone: 'teal', icon: 'E' },
  SALES_CRM: { tone: 'red', icon: 'CRM' },
};

export const ROLE_ACCESS_PROFILES = Object.entries(ROLE_ACCESS).map(([role, config]) => ({
  role: role as Role,
  tone: profileVisuals[role as Role].tone,
  icon: profileVisuals[role as Role].icon,
  dashboard: config.dashboardName,
  scope: config.accessType,
  visiblePages: config.visiblePages,
  menuAccess: config.permissions,
}));

export const ACCESS_PIPELINE = [
  'Login account',
  'Single assigned role',
  'Reusable role-permission config',
  'Role landing dashboard',
  'Sidebar visibility',
  'Protected direct URLs',
  'Dashboard card filtering',
];
