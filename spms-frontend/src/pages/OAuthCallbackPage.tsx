import { useEffect, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function OAuthCallbackPage() {
  const [params] = useSearchParams();
  const [error, setError] = useState(params.get('error') ?? '');
  const { refreshSession } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = params.get('accessToken');

    if (!accessToken) {
      setError((current) => current || 'OAuth sign-in did not return a session.');
      return;
    }

    refreshSession(accessToken)
      .then((landingPath) => navigate(landingPath, { replace: true }))
      .catch((caught) => {
        setError(caught instanceof Error ? caught.message : 'Unable to complete OAuth sign-in.');
      });
  }, [navigate, params, refreshSession]);

  return (
    <main className="loginPage">
      <section className="authCard">
        <div>
          <div className="brandMark">S</div>
          <h1>Completing Sign In</h1>
          <p className="muted">Finishing the secure provider callback.</p>
        </div>
        {error ? (
          <>
            <p className="error">{error}</p>
            <Link to="/login">Back to login</Link>
          </>
        ) : (
          <p className="success">Signing you in...</p>
        )}
      </section>
    </main>
  );
}
