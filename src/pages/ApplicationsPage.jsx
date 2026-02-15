import { useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { StatusBadge } from '../components/StatusBadge';
import { StatusGroups, ApplicationStatus, toStatusLabel } from '../constants/statuses';
import { useApplications } from '../features/applications/useApplications';

export default function ApplicationsPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const statusParam = searchParams.get('status') || 'ALL';
  const groupParam = searchParams.get('group') || 'ALL';
  const [q, setQ] = useState(searchParams.get('q') || '');

  const params = useMemo(
    () => ({ q: searchParams.get('q') || '', status: statusParam, group: groupParam }),
    [searchParams, statusParam, groupParam],
  );
  const { data, isLoading, error } = useApplications(params);

  const setFilter = (patch) => {
    const next = new URLSearchParams(searchParams);
    Object.entries(patch).forEach(([k, v]) => {
      if (!v || v === 'ALL') next.delete(k);
      else next.set(k, v);
    });
    setSearchParams(next, { replace: true });
  };

  return (
    <div style={{ display: 'grid', gap: 12 }}>
      <div className="card" style={{ padding: 14 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'end', gap: 12, flexWrap: 'wrap' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: 18 }}>Applications</div>
            <div className="muted">Search, filter, and process permit applications.</div>
          </div>
          <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
            <input
              className="input"
              style={{ width: 320 }}
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search by ref #, applicant, or service"
            />
            <button className="btn btnPrimary" onClick={() => setFilter({ q })}>
              Search
            </button>
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          {StatusGroups.map((g) => (
            <button
              key={g.key}
              className={groupParam === g.key ? 'btn btnPrimary' : 'btn'}
              onClick={() => setFilter({ group: g.key })}
            >
              {g.label}
            </button>
          ))}
          <select
            className="input"
            style={{ width: 220 }}
            value={statusParam}
            onChange={(e) => setFilter({ status: e.target.value })}
          >
            <option value="ALL">All stages</option>
            {Object.values(ApplicationStatus).map((s) => (
              <option key={s} value={s}>{toStatusLabel(s)}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: 'rgba(17,24,39,0.03)' }}>
              <tr>
                {['Ref #', 'Service', 'Applicant', 'Status', 'Updated', ''].map((h) => (
                  <th
                    key={h}
                    style={{ textAlign: 'left', padding: '12px 14px', fontSize: 12, color: 'var(--muted)', borderBottom: '1px solid var(--border)' }}
                  >
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ padding: 14 }}>Loading…</td></tr>
              ) : error ? (
                <tr><td colSpan={6} style={{ padding: 14, color: '#b91c1c' }}>{error}</td></tr>
              ) : data.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ padding: 18 }}>
                    <div style={{ fontWeight: 800 }}>No results</div>
                    <div className="muted" style={{ marginTop: 4 }}>Try a different filter or search keyword.</div>
                  </td>
                </tr>
              ) : (
                data.map((a) => (
                  <tr key={a.id}>
                    <td style={cellStyle}>{a.refNo}</td>
                    <td style={cellStyle}>{a.service}</td>
                    <td style={cellStyle}>
                      <div style={{ fontWeight: 700 }}>{a.applicantName}</div>
                      <div className="muted" style={{ fontSize: 12 }}>{a.applicantEmail}</div>
                    </td>
                    <td style={cellStyle}><StatusBadge status={a.status} /></td>
                    <td style={cellStyle} className="muted">{formatDate(a.updatedAt)}</td>
                    <td style={cellStyle}>
                      <Link className="btn" to={`/admin/applications/${a.id}`}>Open</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const cellStyle = {
  padding: '12px 14px',
  borderBottom: '1px solid var(--border)',
  verticalAlign: 'top',
};

function formatDate(iso) {
  try {
    return new Date(iso).toLocaleString();
  } catch {
    return iso;
  }
}
