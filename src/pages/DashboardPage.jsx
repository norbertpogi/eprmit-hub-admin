import { Link } from 'react-router-dom';
import { useApplications } from '../features/applications/useApplications';
import { ApplicationStatus, StatusMeta } from '../constants/statuses';

function groupOf(status) {
  return StatusMeta[status]?.group ?? 'In Process';
}

export default function DashboardPage() {
  const { data: apps, isLoading, error } = useApplications({});

  const counts = apps.reduce(
    (acc, a) => {
      const g = groupOf(a.status);
      acc[g] = (acc[g] || 0) + 1;
      acc.total += 1;
      return acc;
    },
    { total: 0, Draft: 0, 'In Process': 0, Completed: 0, Rejected: 0 },
  );

  return (
    <div style={{ display: 'grid', gap: 14 }}>
      <div className="grid2">
        <div className="card" style={{ padding: 14 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 10 }}>
            <div>
              <div style={{ fontWeight: 800 }}>Overview</div>
              <div className="muted" style={{ fontSize: 12 }}>High-level counters for application workflow.</div>
            </div>
            <Link className="btn" to="/admin/applications">Open Applications</Link>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 10, marginTop: 12 }}>
            {[
              { label: 'Total', value: counts.total },
              { label: 'Draft', value: counts.Draft },
              { label: 'In Process', value: counts['In Process'] },
              { label: 'Completed', value: counts.Completed },
              { label: 'Rejected', value: counts.Rejected },
            ].map((c) => (
              <div key={c.label} className="card" style={{ padding: 12, boxShadow: 'none' }}>
                <div className="muted" style={{ fontSize: 12 }}>{c.label}</div>
                <div style={{ fontWeight: 900, fontSize: 22 }}>{isLoading ? '—' : c.value}</div>
              </div>
            ))}
          </div>
          {error ? <div style={{ marginTop: 10, color: '#b91c1c' }}>{error}</div> : null}
        </div>

        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontWeight: 800 }}>Next actions</div>
          <div className="muted" style={{ fontSize: 12, marginTop: 4 }}>
            Common queues for LGU processing.
          </div>
          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            <QueueLink title="For Compliance" status={ApplicationStatus.FOR_COMPLIANCE} />
            <QueueLink title="For Approval" status={ApplicationStatus.FOR_APPROVAL} />
            <QueueLink title="For Payment" status={ApplicationStatus.FOR_PAYMENT} />
            <QueueLink title="Under Review" status={ApplicationStatus.UNDER_REVIEW} />
          </div>
        </div>
      </div>
    </div>
  );
}

function QueueLink({ title, status }) {
  return (
    <Link
      to={`/admin/applications?status=${encodeURIComponent(status)}`}
      className="card"
      style={{ padding: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: 'none' }}
    >
      <div>
        <div style={{ fontWeight: 800 }}>{title}</div>
        <div className="muted" style={{ fontSize: 12 }}>Filter applications by this stage.</div>
      </div>
      <span className="btn">Open</span>
    </Link>
  );
}
