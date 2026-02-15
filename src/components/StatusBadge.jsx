import clsx from 'clsx';
import { toStatusLabel } from '../constants/statuses';
import styles from './status-badge.module.css';

export function StatusBadge({ status }) {
  return (
    <span className={clsx('badge', styles.badge, styles[status])} title={status}>
      <span className={styles.dot} />
      {toStatusLabel(status)}
    </span>
  );
}
