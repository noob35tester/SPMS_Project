import {
  Bell,
  BriefcaseBusiness,
  Building2,
  ClipboardCheck,
  ClipboardList,
  Code2,
  Columns3,
  Database,
  FolderKanban,
  LayoutDashboard,
  Network,
  Settings,
  ShieldCheck,
  UserCircle,
  UserPlus,
  Users,
} from 'lucide-react';
import type { ComponentType, ReactElement } from 'react';
import { AccessArchitecturePage } from '../pages/AccessArchitecturePage';
import { CRMLeadsPage } from '../pages/CRMLeadsPage';
import { CreateUserPage } from '../pages/CreateUserPage';
import { DashboardPage } from '../pages/DashboardPage';
import { HRMSEmployeesPage } from '../pages/HRMSEmployeesPage';
import { KanbanPage } from '../pages/KanbanPage';
import { MyProfilePage } from '../pages/MyProfilePage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { RoleSectionPage } from '../pages/RoleSectionPage';
import { SettingsPage } from '../pages/SettingsPage';
import { UsersRolesPage } from '../pages/UsersRolesPage';
import type { Permission } from '../rbac/roles';

export type AppRouteConfig = {
  path: string;
  label: string;
  icon: ComponentType<{ size?: number }>;
  permissions: Permission[];
  element: ReactElement;
  showInMenu?: boolean;
};

