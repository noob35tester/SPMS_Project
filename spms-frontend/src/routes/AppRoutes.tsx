import { Navigate, Route, Routes } from 'react-router-dom';
import { ProtectedRoute } from '../components/ProtectedRoute';
import { AuthProvider } from '../context/AuthContext';
import { AppLayout } from '../layouts/AppLayout';
import { AccessArchitecturePage } from '../pages/AccessArchitecturePage';
import { CRMLeadsPage } from '../pages/CRMLeadsPage';
import { DashboardPage } from '../pages/DashboardPage';
import { HRMSEmployeesPage } from '../pages/HRMSEmployeesPage';
import { KanbanPage } from '../pages/KanbanPage';
import { LoginPage } from '../pages/LoginPage';
import { NotificationsPage } from '../pages/NotificationsPage';
import { ProjectsPage } from '../pages/ProjectsPage';
import { SettingsPage } from '../pages/SettingsPage';
import { UnauthorizedPage } from '../pages/UnauthorizedPage';

export function AppRoutes() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/unauthorized" element={<UnauthorizedPage />} />        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<AppLayout />}>
            <Route index element={<DashboardPage />} />

            <Route element={<ProtectedRoute permissions={['all-modules:view']} />}>
              <Route path="access-architecture" element={<AccessArchitecturePage />} />
            </Route>

            <Route element={<ProtectedRoute permissions={['projects:view']} />}>
              <Route path="projects" element={<ProjectsPage />} />
            </Route>

            <Route element={<ProtectedRoute permissions={['kanban:view']} />}>
              <Route path="kanban" element={<KanbanPage />} />
            </Route>

            <Route element={<ProtectedRoute permissions={['crm:leads:view']} />}>
              <Route path="crm/leads" element={<CRMLeadsPage />} />
            </Route>

            <Route element={<ProtectedRoute permissions={['hrms:employees:view']} />}>
              <Route path="hrms/employees" element={<HRMSEmployeesPage />} />
            </Route>

            <Route element={<ProtectedRoute permissions={['notifications:view']} />}>
              <Route path="notifications" element={<NotificationsPage />} />
            </Route>

            <Route element={<ProtectedRoute permissions={['settings:view']} />}>
              <Route path="settings" element={<SettingsPage />} />
            </Route>
          </Route>
        </Route>

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}
