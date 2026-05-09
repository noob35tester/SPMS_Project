import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function ResetPasswordPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const { resetPassword } = useAuth();
  const navigate = useNavigate();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    try {
      await resetPassword(email, code, password);
      navigate('/login', { replace: true });
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to reset password');
    }
  }

  return (
    <main className="loginPage">
      <form className="authCard" onSubmit={submit}>
        <div>
          <div className="brandMark">S</div>
          <h1>Reset Password</h1>
          <p className="muted">Enter the reset OTP sent to your registered email.</p>
        </div>

        <label htmlFor="reset-email">Registered email</label>
        <input id="reset-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />

        <label htmlFor="reset-code">Reset OTP</label>
        <input id="reset-code" required value={code} onChange={(event) => setCode(event.target.value)} />

        <label htmlFor="reset-password">New password</label>
        <input id="reset-password" required minLength={8} type="password" value={password} onChange={(event) => setPassword(event.target.value)} />

        <label htmlFor="reset-confirm-password">Confirm password</label>
        <input id="reset-confirm-password" required minLength={8} type="password" value={confirmPassword} onChange={(event) => setConfirmPassword(event.target.value)} />

        {error && <p className="error">{error}</p>}
        <button type="submit">Reset password</button>
        <Link to="/forgot-password">Request OTP</Link>
      </form>
    </main>
  );
}
