export const SYSTEM_ROLES = [
  'SUPER_ADMIN',
  'ADMIN',
  'HR',
  'MANAGER_TEAM_LEAD',
  'EMPLOYEE',
  'SALES_CRM',
] as const;

export type SystemRole = (typeof SYSTEM_ROLES)[number];

export const ROLE_LANDING_PATHS: Record<SystemRole, string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  ADMIN: '/dashboard/admin',
  HR: '/dashboard/hr',
  MANAGER_TEAM_LEAD: '/dashboard/manager',
  EMPLOYEE: '/dashboard/employee',
  SALES_CRM: '/dashboard/crm',
};

export const ACTIVE_LOGIN_STATUS = 'ACTIVE';
