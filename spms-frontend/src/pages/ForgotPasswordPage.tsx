import { type FormEvent, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/useAuth';

export function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const { requestPasswordReset } = useAuth();

  async function submit(event: FormEvent) {
    event.preventDefault();
    setMessage('');
    setError('');

    try {
      const code = await requestPasswordReset(email);
      setMessage(`Password reset OTP for ${email}: ${code}`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : 'Unable to request password reset');
    }
  }

  return (
    <main className="loginPage">
      <form className="authCard" onSubmit={submit}>
        <div>
          <div className="brandMark">S</div>
          <h1>Forgot Password</h1>
          <p className="muted">Reset is available only for registered Active accounts.</p>
        </div>

        <label htmlFor="forgot-email">Registered email</label>
        <input id="forgot-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />

        {error && <p className="error">{error}</p>}
        {message && <p className="success">{message}</p>}
        <button type="submit">Send reset OTP</button>
        <Link to="/reset-password">I have an OTP</Link>
      </form>
    </main>
  );
}
