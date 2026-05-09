export type Role =
  | 'SUPER_ADMIN'
  | 'ADMIN'
  | 'HR'
  | 'MANAGER_TEAM_LEAD'
  | 'EMPLOYEE'
  | 'SALES_CRM';

export type Permission =
  | 'dashboard:super-admin'
  | 'dashboard:admin'
  | 'dashboard:hr'
  | 'dashboard:manager'
  | 'dashboard:employee'
  | 'dashboard:sales'
  | 'all-dashboards:view'
  | 'all-modules:view'
  | 'users-roles:view'
  | 'users:create'
  | 'departments:view'
  | 'projects:view'
  | 'my-projects:view'
  | 'tasks:view'
  | 'my-tasks:view'
  | 'kanban:view'
  | 'workflow:view'
  | 'workflow:approve'
  | 'team:view'
  | 'crm:view'
  | 'crm:leads:view'
  | 'crm:clients:view'
  | 'crm:followups:view'
  | 'hrms:view'
  | 'hrms:employees:view'
  | 'hrms:leave:view'
  | 'notifications:view'
  | 'reports:view'
  | 'reports:hr:view'
  | 'reports:sales:view'
  | 'settings:view'
  | 'database:access'
  | 'development:access'
  | 'profile:view'
  | 'tasks:create'
  | 'tasks:approve'
  | 'settings:manage'
  | 'technical:access';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: Role;
  roles?: Role[];
  permissions?: Permission[];
  landingPath?: string;
  mobile?: string;
  department?: string;
  departmentId?: string;
  designation?: string;
  reportingManager?: string;
  reportingManagerId?: string;
  status?: AccountStatus;
}

export type AccountStatus =
  | 'PENDING_ACTIVATION'
  | 'ACTIVE'
  | 'INACTIVE'
  | 'LOCKED'
  | 'SUSPENDED'
  | 'TERMINATED';

export const ACCOUNT_STATUS_LABELS: Record<AccountStatus, string> = {
  PENDING_ACTIVATION: 'Pending Activation',
  ACTIVE: 'Active',
  INACTIVE: 'Inactive',
  LOCKED: 'Locked',
  SUSPENDED: 'Suspended',
  TERMINATED: 'Terminated',
};

export type DashboardCard = {
  label: string;
  value: string;
  detail: string;
};

export type RoleAccessConfig = {
  label: string;
  dashboardName: string;
  accessType: string;
  landingPath: string;
  visiblePages: string[];
  permissions: Permission[];
  dashboardCards: DashboardCard[];
  activities: string[];
  actions: Permission[];
};

