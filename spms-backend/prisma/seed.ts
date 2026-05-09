import 'dotenv/config';
import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});

const prisma = new PrismaClient({ adapter });

async function main() {
  const roles = ['Admin', 'Manager', 'Team Lead', 'Employee', 'HR', 'Sales'];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { name: role },
      update: {},
      create: { name: role },
    });
  }

  const workflow = await prisma.workflowDefinition.upsert({
    where: {
      id: 'default-task-workflow',
    },
    update: {},
    create: {
      id: 'default-task-workflow',
      name: 'Default Task Workflow',
      module: 'TASK',
    },
  });

  const states = [
    { name: 'Open', order: 1 },
    { name: 'Assigned', order: 2 },
    { name: 'In Progress', order: 3 },
    { name: 'Review', order: 4 },
    { name: 'Done', order: 5 },
  ];

  for (const state of states) {
    const existing = await prisma.workflowState.findFirst({
      where: {
        name: state.name,
        workflowId: workflow.id,
      },
    });

    if (!existing) {
      await prisma.workflowState.create({
        data: {
          name: state.name,
          order: state.order,
          workflowId: workflow.id,
        },
      });
    }
  }

  console.log('SPMS seed data created successfully');
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
