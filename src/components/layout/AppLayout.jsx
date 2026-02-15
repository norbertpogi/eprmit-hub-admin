import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../features/auth/auth-context';
import styles from './layout.module.css';

export function AppLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className={styles.shell}>
      <aside className={styles.sidebar}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>e</div>
          <div>
            <div className={styles.brandTitle}>ePermit Hub</div>
            <div className={styles.brandSub}>Admin Portal</div>
          </div>
        </div>

        <nav className={styles.nav}>
          <NavLink to="/admin" end className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Dashboard
          </NavLink>
          <NavLink to="/admin/applications" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Applications
          </NavLink>
          <NavLink to="/admin/users" className={({ isActive }) => (isActive ? styles.active : styles.link)}>
            Users
          </NavLink>
        </nav>

        <div className={styles.sidebarFooter}>
          <div className={styles.userCard}>
            <div className={styles.avatar}>{user?.name?.slice(0, 1)?.toUpperCase() ?? 'A'}</div>
            <div>
              <div className={styles.userName}>{user?.name ?? 'Admin'}</div>
              <div className={styles.userRole}>{user?.role ?? 'Reviewer'}</div>
            </div>
          </div>
          <button
            className="btn"
            onClick={() => {
              logout();
              navigate('/login');
            }}
          >
            Sign out
          </button>
        </div>
      </aside>

      <main className={styles.main}>
        <header className={styles.topbar}>
          <div>
            <div className={styles.pageTitle}>Permit Administration</div>
            <div className="muted">Review, validate, approve, and release permits.</div>
          </div>
          <div className={styles.topActions}>
            <button className="btn" onClick={() => navigate('/admin/applications')}>Go to Applications</button>
          </div>
        </header>

        <div className={styles.content}>
          <Outlet />
        </div>
      </main>
    </div>
  );
}
