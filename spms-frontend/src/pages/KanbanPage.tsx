const columns = [
  {
    name: 'Open',
    tasks: ['Create project filters', 'Prepare onboarding seed data'],
  },
  {
    name: 'Assigned',
    tasks: ['Map CRM lead fields', 'Add department selector'],
  },
  {
    name: 'In Progress',
    tasks: ['Build Kanban API contract', 'Connect dashboard counters'],
  },
  {
    name: 'Review',
    tasks: ['Validate workflow transition rules'],
  },
  {
    name: 'Done',
    tasks: ['PostgreSQL setup', 'Prisma seed roles'],
  },
];

export function KanbanPage() {
  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Workflow</p>
          <h2>Kanban Board</h2>
        </div>
        <button type="button">Add Task</button>
      </div>

      <div className="kanban">
        {columns.map((column) => (
          <section className="kanbanColumn" key={column.name}>
            <header>
              <h3>{column.name}</h3>
              <span>{column.tasks.length}</span>
            </header>
            {column.tasks.map((task) => (
              <article className="taskCard" key={task}>
                <strong>{task}</strong>
                <p>Medium priority</p>
              </article>
            ))}
          </section>
        ))}
      </div>
    </section>
  );
}
