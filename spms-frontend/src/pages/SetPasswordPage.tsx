import { type FormEvent, useState } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { ROLE_ACCESS } from '../rbac/roles';

export function SetPasswordPage() {
  const [params] = useSearchParams();
  const [email, setEmail] = useState(params.get('email') ?? '');
  const [code, setCode] = useState(params.get('code') ?? '');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [acceptedPolicy, setAcceptedPolicy] = useState(false);
  const [error, setError] = useState('');
  const { activateUser } = useAuth();
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      const activated = await activateUser(email, code, password, acceptedPolicy);
      navigate(ROLE_ACCESS[activated.role].landingPath, { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to activate account');
    }
  }

  return (
    <main className="loginPage">
      <form className="authCard" onSubmit={submit}>
        <div>
          <div className="brandMark">S</div>
          <h1>Set Password</h1>
          <p className="muted">Complete activation to change account status to Active.</p>
        </div>

        <label htmlFor="set-email">Registered email</label>
        <input id="set-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />

        <label htmlFor="set-code">Activation OTP</label>
        <input id="set-code" required value={code} onChange={(event) => setCode(event.target.value)} />

        <label htmlFor="new-password">Password</label>
        <input id="new-password" required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />

        <label htmlFor="confirm-password">Confirm password</label>
        <input id="confirm-password" required minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />

        <label className="checkRow">
          <input type="checkbox" checked={acceptedPolicy} onChange={(event) => setAcceptedPolicy(event.target.checked)} />
          I accept the company policy.
        </label>

        {error && <p className="error">{error}</p>}
        <button type="submit">Activate account</button>
        <Link to="/first-time-login">Use OTP verification</Link>
      </form>
    </main>
  );
}
