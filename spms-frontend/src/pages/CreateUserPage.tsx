import { type FormEvent, useEffect, useState } from 'react';
import { http } from '../api/http';
import { useAuth } from '../context/useAuth';
import { ACCOUNT_STATUS_LABELS, ROLE_LABELS, type Role } from '../rbac/roles';

const roles = Object.keys(ROLE_LABELS) as Role[];

type Department = {
  id: string;
  name: string;
};

type UserOption = {
  id: string;
  name: string;
  email: string;
};

export function CreateUserPage() {
  const { createUser, users } = useAuth();
  const [departments, setDepartments] = useState<Department[]>([]);
  const [userOptions, setUserOptions] = useState<UserOption[]>([]);
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    departmentId: '',
    designation: '',
    reportingManagerId: '',
    role: 'EMPLOYEE' as Role,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([
      http.get('/departments'),
      http.get('/users', { params: { limit: 100 } }),
    ])
      .then(([departmentsResponse, usersResponse]) => {
        if (!active) {
          return;
        }
        setDepartments(departmentsResponse.data);
        setUserOptions(usersResponse.data.data ?? usersResponse.data);
      })
      .catch(() => undefined);

    return () => {
      active = false;
    };
  }, []);

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const created = await createUser(form);
      setMessage(`Activation OTP for ${created.email}: ${created.activationCode}`);
      setForm({
        name: '',
        email: '',
        mobile: '',
        departmentId: '',
        designation: '',
        reportingManagerId: '',
        role: 'EMPLOYEE',
      });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to create user');
    }
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Restricted Sign Up</p>
          <h2>Create User</h2>
        </div>
      </div>

      <form className="panel formGrid" onSubmit={submit}>
        <label>
          Name
          <input required value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} />
        </label>
        <label>
          Email
          <input required type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} />
        </label>
        <label>
          Mobile number
          <input required value={form.mobile} onChange={(event) => setForm({ ...form, mobile: event.target.value })} />
        </label>
        <label>
          Department
          <select required value={form.departmentId} onChange={(event) => setForm({ ...form, departmentId: event.target.value })}>
            <option value="">Select department</option>
            {departments.map((department) => (
              <option key={department.id} value={department.id}>{department.name}</option>
            ))}
          </select>
        </label>
        <label>
          Designation
          <input required value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} />
        </label>
        <label>
          Reporting manager
          <select value={form.reportingManagerId} onChange={(event) => setForm({ ...form, reportingManagerId: event.target.value })}>
            <option value="">Not assigned</option>
            {userOptions.map((account) => (
              <option key={account.id} value={account.id}>{account.name} - {account.email}</option>
            ))}
          </select>
        </label>
        <label>
          Role
          <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as Role })}>
            {roles.map((role) => (
              <option key={role} value={role}>{ROLE_LABELS[role]}</option>
            ))}
          </select>
        </label>
        <label>
          Status
          <input disabled value={ACCOUNT_STATUS_LABELS.PENDING_ACTIVATION} />
        </label>

        <div className="formActions">
          {error && <p className="error">{error}</p>}
          {message && <p className="success">{message}</p>}
          <button type="submit">Create user and send activation</button>
        </div>
      </form>

      <article className="tablePanel">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((account) => (
              <tr key={account.id}>
                <td>{account.name}</td>
                <td>{account.email}</td>
                <td>{ROLE_LABELS[account.role]}</td>
                <td><span className="statusPill">{ACCOUNT_STATUS_LABELS[account.status ?? 'ACTIVE']}</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>
    </section>
  );
}
