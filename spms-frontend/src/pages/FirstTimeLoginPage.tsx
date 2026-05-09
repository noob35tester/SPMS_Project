import { type FormEvent, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export function FirstTimeLoginPage() {
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  function submit(event: FormEvent) {
    event.preventDefault();
    navigate(`/set-password?email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`);
  }

  return (
    <main className="loginPage">
      <form className="authCard" onSubmit={submit}>
        <div>
          <div className="brandMark">S</div>
          <h1>First-Time Login</h1>
          <p className="muted">Verify the activation link or OTP shared after account creation.</p>
        </div>

        <label htmlFor="activation-email">Registered email</label>
        <input id="activation-email" required type="email" value={email} onChange={(event) => setEmail(event.target.value)} />

        <label htmlFor="activation-code">Activation OTP</label>
        <input id="activation-code" required value={code} onChange={(event) => setCode(event.target.value)} />

        <label htmlFor="new-password">New password</label>
        <input id="new-password" required type="password" value={password} onChange={(event) => setPassword(event.target.value)} />

        <button type="submit">Verify and continue</button>
        <Link to="/login">Back to login</Link>
      </form>
    </main>
  );
}
