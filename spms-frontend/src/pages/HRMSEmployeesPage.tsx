const employees = [
  { name: 'Aarav Mehta', department: 'Engineering', role: 'Team Lead' },
  { name: 'Nisha Rao', department: 'Sales', role: 'Manager' },
  { name: 'Kabir Sharma', department: 'HRMS', role: 'HR' },
  { name: 'Meera Iyer', department: 'Operations', role: 'Employee' },
];

export function HRMSEmployeesPage() {
  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">HRMS</p>
          <h2>Employees</h2>
        </div>
        <button type="button">Add Employee</button>
      </div>

      <div className="tablePanel">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Department</th>
              <th>Role</th>
            </tr>
          </thead>
          <tbody>
            {employees.map((employee) => (
              <tr key={employee.name}>
                <td>{employee.name}</td>
                <td>{employee.department}</td>
                <td>{employee.role}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
