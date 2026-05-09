import { CheckCircle2, Database, Filter, KeyRound, LayoutGrid, LockKeyhole, Menu, Network, ShieldCheck } from 'lucide-react';
import { ACCESS_PIPELINE, ROLE_ACCESS_PROFILES } from '../rbac/architecture';
import { ROLE_LABELS } from '../rbac/roles';

const authBlocks = [
  { label: 'Login Page', icon: KeyRound },
  { label: 'JWT Authentication', icon: LockKeyhole },
  { label: 'RBAC / Permissions', icon: ShieldCheck },
  { label: 'Role-Based Routing', icon: Network },
  { label: 'Menu Visibility Control', icon: Menu },
  { label: 'Data-Level Access Filters', icon: Filter },
];

const systemLayers = [
  { label: 'Frontend Layer', detail: 'React / Vite web app' },
  { label: 'Backend API Layer', detail: 'NestJS authentication, RBAC, business logic, APIs' },
  { label: 'Business Modules', detail: 'Projects, Tasks, Workflow, HRMS, CRM, Notifications, Reports' },
  { label: 'Data Layer', detail: 'PostgreSQL + Prisma with role-aware data filters' },
  { label: 'File / Email / Background Jobs', detail: 'Uploads, SMTP, queues, scheduled work' },
];

export function AccessArchitecturePage() {
  return (
    <section className="accessMap">
      <header className="accessHero">
        <p className="eyebrow">Access control blueprint</p>
        <h2>SPMS Role-Based Access Architecture</h2>
        <p>Login, dashboard access, menu visibility, permitted actions, data filters, and technical access control for the MVP.</p>
      </header>

      <section className="architectureSection authSection">
        <div className="sectionNumber">1</div>
        <h3>Authentication & Access Control</h3>
        <div className="authGrid">
          {authBlocks.map(({ label, icon: Icon }) => (
            <article key={label} className="authBlock">
              <Icon size={34} />
              <strong>{label}</strong>
            </article>
          ))}
        </div>
        <div className="pipeline">
          {ACCESS_PIPELINE.map((step) => (
            <span key={step}>{step}</span>
          ))}
        </div>
      </section>

      <section className="architectureSection">
        <div className="sectionNumber purple">2</div>
        <h3>Role-Specific Dashboards / Visible Pages</h3>
        <div className="roleAccessGrid">
          {ROLE_ACCESS_PROFILES.map((profile) => (
            <article className={`roleAccessCard ${profile.tone}`} key={profile.role}>
              <header>
                <span className="roleIcon">{profile.icon}</span>
                <div>
                  <h4>{profile.dashboard}</h4>
                  <p>{profile.scope}</p>
                </div>
              </header>
              <ul>
                {profile.visiblePages.map((page) => (
                  <li key={page}>{page}</li>
                ))}
              </ul>
              <footer>{profile.scope}</footer>
            </article>
          ))}
        </div>
      </section>

      <section className="architectureSection systemSection">
        <div className="sectionNumber">3</div>
        <h3>Application Layer Access</h3>
        <div className="systemMap">
          <aside className="technicalBox">
            <Database size={28} />
            <strong>Direct technical access</strong>
            <p>Database, code repository, deployment, and configuration.</p>
            <span>Super Admin Only</span>
          </aside>
          <div className="layerStack">
            {systemLayers.map((layer) => (
              <article key={layer.label}>
                <LayoutGrid size={20} />
                <strong>{layer.label}</strong>
                <p>{layer.detail}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section className="architectureSection summarySection">
        <div className="sectionNumber">4</div>
        <h3>Access Summary</h3>
        <div className="summaryGrid">
          {ROLE_ACCESS_PROFILES.map((profile) => (
            <article className={`summaryCard ${profile.tone}`} key={profile.role}>
              <strong>{ROLE_LABELS[profile.role]}</strong>
              <p>{profile.scope}</p>
            </article>
          ))}
        </div>
        <div className="principleBox">
          <CheckCircle2 size={34} />
          <p>All users enter through a single login system. The backend must check authentication, RBAC rules, data scope, allowed actions, and audit logging before completing protected operations.</p>
        </div>
      </section>
    </section>
  );
}
