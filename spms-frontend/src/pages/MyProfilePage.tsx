import { useAuth } from '../context/useAuth';
import { ACCOUNT_STATUS_LABELS, ROLE_LABELS } from '../rbac/roles';

export function MyProfilePage() {
  const { user, permissions } = useAuth();

  if (!user) {
    return null;
  }

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">Account</p>
          <h2>My Profile</h2>
        </div>
      </div>

      <article className="panel profileGrid">
        <div>
          <span className="profileAvatar">{user.name.slice(0, 1)}</span>
          <h3>{user.name}</h3>
          <p className="muted">{user.email}</p>
        </div>
        <dl>
          <dt>Mobile number</dt>
          <dd>{user.mobile ?? 'Not provided'}</dd>
          <dt>Department</dt>
          <dd>{user.department ?? 'Not provided'}</dd>
          <dt>Designation</dt>
          <dd>{user.designation ?? 'Not provided'}</dd>
          <dt>Reporting manager</dt>
          <dd>{user.reportingManager ?? 'Not provided'}</dd>
          <dt>Role</dt>
          <dd>{ROLE_LABELS[user.role]}</dd>
          <dt>Status</dt>
          <dd>{ACCOUNT_STATUS_LABELS[user.status ?? 'ACTIVE']}</dd>
        </dl>
      </article>

      <article className="panel">
        <h3>Available permissions</h3>
        <div className="permissionList">
          {permissions.map((permission) => <span key={permission}>{permission}</span>)}
        </div>
      </article>
    </section>
  );
}
