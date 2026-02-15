import { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { StageTimeline } from '../components/StageTimeline';
import { StatusBadge } from '../components/StatusBadge';
import { ApplicationStatus, toStatusLabel } from '../constants/statuses';
import { applicationsService } from '../services/applications-service';
import { useAuth } from '../features/auth/auth-context';

export default function ApplicationDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [app, setApp] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [note, setNote] = useState('');
  const [toStatus, setToStatus] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    setError('');
    applicationsService
      .get(id)
      .then((res) => mounted && setApp(res))
      .catch((e) => mounted && setError(e?.message ?? 'Failed to load application'))
      .finally(() => mounted && setIsLoading(false));
    return () => {
      mounted = false;
    };
  }, [id]);

  const allowed = useMemo(() => {
    if (!app) return [];
    return getAllowedNextStatuses({ current: app.status, role: user?.role || 'Reviewer' });
  }, [app, user?.role]);

  useEffect(() => {
    if (!app) return;
    setToStatus(allowed[0] ?? '');
  }, [app, allowed]);

  const onUpdate = async () => {
    if (!app || !toStatus) return;
    try {
      setIsSaving(true);
      const updated = await applicationsService.updateStatus({
        id: app.id,
        toStatus,
        note: note.trim(),
        by: user?.name ?? 'Admin',
      });
      setApp(updated);
      setNote('');
    } catch (e) {
      setError(e?.message ?? 'Failed to update status');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) return <div className="card" style={{ padding: 14 }}>Loading…</div>;
  if (error) {
    return (
      <div className="card" style={{ padding: 14 }}>
        <div style={{ color: '#b91c1c', fontWeight: 800 }}>Error</div>
        <div className="muted" style={{ marginTop: 6 }}>{error}</div>
        <div style={{ marginTop: 12 }}>
          <button className="btn" onClick={() => navigate(-1)}>Back</button>
        </div>
      </div>
    );
  }
  if (!app) return null;

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <Link className="muted" to="/admin/applications">← Back to list</Link>
            <div style={{ marginTop: 6, display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
              <div style={{ fontWeight: 900, fontSize: 20 }}>{app.service}</div>
              <span className="muted">{app.refNo}</span>
              <StatusBadge status={app.status} />
            </div>
            <div className="muted" style={{ marginTop: 6 }}>
              Applicant: <strong style={{ color: 'var(--text)' }}>{app.applicantName}</strong> ({app.applicantEmail})
            </div>
          </div>
        </div>

        <div style={{ marginTop: 14 }}>
          <StageTimeline status={app.status} />
        </div>

        {app.remarks ? (
          <div className="card" style={{ padding: 12, marginTop: 12, boxShadow: 'none' }}>
            <div style={{ fontWeight: 800 }}>Latest remarks</div>
            <div className="muted" style={{ marginTop: 6 }}>{app.remarks}</div>
          </div>
        ) : null}
      </div>

      <div className="grid2">
        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontWeight: 900 }}>Update status</div>
          <div className="muted" style={{ marginTop: 4, fontSize: 12 }}>
            Allowed transitions are role-aware (prototype rules).
          </div>

          <div style={{ display: 'grid', gap: 10, marginTop: 12 }}>
            <label style={{ display: 'grid', gap: 6 }}>
              <span className="muted">Next status</span>
              <select
                className="input"
                value={toStatus}
                onChange={(e) => setToStatus(e.target.value)}
                disabled={allowed.length === 0}
              >
                {allowed.length === 0 ? (
                  <option value="">No actions available</option>
                ) : (
                  allowed.map((s) => (
                    <option key={s} value={s}>{toStatusLabel(s)}</option>
                  ))
                )}
              </select>
            </label>

            <label style={{ display: 'grid', gap: 6 }}>
              <span className="muted">Remarks (optional)</span>
              <textarea
                className="input"
                rows={4}
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add notes for the applicant / audit trail (e.g., missing barangay clearance)."
              />
            </label>

            <button className="btn btnPrimary" disabled={!toStatus || isSaving} onClick={onUpdate}>
              {isSaving ? 'Updating…' : 'Update status'}
            </button>
          </div>
        </div>

        <div className="card" style={{ padding: 14 }}>
          <div style={{ fontWeight: 900 }}>Status history</div>
          <div className="muted" style={{ marginTop: 4, fontSize: 12 }}>
            Audit trail of stage changes.
          </div>

          <div style={{ marginTop: 12, display: 'grid', gap: 10 }}>
            {(app.history || []).length === 0 ? (
              <div className="muted">No history yet.</div>
            ) : (
              [...app.history]
                .sort((a, b) => new Date(b.at).getTime() - new Date(a.at).getTime())
                .map((h, idx) => (
                  <div key={idx} className="card" style={{ padding: 12, boxShadow: 'none' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                      <div style={{ fontWeight: 800 }}>{toStatusLabel(h.to)}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{formatDate(h.at)}</div>
                    </div>
                    <div className="muted" style={{ marginTop: 4, fontSize: 12 }}>By: {h.by}</div>
                    {h.note ? <div style={{ marginTop: 6 }}>{h.note}</div> : null}
                  </div>
                ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}

function getAllowedNextStatuses({ current, role }) {
  // NOTE: Keep rules simple for MVP. Replace with backend-driven workflow later.
  // Roles: Encoder, Reviewer, Approver, Cashier, Releasing

  if (current === ApplicationStatus.DRAFT) {
    // Admin usually doesn't move drafts; citizen submits.
    return [];
  }
  if (current === ApplicationStatus.RELEASED || current === ApplicationStatus.REJECTED) {
    return [];
  }

  const r = String(role || '').toLowerCase();

  // Reviewer workflow
  if (r.includes('review')) {
    if (current === ApplicationStatus.SUBMITTED) return [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.FOR_COMPLIANCE];
    if (current === ApplicationStatus.UNDER_REVIEW) return [ApplicationStatus.FOR_COMPLIANCE, ApplicationStatus.FOR_PAYMENT, ApplicationStatus.FOR_APPROVAL, ApplicationStatus.REJECTED];
    if (current === ApplicationStatus.FOR_COMPLIANCE) return [ApplicationStatus.UNDER_REVIEW, ApplicationStatus.REJECTED];
    if (current === ApplicationStatus.FOR_PAYMENT) return [ApplicationStatus.FOR_APPROVAL];
    if (current === ApplicationStatus.FOR_APPROVAL) return []; // approver owns
    if (current === ApplicationStatus.APPROVED) return [ApplicationStatus.RELEASED];
  }

  // Approver workflow
  if (r.includes('approv')) {
    if (current === ApplicationStatus.FOR_APPROVAL) return [ApplicationStatus.APPROVED, ApplicationStatus.REJECTED];
    if (current === ApplicationStatus.UNDER_REVIEW) return [ApplicationStatus.FOR_APPROVAL, ApplicationStatus.REJECTED];
    if (current === ApplicationStatus.APPROVED) return [ApplicationStatus.RELEASED];
  }

  // Fallback (super admin)
  return [
    ApplicationStatus.SUBMITTED,
    ApplicationStatus.UNDER_REVIEW,
    ApplicationStatus.FOR_COMPLIANCE,
    ApplicationStatus.FOR_PAYMENT,
    ApplicationStatus.FOR_APPROVAL,
    ApplicationStatus.APPROVED,
    ApplicationStatus.RELEASED,
    ApplicationStatus.REJECTED,
  ].filter((s) => s !== current);
}
