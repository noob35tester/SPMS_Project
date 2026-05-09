import { ArrowUpRight, LogOut, X } from 'lucide-react';
import { useState } from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ROLE_ACCESS } from '../rbac/roles';
import { appRoutes } from '../routes/routeConfig';

export function AppLayout() {
  const [drawerOpen, setDrawerOpen] = useState(false);
  const { can, user, logout } = useAuth();
  const roleConfig = user ? ROLE_ACCESS[user.role] : null;
  const visibleRoutes = appRoutes.filter((route) => route.showInMenu !== false && can(route.permissions));

  return (
    <div className="appShell">
      <header className="topHeader">
        <button className="brandBlock brandButton" type="button" onClick={() => setDrawerOpen(true)}>
          <div className="brandMark">S</div>
          <div>
            <h1>SPMS</h1>
            <p>{roleConfig?.dashboardName ?? 'Integrated Business Platform'}</p>
          </div>
        </button>

        <button className="headerAction" type="button">
          <ArrowUpRight size={18} />
          New Report
        </button>
      </header>

      {drawerOpen && <button className="drawerOverlay" type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)} />}

      <aside className={drawerOpen ? 'drawer open' : 'drawer'} aria-label="Dashboard menu" aria-hidden={!drawerOpen}>
        <div className="drawerHeader">
          <div className="brandBlock">
            <div className="brandMark">S</div>
            <div>
              <h1>SPMS</h1>
              <p>{roleConfig?.dashboardName ?? 'Integrated Business Platform'}</p>
            </div>
          </div>
          <button className="iconButton" type="button" aria-label="Close menu" onClick={() => setDrawerOpen(false)}>
            <X size={20} />
          </button>
        </div>

        <nav className="drawer-menu navList scrollbar-hide" aria-label="Primary navigation">
          {visibleRoutes.map(({ path, label, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              onClick={() => setDrawerOpen(false)}
              className={({ isActive }) => (isActive ? 'navLink active' : 'navLink')}
            >
              <Icon size={18} />
              <span>{label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebarFooter">
          <div className="userMini">
            <span>{user?.name.slice(0, 1)}</span>
            <div>
              <strong>{user?.name}</strong>
              <p>{roleConfig?.label}</p>
            </div>
          </div>
          <button
            className="ghostButton"
            type="button"
            onClick={() => {
              setDrawerOpen(false);
              logout();
            }}
          >
            <LogOut size={17} />
            Logout
          </button>
        </div>
      </aside>

      <main className="content">
        <Outlet />
      </main>
    </div>
  );
}