export const appRoutes: AppRouteConfig[] = [
  {
    path: '/dashboard/super-admin',
    label: 'Super Admin Dashboard',
    icon: LayoutDashboard,
    permissions: ['dashboard:super-admin'],
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/admin',
    label: 'Dashboard',
    icon: LayoutDashboard,
    permissions: ['dashboard:admin'],
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/hr',
    label: 'HR Dashboard',
    icon: LayoutDashboard,
    permissions: ['dashboard:hr'],
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/manager',
    label: 'Manager Dashboard',
    icon: LayoutDashboard,
    permissions: ['dashboard:manager'],
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/employee',
    label: 'Employee Dashboard',
    icon: LayoutDashboard,
    permissions: ['dashboard:employee'],
    element: <DashboardPage />,
  },
  {
    path: '/dashboard/crm',
    label: 'CRM Dashboard',
    icon: LayoutDashboard,
    permissions: ['dashboard:sales'],
    element: <DashboardPage />,
  },
  {
    path: '/all-dashboards',
    label: 'All Dashboards',
    icon: ShieldCheck,
    permissions: ['all-dashboards:view'],
    element: (
      <RoleSectionPage
        eyebrow="System"
        title="All Dashboards"
        description="Central access to every role dashboard."
        items={['Super Admin Dashboard', 'Admin Dashboard', 'HR Dashboard', 'Manager / Team Lead Dashboard', 'Employee Dashboard', 'Sales / CRM Dashboard']}
      />
    ),
  },
  {
    path: '/modules',
    label: 'All Modules',
    icon: Network,
    permissions: ['all-modules:view'],
    element: <AccessArchitecturePage />,
  },
  {
    path: '/users-roles',
    label: 'Users & Roles',
    icon: Users,
    permissions: ['users-roles:view'],
    element: <UsersRolesPage />,
  },
  {
    path: '/create-user',
    label: 'Create User',
    icon: UserPlus,
    permissions: ['users:create'],
    element: <CreateUserPage />,
  },
  {
    path: '/departments',
    label: 'Departments',
    icon: Building2,
    permissions: ['departments:view'],
    element: (
      <RoleSectionPage
        eyebrow="Organization"
        title="Departments"
        description="Department visibility follows the logged-in user role."
        items={['Engineering', 'Sales', 'HR', 'Operations', 'Finance', 'Support']}
      />
    ),
  },
  {
    path: '/projects',
    label: 'Projects',
    icon: FolderKanban,
    permissions: ['projects:view'],
    element: <ProjectsPage />,
  },
  {
    path: '/my-projects',
    label: 'My Projects',
    icon: FolderKanban,
    permissions: ['my-projects:view'],
    element: (
      <RoleSectionPage
        eyebrow="Own Work"
        title="My Projects"
        description="Projects assigned to the logged-in employee."
        items={['Client Portal MVP', 'Kanban Improvements']}
      />
    ),
  },
  {
    path: '/tasks',
    label: 'Tasks',
    icon: ClipboardList,
    permissions: ['tasks:view'],
    element: (
      <RoleSectionPage
        eyebrow="Delivery"
        title="Tasks"
        description="Task access is filtered by the current role."
        items={['Backlog', 'In Progress', 'Review', 'Done']}
      />
    ),
  },
  {
    path: '/my-tasks',
    label: 'My Tasks',
    icon: ClipboardList,
    permissions: ['my-tasks:view'],
    element: (
      <RoleSectionPage
        eyebrow="Own Work"
        title="My Tasks"
        description="Personal task queue for the employee role."
        items={['Assigned Today', 'In Progress', 'Due Soon', 'Completed This Week']}
      />
    ),
  },
  {
    path: '/kanban',
    label: 'Kanban Board',
    icon: Columns3,
    permissions: ['kanban:view'],
    element: <KanbanPage />,
  },
  {
    path: '/workflow',
    label: 'Workflow',
    icon: ClipboardCheck,
    permissions: ['workflow:view'],
    element: (
      <RoleSectionPage
        eyebrow="Process"
        title="Workflow"
        description="Business workflow visibility for administrative roles."
        items={['Request Intake', 'Review', 'Approval', 'Closure']}
      />
    ),
  },
  {
    path: '/workflow/approvals',
    label: 'Workflow Approvals',
    icon: ClipboardCheck,
    permissions: ['workflow:approve'],
    element: (
      <RoleSectionPage
        eyebrow="Approvals"
        title="Workflow Approvals"
        description="Team and delivery approvals for managers and leads."
        items={['Task Approval', 'Stage Approval', 'Exception Review', 'Delivery Sign-Off']}
      />
    ),
  },
  {
    path: '/team',
    label: 'Team Overview',
    icon: Users,
    permissions: ['team:view'],
    element: (
      <RoleSectionPage
        eyebrow="Team"
        title="Team Overview"
        description="Team workload, ownership, and delivery status."
        items={['Capacity', 'Assignments', 'Blockers', 'Reviews']}
      />
    ),
  },
  {
    path: '/crm',
    label: 'CRM',
    icon: BriefcaseBusiness,
    permissions: ['crm:view'],
    element: (
      <RoleSectionPage
        eyebrow="Sales"
        title="CRM"
        description="Customer and sales pipeline access."
        items={['Leads', 'Clients', 'Follow-Ups', 'Pipeline Reports']}
      />
    ),
  },
  {
    path: '/crm/leads',
    label: 'Leads',
    icon: BriefcaseBusiness,
    permissions: ['crm:leads:view'],
    element: <CRMLeadsPage />,
  },
  {
    path: '/crm/clients',
    label: 'Clients',
    icon: BriefcaseBusiness,
    permissions: ['crm:clients:view'],
    element: (
      <RoleSectionPage
        eyebrow="CRM"
        title="Clients"
        description="Client accounts visible to CRM-enabled roles."
        items={['Northstar Labs', 'ACME Industries', 'Metro Healthcare']}
      />
    ),
  },
  {
    path: '/crm/follow-ups',
    label: 'Follow-Ups',
    icon: Bell,
    permissions: ['crm:followups:view'],
    element: (
      <RoleSectionPage
        eyebrow="CRM"
        title="Follow-Ups"
        description="Sales follow-up queue and reminders."
        items={['Today', 'This Week', 'Overdue', 'Completed']}
      />
    ),
  },
  {
    path: '/hrms',
    label: 'HRMS',
    icon: Users,
    permissions: ['hrms:view'],
    element: (
      <RoleSectionPage
        eyebrow="People"
        title="HRMS"
        description="Human resource operations and basic HR workflows."
        items={['Employees', 'Leave', 'Departments', 'HR Reports']}
      />
    ),
  },
  {
    path: '/hrms/employees',
    label: 'Employees',
    icon: Users,
    permissions: ['hrms:employees:view'],
    element: <HRMSEmployeesPage />,
  },
  {
    path: '/hrms/leave',
    label: 'Leave / Basic HRMS',
    icon: ClipboardCheck,
    permissions: ['hrms:leave:view'],
    element: (
      <RoleSectionPage
        eyebrow="HRMS"
        title="Leave / Basic HRMS"
        description="Leave requests and basic HRMS records."
        items={['Pending Leave', 'Approved Leave', 'Policy Records', 'Attendance Notes']}
      />
    ),
  },
  {
    path: '/notifications',
    label: 'Notifications',
    icon: Bell,
    permissions: ['notifications:view'],
    element: <NotificationsPage />,
  },
  {
    path: '/reports',
    label: 'Reports',
    icon: ClipboardList,
    permissions: ['reports:view'],
    element: (
      <RoleSectionPage
        eyebrow="Insights"
        title="Reports"
        description="Role-approved reports and operational snapshots."
        items={['Project Reports', 'Task Reports', 'Workflow Reports', 'Department Reports']}
      />
    ),
  },
  {
    path: '/reports/hr',
    label: 'HR Reports',
    icon: ClipboardList,
    permissions: ['reports:hr:view'],
    element: (
      <RoleSectionPage
        eyebrow="Insights"
        title="HR Reports"
        description="People operations reports for HR access."
        items={['Headcount', 'Leave', 'Department Mix', 'Onboarding']}
      />
    ),
  },
  {
    path: '/reports/sales',
    label: 'Sales Reports',
    icon: ClipboardList,
    permissions: ['reports:sales:view'],
    element: (
      <RoleSectionPage
        eyebrow="Insights"
        title="Sales Reports"
        description="Sales pipeline reports for CRM users."
        items={['Lead Conversion', 'Client Activity', 'Follow-Up Aging', 'Pipeline Value']}
      />
    ),
  },
  {
    path: '/settings',
    label: 'Settings',
    icon: Settings,
    permissions: ['settings:view'],
    element: <SettingsPage />,
  },
  {
    path: '/database-access',
    label: 'Database Access',
    icon: Database,
    permissions: ['database:access'],
    element: (
      <RoleSectionPage
        eyebrow="Technical"
        title="Database Access"
        description="Restricted database-level system access."
        items={['Schema Overview', 'Backup Status', 'Seed Data', 'Audit Tables']}
      />
    ),
  },
  {
    path: '/development-access',
    label: 'Codebase / Development Access',
    icon: Code2,
    permissions: ['development:access'],
    element: (
      <RoleSectionPage
        eyebrow="Technical"
        title="Codebase / Development Access"
        description="Restricted development and deployment controls."
        items={['Repository', 'Build Pipeline', 'Environment Config', 'Deployment Notes']}
      />
    ),
  },
  {
    path: '/my-profile',
    label: 'My Profile',
    icon: UserCircle,
    permissions: ['profile:view'],
    element: <MyProfilePage />,
  },
];
