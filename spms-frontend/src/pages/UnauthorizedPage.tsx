import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function UnauthorizedPage() {
  const { landingPath } = useAuth();

  return (
    <main className="loginPage">
      <section className="accessDenied">
        <h1>Access Denied</h1>
        <p>You do not have permission to open this page with the current role.</p>
        <Link to={landingPath}>Go to dashboard</Link>
      </section>
    </main>
  );
}
