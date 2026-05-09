import { BriefcaseBusiness, Building2, Mail, ShieldCheck } from 'lucide-react';
import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { demoAccounts } from '../rbac/demoAccounts';
import { ROLE_ACCESS, ROLE_LABELS } from '../rbac/roles';

export function LoginPage() {
  const [email, setEmail] = useState('admin@spms.local');
  const [password, setPassword] = useState('Admin@123');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, socialLogin } = useAuth();
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');
    setIsSubmitting(true);

    try {
      const loggedInUser = await login(email, password);
      navigate(ROLE_ACCESS[loggedInUser.role].landingPath, { replace: true });
    } catch {
      setError('Invalid login credentials');
    } finally {
      setIsSubmitting(false);
    }
  }

  async function submitProvider(provider: 'google' | 'microsoft' | 'outlook') {
    setError('');
    setIsSubmitting(true);

    try {
      await socialLogin(provider);
    } catch {
      setError('Access Denied or Account Not Found');
      setIsSubmitting(false);
    }
  }

  return (
    <main className="loginPage">
      <section className="loginPanel">
        <div>
          <div className="brandMark large">S</div>
          <h1>SPMS</h1>
          <p>Project, workflow, CRM, HRMS, and notifications in one operating workspace.</p>
        </div>

        <form className="loginCard" onSubmit={submit}>
          <div>
            <h2>Sign In</h2>
            <p className="muted">Use a registered Active account. Sign Up is restricted to Super Admin, Admin, and HR.</p>
          </div>

          <div className="loginOptionTitle">
            <Mail size={18} />
            <span>Sign in with Email</span>
          </div>

          <label htmlFor="email">Email</label>
          <input id="email" value={email} onChange={(event) => setEmail(event.target.value)} />

          <label htmlFor="password">Password</label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
          />

          {error && <p className="error">{error}</p>}

          <button type="submit" disabled={isSubmitting}>
            {isSubmitting ? 'Signing in...' : 'Login'}
          </button>

          <div className="providerPanel">
            <div className="providerButtonRow">
              <button className="providerButton google" type="button" onClick={() => submitProvider('google')}>
                <ShieldCheck size={17} />
                <span>Google</span>
              </button>
              <button className="providerButton microsoft" type="button" onClick={() => submitProvider('microsoft')}>
                <Building2 size={17} />
                <span>Microsoft</span>
              </button>
              <button className="providerButton outlook" type="button" onClick={() => submitProvider('outlook')}>
                <BriefcaseBusiness size={17} />
                <span>Outlook</span>
              </button>
            </div>
          </div>

          <div className="authLinks">
            <Link to="/first-time-login">First-Time Login</Link>
            <Link to="/forgot-password">Forgot Password</Link>
          </div>

          <div className="demoAccounts">
            <p className="muted">Demo role logins</p>
            {demoAccounts.map((account) => (
              <button
                className="roleChip"
                key={account.id}
                type="button"
                onClick={() => {
                  setEmail(account.email);
                  setPassword(account.password);
                }}
              >
                {ROLE_LABELS[account.role]}
              </button>
            ))}
          </div>
        </form>
      </section>
    </main>
  );
}
