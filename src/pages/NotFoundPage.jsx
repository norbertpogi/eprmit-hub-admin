import { Link } from 'react-router-dom';

export default function NotFoundPage() {
  return (
    <div className="container" style={{ paddingTop: 40 }}>
      <div className="card" style={{ padding: 18 }}>
        <div style={{ fontWeight: 900, fontSize: 22 }}>Page not found</div>
        <div className="muted" style={{ marginTop: 6 }}>
          The page you’re looking for doesn’t exist.
        </div>
        <div style={{ marginTop: 12 }}>
          <Link className="btn btnPrimary" to="/admin">Go to Dashboard</Link>
        </div>
      </div>
    </div>
  );
}