export const ROLE_ACCESS: Record<Role, RoleAccessConfig> = {
  SUPER_ADMIN: {
    label: 'Super Admin',
    dashboardName: 'Super Admin Dashboard',
    accessType: 'Full System Access',
    landingPath: '/dashboard/super-admin',
    visiblePages: [
      'All Dashboards',
      'All Modules',
      'Users & Roles',
      'Create User',
      'Departments',
      'Projects & Tasks',
      'Kanban Board',
      'Workflow',
      'CRM',
      'HRMS',
      'Notifications',
      'Reports',
      'Settings',
      'Database Access',
      'Codebase / Development Access',
    ],
    permissions: [
      'dashboard:super-admin',
      'dashboard:admin',
      'dashboard:hr',
      'dashboard:manager',
      'dashboard:employee',
      'dashboard:sales',
      'all-dashboards:view',
      'all-modules:view',
      'users-roles:view',
      'users:create',
      'departments:view',
      'projects:view',
      'my-projects:view',
      'tasks:view',
      'my-tasks:view',
      'kanban:view',
      'workflow:view',
      'workflow:approve',
      'team:view',
      'crm:view',
      'crm:leads:view',
      'crm:clients:view',
      'crm:followups:view',
      'hrms:view',
      'hrms:employees:view',
      'hrms:leave:view',
      'notifications:view',
      'reports:view',
      'reports:hr:view',
      'reports:sales:view',
      'settings:view',
      'database:access',
      'development:access',
      'profile:view',
      'tasks:create',
      'tasks:approve',
      'settings:manage',
      'technical:access',
    ],
    dashboardCards: [
      { label: 'Modules', value: '14', detail: 'Full platform coverage' },
      { label: 'Users', value: '34', detail: 'All roles and departments' },
      { label: 'Dashboards', value: '6', detail: 'Every role workspace' },
      { label: 'Technical Areas', value: '2', detail: 'Database and codebase' },
    ],
    activities: ['RBAC matrix available', 'Database access enabled', 'Development access enabled', 'System settings open'],
    actions: ['tasks:create', 'tasks:approve', 'settings:manage', 'technical:access'],
  },
  ADMIN: {
    label: 'Admin',
    dashboardName: 'Admin Dashboard',
    accessType: 'Business Admin Access',
    landingPath: '/dashboard/admin',
    visiblePages: [
      'Dashboard',
      'Users & Roles',
      'Create User',
      'Departments',
      'Projects',
      'Tasks',
      'Kanban Board',
      'Workflow',
      'CRM',
      'HRMS',
      'Notifications',
      'Reports',
      'Settings',
    ],
    permissions: [
      'dashboard:admin',
      'users-roles:view',
      'users:create',
      'departments:view',
      'projects:view',
      'tasks:view',
      'kanban:view',
      'workflow:view',
      'crm:view',
      'crm:leads:view',
      'crm:clients:view',
      'crm:followups:view',
      'hrms:view',
      'hrms:employees:view',
      'hrms:leave:view',
      'notifications:view',
      'reports:view',
      'settings:view',
      'tasks:create',
    ],
    dashboardCards: [
      { label: 'Active Projects', value: '12', detail: 'Business delivery' },
      { label: 'Open Tasks', value: '86', detail: 'Across departments' },
      { label: 'Departments', value: '6', detail: 'Operational units' },
      { label: 'Reports', value: '9', detail: 'Ready to review' },
    ],
    activities: ['Project module reviewed', 'Workflow settings updated', 'Department list synchronized', 'New report generated'],
    actions: ['tasks:create'],
  },
  HR: {
    label: 'HR',
    dashboardName: 'HR Dashboard',
    accessType: 'HR Operations Access',
    landingPath: '/dashboard/hr',
    visiblePages: [
      'HR Dashboard',
      'Create User',
      'Employees',
      'Departments',
      'Leave / Basic HRMS',
      'Notifications',
      'HR Reports',
      'My Profile',
    ],
    permissions: [
      'dashboard:hr',
      'hrms:view',
      'hrms:employees:view',
      'departments:view',
      'hrms:leave:view',
      'notifications:view',
      'reports:hr:view',
      'profile:view',
      'users:create',
    ],
    dashboardCards: [
      { label: 'Employees', value: '34', detail: 'Current headcount' },
      { label: 'Departments', value: '6', detail: 'Active org units' },
      { label: 'Leave Requests', value: '8', detail: 'Pending HR action' },
      { label: 'HR Reports', value: '4', detail: 'People operations' },
    ],
    activities: ['Employee directory reviewed', 'Leave queue updated', 'Department mapping checked', 'HR report ready'],
    actions: [],
  },
  MANAGER_TEAM_LEAD: {
    label: 'Manager / Team Lead',
    dashboardName: 'Manager / Team Lead Dashboard',
    accessType: 'Team & Delivery Control',
    landingPath: '/dashboard/manager',
    visiblePages: [
      'Manager Dashboard',
      'Projects',
      'Tasks',
      'Kanban Board',
      'Workflow Approvals',
      'Team Overview',
      'Notifications',
      'Reports',
      'My Profile',
    ],
    permissions: [
      'dashboard:manager',
      'projects:view',
      'tasks:view',
      'kanban:view',
      'workflow:approve',
      'team:view',
      'notifications:view',
      'reports:view',
      'profile:view',
      'tasks:create',
      'tasks:approve',
    ],
    dashboardCards: [
      { label: 'Projects', value: '5', detail: 'Owned by your team' },
      { label: 'Team Tasks', value: '41', detail: '12 due this week' },
      { label: 'Approvals', value: '6', detail: 'Waiting for review' },
      { label: 'Team Members', value: '11', detail: 'Delivery capacity' },
    ],
    activities: ['Sprint board updated', 'Workflow approval requested', 'Team load reviewed', 'Project milestone moved'],
    actions: ['tasks:create', 'tasks:approve'],
  },
  EMPLOYEE: {
    label: 'Employee',
    dashboardName: 'Employee Dashboard',
    accessType: 'Own Work Access',
    landingPath: '/dashboard/employee',
    visiblePages: ['Employee Dashboard', 'My Projects', 'My Tasks', 'Kanban Board', 'Notifications', 'My Profile'],
    permissions: [
      'dashboard:employee',
      'my-projects:view',
      'my-tasks:view',
      'kanban:view',
      'notifications:view',
      'profile:view',
      'tasks:create',
    ],
    dashboardCards: [
      { label: 'My Tasks', value: '9', detail: '3 due soon' },
      { label: 'In Progress', value: '3', detail: 'Current work' },
      { label: 'Projects', value: '2', detail: 'Assigned projects' },
      { label: 'Notifications', value: '5', detail: 'Need attention' },
    ],
    activities: ['Task assigned to you', 'Comment added to your work', 'Kanban card moved', 'Profile details available'],
    actions: ['tasks:create'],
  },
  SALES_CRM: {
    label: 'Sales / CRM',
    dashboardName: 'Sales / CRM Dashboard',
    accessType: 'Sales Pipeline Access',
    landingPath: '/dashboard/crm',
    visiblePages: ['CRM Dashboard', 'Leads', 'Clients', 'Follow-Ups', 'Notifications', 'Sales Reports', 'My Profile'],
    permissions: [
      'dashboard:sales',
      'crm:view',
      'crm:leads:view',
      'crm:clients:view',
      'crm:followups:view',
      'notifications:view',
      'reports:sales:view',
      'profile:view',
      'tasks:create',
    ],
    dashboardCards: [
      { label: 'Leads', value: '18', detail: 'Open pipeline' },
      { label: 'Clients', value: '7', detail: 'Active accounts' },
      { label: 'Follow-Ups', value: '11', detail: 'Due this week' },
      { label: 'Sales Reports', value: '4', detail: 'Pipeline views' },
    ],
    activities: ['Lead moved to proposal', 'Client follow-up logged', 'Sales report refreshed', 'CRM note added'],
    actions: ['tasks:create'],
  },
};

export const ROLE_LABELS = Object.fromEntries(
  Object.entries(ROLE_ACCESS).map(([role, config]) => [role, config.label]),
) as Record<Role, string>;
