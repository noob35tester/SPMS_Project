import { useEffect, useState } from 'react';
import { http } from '../api/http';
import { ACCOUNT_STATUS_LABELS, ROLE_LABELS, type AccountStatus, type Permission, type Role } from '../rbac/roles';

type ApiUser = {
  id: string;
  name: string;
  email: string;
  role: Role;
  roles?: Role[];
  department?: string;
  designation?: string;
  status?: AccountStatus;
};

type ApiRole = {
  id: string;
  name: Role;
  rolePermissions: Array<{
    permission: {
      key: Permission;
      module: string;
      action: string;
    };
  }>;
};

export function UsersRolesPage() {
  const [users, setUsers] = useState<ApiUser[]>([]);
  const [roles, setRoles] = useState<ApiRole[]>([]);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    Promise.all([
      http.get('/users', { params: { limit: 100 } }),
      http.get('/roles'),
    ])
      .then(([usersResponse, rolesResponse]) => {
        if (!active) {
          return;
        }
        setUsers(usersResponse.data.data ?? usersResponse.data);
        setRoles(rolesResponse.data);
      })
      .catch(() => {
        if (active) {
          setError('Unable to load users and roles from backend.');
        }
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Administration</p>
          <h2>Users & Roles</h2>
          <p className="muted">Database-backed account, role, and permission visibility.</p>
        </div>
      </div>

      {error && <p className="error">{error}</p>}

      <article className="tablePanel">
        <table>
          <thead>
            <tr>
              <th>User</th>
              <th>Department</th>
              <th>Designation</th>
              <th>Role</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {users.map((account) => (
              <tr key={account.id}>
                <td>
                  <strong>{account.name}</strong>
                  <p className="muted">{account.email}</p>
                </td>
                <td>{account.department ?? 'Not mapped'}</td>
                <td>{account.designation ?? 'Not provided'}</td>
                <td>{ROLE_LABELS[account.role]}</td>
                <td>
                  <span className="statusPill">{ACCOUNT_STATUS_LABELS[account.status ?? 'ACTIVE']}</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </article>

      <div className="listGrid">
        {roles.map((role) => (
          <article className="panel settingsTile" key={role.id}>
            <h3>{ROLE_LABELS[role.name] ?? role.name}</h3>
            <p className="muted">{role.rolePermissions.length} permissions</p>
            <div className="permissionList">
              {role.rolePermissions.slice(0, 8).map(({ permission }) => (
                <span key={permission.key}>{permission.key}</span>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
