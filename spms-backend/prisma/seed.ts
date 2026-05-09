import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as bcrypt from 'bcrypt';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

const roles = [
  'SUPER_ADMIN',
  'ADMIN',
  'HR',
  'MANAGER_TEAM_LEAD',
  'EMPLOYEE',
  'SALES_CRM',
] as const;

const permissions = [
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
];

const rolePermissions: Record<(typeof roles)[number], string[]> = {
  SUPER_ADMIN: permissions,
  ADMIN: [
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
  HR: [
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
  MANAGER_TEAM_LEAD: [
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
  EMPLOYEE: [
    'dashboard:employee',
    'my-projects:view',
    'my-tasks:view',
    'kanban:view',
    'notifications:view',
    'profile:view',
    'tasks:create',
  ],
  SALES_CRM: [
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
};

const landingPaths: Record<(typeof roles)[number], string> = {
  SUPER_ADMIN: '/dashboard/super-admin',
  ADMIN: '/dashboard/admin',
  HR: '/dashboard/hr',
  MANAGER_TEAM_LEAD: '/dashboard/manager',
  EMPLOYEE: '/dashboard/employee',
  SALES_CRM: '/dashboard/crm',
};

const departments = [
  'Content',
  'Instruction Design',
  'Quality Control',
  'Sales',
  'Accounts',
  'AI Team',
  'Editor Team',
  'HR',
];

const demoUsers = [
  {
    name: 'Sonal Super Admin',
    email: 'superadmin@spms.local',
    password: 'SuperAdmin@123',
    role: 'SUPER_ADMIN',
    mobile: '+91 90000 10001',
    department: 'Content',
    designation: 'Super Admin',
  },
  {
    name: 'SPMS Admin',
    email: 'admin@spms.local',
    password: 'Admin@123',
    role: 'ADMIN',
    mobile: '+91 90000 10002',
    department: 'Content',
    designation: 'Platform Admin',
  },
  {
    name: 'Hema HR',
    email: 'hr@spms.local',
    password: 'HR@123',
    role: 'HR',
    mobile: '+91 90000 10003',
    department: 'HR',
    designation: 'HR Executive',
  },
  {
    name: 'Maya Manager',
    email: 'manager@spms.local',
    password: 'Manager@123',
    role: 'MANAGER_TEAM_LEAD',
    mobile: '+91 90000 10004',
    department: 'AI Team',
    designation: 'Team Lead',
  },
  {
    name: 'Esha Employee',
    email: 'employee@spms.local',
    password: 'Employee@123',
    role: 'EMPLOYEE',
    mobile: '+91 90000 10005',
    department: 'AI Team',
    designation: 'Software Engineer',
  },
  {
    name: 'Sameer Sales',
    email: 'sales@spms.local',
    password: 'Sales@123',
    role: 'SALES_CRM',
    mobile: '+91 90000 10006',
    department: 'Sales',
    designation: 'CRM Specialist',
  },
] as const;

function splitPermission(key: string) {
  const [module, action] = key.split(':');
  return { module, action };
}

async function main() {
  const saltRounds = Number(process.env.BCRYPT_SALT_ROUNDS ?? 10);

  for (const name of roles) {
    await prisma.role.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const key of permissions) {
    const { module, action } = splitPermission(key);
    await prisma.permission.upsert({
      where: { key },
      update: { module, action },
      create: { key, module, action },
    });
  }

  for (const [roleName, keys] of Object.entries(rolePermissions)) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: roleName } });
    for (const key of keys) {
      const permission = await prisma.permission.findUniqueOrThrow({ where: { key } });
      await prisma.rolePermission.upsert({
        where: {
          roleId_permissionId: {
            roleId: role.id,
            permissionId: permission.id,
          },
        },
        update: {},
        create: {
          roleId: role.id,
          permissionId: permission.id,
        },
      });
    }
  }

  for (const name of departments) {
    await prisma.department.upsert({
      where: { name },
      update: {},
      create: { name },
    });
  }

  for (const demoUser of demoUsers) {
    const role = await prisma.role.findUniqueOrThrow({ where: { name: demoUser.role } });
    const department = await prisma.department.findUniqueOrThrow({
      where: { name: demoUser.department },
    });
    const passwordHash = await bcrypt.hash(demoUser.password, saltRounds);
    const user = await prisma.user.upsert({
      where: { email: demoUser.email },
      update: {
        name: demoUser.name,
        passwordHash,
        status: 'ACTIVE',
        mobile: demoUser.mobile,
        designation: demoUser.designation,
        departmentId: department.id,
        policyAccepted: true,
      },
      create: {
        name: demoUser.name,
        email: demoUser.email,
        passwordHash,
        status: 'ACTIVE',
        mobile: demoUser.mobile,
        designation: demoUser.designation,
        departmentId: department.id,
        policyAccepted: true,
      },
    });

    await prisma.userRole.upsert({
      where: {
        userId_roleId: {
          userId: user.id,
          roleId: role.id,
        },
      },
      update: {},
      create: {
        userId: user.id,
        roleId: role.id,
      },
    });
  }

  const workflow = await prisma.workflowDefinition.upsert({
    where: { id: 'default-task-workflow' },
    update: {
      name: 'Default Task Workflow',
      module: 'TASK',
    },
    create: {
      id: 'default-task-workflow',
      name: 'Default Task Workflow',
      module: 'TASK',
    },
  });

  const stateInputs = [
    { name: 'Open', order: 1 },
    { name: 'Assigned', order: 2 },
    { name: 'In Progress', order: 3 },
    { name: 'Review', order: 4 },
    { name: 'Done', order: 5 },
  ];

  for (const state of stateInputs) {
    const existing = await prisma.workflowState.findFirst({
      where: { name: state.name, workflowId: workflow.id },
    });

    if (existing) {
      await prisma.workflowState.update({
        where: { id: existing.id },
        data: { order: state.order },
      });
    } else {
      await prisma.workflowState.create({
        data: { ...state, workflowId: workflow.id },
      });
    }
  }

  const states = await prisma.workflowState.findMany({
    where: { workflowId: workflow.id },
  });
  const stateIdByName = new Map(states.map((state) => [state.name, state.id]));
  const workflowTransitions = [
    ['Open', 'Assigned', 'Assign Task', ['SUPER_ADMIN', 'ADMIN', 'MANAGER_TEAM_LEAD']],
    ['Assigned', 'In Progress', 'Start Work', roles],
    ['In Progress', 'Review', 'Submit for Review', roles],
    ['Review', 'Done', 'Approve Done', ['SUPER_ADMIN', 'ADMIN', 'MANAGER_TEAM_LEAD']],
    ['Review', 'In Progress', 'Request Changes', ['SUPER_ADMIN', 'ADMIN', 'MANAGER_TEAM_LEAD']],
  ] as const;

  for (const [from, to, actionName, allowedRoles] of workflowTransitions) {
    const fromStateId = stateIdByName.get(from);
    const toStateId = stateIdByName.get(to);
    if (!fromStateId || !toStateId) {
      continue;
    }

    const existing = await prisma.workflowTransition.findFirst({
      where: { workflowId: workflow.id, fromStateId, toStateId, actionName },
    });

    if (existing) {
      await prisma.workflowTransition.update({
        where: { id: existing.id },
        data: { allowedRoles: [...allowedRoles], isActive: true },
      });
    } else {
      await prisma.workflowTransition.create({
        data: {
          workflowId: workflow.id,
          fromStateId,
          toStateId,
          actionName,
          allowedRoles: [...allowedRoles],
        },
      });
    }
  }

  console.log('SPMS seed data created successfully');
  console.log('Seeded role landing paths:', landingPaths);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
