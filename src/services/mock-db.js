import { ApplicationStatus } from '../constants/statuses';

const LS_KEY = 'epermit_admin_mockdb_v1';

function nowIso() {
  return new Date().toISOString();
}

function seed() {
  return {
    applications: [
      {
        id: 'app_000123',
        refNo: 'BP-2026-000123',
        service: 'Business Permit Renewal',
        applicantName: 'Juan Dela Cruz',
        applicantEmail: 'juan@example.com',
        status: ApplicationStatus.FOR_APPROVAL,
        createdAt: '2026-02-10T02:12:00.000Z',
        updatedAt: '2026-02-14T12:31:00.000Z',
        remarks: 'Waiting for final signatory approval.',
        history: [
          { at: '2026-02-10T02:12:00.000Z', by: 'Citizen', to: ApplicationStatus.SUBMITTED, note: 'Submitted application.' },
          { at: '2026-02-11T07:55:00.000Z', by: 'Encoder', to: ApplicationStatus.UNDER_REVIEW, note: 'Initial review started.' },
          { at: '2026-02-13T09:21:00.000Z', by: 'Reviewer', to: ApplicationStatus.FOR_APPROVAL, note: 'Recommended for approval.' },
        ],
      },
      {
        id: 'app_000045',
        refNo: 'OP-2026-000045',
        service: 'Occupational Permit',
        applicantName: 'Maria Santos',
        applicantEmail: 'maria@example.com',
        status: ApplicationStatus.FOR_COMPLIANCE,
        createdAt: '2026-02-09T05:30:00.000Z',
        updatedAt: '2026-02-14T10:05:00.000Z',
        remarks: 'Please upload the additional requirements.',
        history: [
          { at: '2026-02-09T05:30:00.000Z', by: 'Citizen', to: ApplicationStatus.SUBMITTED, note: 'Submitted application.' },
          { at: '2026-02-10T03:00:00.000Z', by: 'Encoder', to: ApplicationStatus.UNDER_REVIEW, note: 'Review started.' },
          { at: '2026-02-14T10:05:00.000Z', by: 'Reviewer', to: ApplicationStatus.FOR_COMPLIANCE, note: 'Missing barangay clearance.' },
        ],
      },
      {
        id: 'app_000777',
        refNo: 'EV-2026-000777',
        service: 'Special Event Permit',
        applicantName: 'Pedro Reyes',
        applicantEmail: 'pedro@example.com',
        status: ApplicationStatus.DRAFT,
        createdAt: '2026-02-14T04:00:00.000Z',
        updatedAt: '2026-02-14T04:00:00.000Z',
        remarks: '',
        history: [],
      },
    ],
    users: [
      { id: 'u_1', name: 'Admin Reviewer', email: 'reviewer@lgu.gov.ph', role: 'Reviewer' },
      { id: 'u_2', name: 'Admin Approver', email: 'approver@lgu.gov.ph', role: 'Approver' },
    ],
  };
}

function loadDb() {
  try {
    const raw = localStorage.getItem(LS_KEY);
    if (!raw) return seed();
    return JSON.parse(raw);
  } catch {
    return seed();
  }
}

function saveDb(db) {
  localStorage.setItem(LS_KEY, JSON.stringify(db));
}

export function mockListApplications({ q = '', group = 'ALL', status = 'ALL' } = {}) {
  const db = loadDb();
  const query = q.trim().toLowerCase();
  let items = [...db.applications];

  if (query) {
    items = items.filter((a) =>
      a.refNo.toLowerCase().includes(query) ||
      a.service.toLowerCase().includes(query) ||
      a.applicantName.toLowerCase().includes(query),
    );
  }

  if (group && group !== 'ALL') {
    items = items.filter((a) => {
      if (group === 'Draft') return a.status === ApplicationStatus.DRAFT;
      if (group === 'Completed') return a.status === ApplicationStatus.RELEASED;
      if (group === 'Rejected') return a.status === ApplicationStatus.REJECTED;
      if (group === 'In Process') {
        return ![ApplicationStatus.DRAFT, ApplicationStatus.RELEASED, ApplicationStatus.REJECTED].includes(a.status);
      }
      return true;
    });
  }

  if (status && status !== 'ALL') {
    items = items.filter((a) => a.status === status);
  }

  items.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime());
  return Promise.resolve(items);
}

export function mockGetApplication(id) {
  const db = loadDb();
  const item = db.applications.find((a) => a.id === id);
  if (!item) return Promise.reject(new Error('Application not found'));
  return Promise.resolve(item);
}

export function mockUpdateApplicationStatus({ id, toStatus, by, note }) {
  const db = loadDb();
  const idx = db.applications.findIndex((a) => a.id === id);
  if (idx < 0) return Promise.reject(new Error('Application not found'));

  const current = db.applications[idx];
  const updated = {
    ...current,
    status: toStatus,
    updatedAt: nowIso(),
    remarks: note ?? current.remarks,
    history: [...(current.history || []), { at: nowIso(), by, to: toStatus, note: note ?? '' }],
  };
  db.applications[idx] = updated;
  saveDb(db);
  return Promise.resolve(updated);
}

export function mockListUsers() {
  const db = loadDb();
  return Promise.resolve(db.users);
}
