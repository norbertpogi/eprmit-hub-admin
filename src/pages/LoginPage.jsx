import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { z } from 'zod';
import { useAuth } from '../features/auth/auth-context';

const schema = z.object({
  email: z.string().email('Enter a valid email.'),
  password: z.string().min(1, 'Password is required.'),
});

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: 'reviewer@lgu.gov.ph', password: 'demo' });
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const from = location.state?.from || '/admin';

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const parsed = schema.safeParse(form);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? 'Invalid input.');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(parsed.data);
      navigate(from, { replace: true });
    } catch (err) {
      setError(err?.message ?? 'Login failed.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div>
      <h2 style={{ margin: '8px 0 4px' }}>Sign in</h2>
      <div className="muted" style={{ marginBottom: 14 }}>
        Use your LGU admin account to manage permit applications.
      </div>

      {error ? (
        <div className="card" style={{ padding: 12, borderColor: 'rgba(239,68,68,0.25)', background: 'rgba(239,68,68,0.08)', marginBottom: 12 }}>
          <strong style={{ color: '#b91c1c' }}>Error:</strong> {error}
        </div>
      ) : null}

      <form onSubmit={onSubmit} style={{ display: 'grid', gap: 10 }}>
        <label style={{ display: 'grid', gap: 6 }}>
          <span className="muted">Email</span>
          <input
            className="input"
            value={form.email}
            onChange={(e) => setForm((s) => ({ ...s, email: e.target.value }))}
            autoComplete="email"
            placeholder="name@lgu.gov.ph"
          />
        </label>

        <label style={{ display: 'grid', gap: 6 }}>
          <span className="muted">Password</span>
          <input
            className="input"
            type="password"
            value={form.password}
            onChange={(e) => setForm((s) => ({ ...s, password: e.target.value }))}
            autoComplete="current-password"
          />
        </label>

        <button className="btn btnPrimary" type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in'}
        </button>

        <div className="muted" style={{ fontSize: 12 }}>
          Demo: <code>reviewer@lgu.gov.ph</code> or <code>approver@lgu.gov.ph</code>
        </div>
      </form>
    </div>
  );
}
