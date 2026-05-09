const projects = [
  { name: 'Client Portal MVP', owner: 'Product', status: 'ACTIVE', tasks: 18 },
  { name: 'CRM Pipeline Setup', owner: 'Sales', status: 'ACTIVE', tasks: 11 },
  { name: 'Employee Directory', owner: 'HRMS', status: 'ON_HOLD', tasks: 7 },
  { name: 'Workflow Engine Rules', owner: 'Operations', status: 'ACTIVE', tasks: 14 },
];

export function ProjectsPage() {
  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Delivery</p>
          <h2>Projects & Tasks</h2>
        </div>
        <button type="button">Create Project</button>
      </div>

      <div className="tablePanel">
        <table>
          <thead>
            <tr>
              <th>Project</th>
              <th>Department</th>
              <th>Status</th>
              <th>Tasks</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.name}>
                <td>{project.name}</td>
                <td>{project.owner}</td>
                <td>
                  <span className={`statusPill ${project.status.toLowerCase()}`}>{project.status}</span>
                </td>
                <td>{project.tasks}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
