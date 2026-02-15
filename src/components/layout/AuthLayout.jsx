import { Outlet } from 'react-router-dom';
import styles from './layout.module.css';

export function AuthLayout() {
  return (
    <div className={styles.authShell}>
      <div className={styles.authCard + ' card'}>
        <div className={styles.brand}>
          <div className={styles.brandMark}>e</div>
          <div>
            <div className={styles.brandTitle}>ePermit Hub</div>
            <div className={styles.brandSub}>Admin Portal</div>
          </div>
        </div>
        <Outlet />
      </div>
      <div className={styles.authFooter}>
        <span className="muted">© {new Date().getFullYear()} ePermit Hub</span>
      </div>
    </div>
  );
}
