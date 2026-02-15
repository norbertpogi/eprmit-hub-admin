import styles from './stage-timeline.module.css';
import { ApplicationStatus, toStatusLabel } from '../constants/statuses';

const orderedStages = [
  ApplicationStatus.SUBMITTED,
  ApplicationStatus.UNDER_REVIEW,
  ApplicationStatus.FOR_COMPLIANCE,
  ApplicationStatus.FOR_PAYMENT,
  ApplicationStatus.FOR_APPROVAL,
  ApplicationStatus.APPROVED,
  ApplicationStatus.RELEASED,
];

/**
 * Timeline that shows where the application currently is.
 * Rejected is displayed as a separate banner.
 */
export function StageTimeline({ status }) {
  if (status === ApplicationStatus.DRAFT) {
    return (
      <div className={styles.draftRow}>
        <div className={styles.draftChip}>Draft</div>
        <div className={styles.draftText}>Not submitted yet.</div>
      </div>
    );
  }

  if (status === ApplicationStatus.REJECTED) {
    return <div className={styles.rejected}>Rejected</div>;
  }

  const currentIndex = orderedStages.indexOf(status);

  return (
    <div className={styles.timeline}>
      {orderedStages.map((s, idx) => {
        const done = currentIndex > -1 && idx < currentIndex;
        const current = idx === currentIndex;
        return (
          <div key={s} className={styles.step}>
            <div className={styles.top}>
              <div className={done ? styles.dotDone : current ? styles.dotCurrent : styles.dotTodo} />
              {idx !== orderedStages.length - 1 && <div className={styles.line} />}
            </div>
            <div className={done ? styles.labelDone : current ? styles.labelCurrent : styles.labelTodo}>
              {toStatusLabel(s)}
            </div>
          </div>
        );
      })}
    </div>
  );
}
