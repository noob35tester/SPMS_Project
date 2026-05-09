import { CheckCircle2, Clock3, FolderKanban, ShieldCheck, UsersRound } from 'lucide-react';
import { useAuth } from '../context/useAuth';
import { ROLE_ACCESS } from '../rbac/roles';

const cardIcons = [ShieldCheck, CheckCircle2, FolderKanban, UsersRound, Clock3];

export function DashboardPage() {
  const { user } = useAuth();
  const role = user?.role ?? 'EMPLOYEE';
  const config = ROLE_ACCESS[role];

  return (
    <section className="pageStack">
      <div className="pageHeader">
        <div>
          <p className="eyebrow">{config.accessType}</p>
          <h2>{config.dashboardName}</h2>
        </div>
      </div>

      <div className="metricGrid">
        {config.dashboardCards.map(({ label, value, detail }, index) => {
          const Icon = cardIcons[index] ?? ShieldCheck;

          return (
            <article className="metricCard" key={label}>
              <Icon size={21} />
              <span>{label}</span>
              <strong>{value}</strong>
              <p>{detail}</p>
            </article>
          );
        })}
      </div>

      <article className="panel">
        <h3>Recent Activity</h3>
        <ul className="activityList">
          {config.activities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </article>
    </section>
  );
}
