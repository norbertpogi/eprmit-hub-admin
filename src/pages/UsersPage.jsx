import { useEffect, useState } from 'react';
import { usersService } from '../services/users-service';

export default function UsersPage() {
  const [users, setUsers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError('');
    usersService
      .list()
      .then((res) => mounted && setUsers(res))
      .catch((e) => mounted && setError(e?.message ?? 'Failed to load users'))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, []);

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ fontWeight: 900, fontSize: 18 }}>Users</div>
        <div className="muted">Admin accounts and roles (prototype list).</div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse' }}>
          <thead style={{ background: 'rgba(17,24,39,0.03)' }}>
            <tr>
              {['Name', 'Email', 'Role'].map((h) => (
                <th key={h} style={thStyle}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr><td colSpan={3} style={{ padding: 14 }}>Loading…</td></tr>
            ) : error ? (
              <tr><td colSpan={3} style={{ padding: 14, color: '#b91c1c' }}>{error}</td></tr>
            ) : (
              users.map((u) => (
                <tr key={u.id}>
                  <td style={tdStyle}>{u.name}</td>
                  <td style={tdStyle} className="muted">{u.email}</td>
                  <td style={tdStyle}><span className="badge">{u.role}</span></td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '12px 14px',
  fontSize: 12,
  color: 'var(--muted)',
  borderBottom: '1px solid var(--border)',
};

const tdStyle = {
  padding: '12px 14px',
  borderBottom: '1px solid var(--border)',
};
