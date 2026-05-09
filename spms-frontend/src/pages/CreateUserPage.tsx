import { type FormEvent, useState } from 'react';
import { useAuth } from '../context/useAuth';
import { ACCOUNT_STATUS_LABELS, ROLE_LABELS, type Role } from '../rbac/roles';

const roles = Object.keys(ROLE_LABELS) as Role[];

export function CreateUserPage() {
  const { createUser, users } = useAuth();
  const [form, setForm] = useState({
    name: '',
    email: '',
    mobile: '',
    department: '',
    designation: '',
    reportingManager: '',
    role: 'EMPLOYEE' as Role,
  });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

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
        department: '',
        designation: '',
        reportingManager: '',
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
          <input required value={form.department} onChange={(event) => setForm({ ...form, department: event.target.value })} />
        </label>
        <label>
          Designation
          <input required value={form.designation} onChange={(event) => setForm({ ...form, designation: event.target.value })} />
        </label>
        <label>
          Reporting manager
          <input required value={form.reportingManager} onChange={(event) => setForm({ ...form, reportingManager: event.target.value })} />
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
