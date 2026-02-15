export const ApplicationStatus = Object.freeze({
  DRAFT: 'DRAFT',
  SUBMITTED: 'SUBMITTED',
  UNDER_REVIEW: 'UNDER_REVIEW',
  FOR_COMPLIANCE: 'FOR_COMPLIANCE',
  FOR_PAYMENT: 'FOR_PAYMENT',
  FOR_APPROVAL: 'FOR_APPROVAL',
  APPROVED: 'APPROVED',
  RELEASED: 'RELEASED',
  REJECTED: 'REJECTED',
});

export const StatusMeta = Object.freeze({
  [ApplicationStatus.DRAFT]: { label: 'Draft', group: 'Draft' },
  [ApplicationStatus.SUBMITTED]: { label: 'Submitted', group: 'In Process' },
  [ApplicationStatus.UNDER_REVIEW]: { label: 'Under Review', group: 'In Process' },
  [ApplicationStatus.FOR_COMPLIANCE]: { label: 'For Compliance', group: 'In Process' },
  [ApplicationStatus.FOR_PAYMENT]: { label: 'For Payment', group: 'In Process' },
  [ApplicationStatus.FOR_APPROVAL]: { label: 'For Approval', group: 'In Process' },
  [ApplicationStatus.APPROVED]: { label: 'Approved', group: 'In Process' },
  [ApplicationStatus.RELEASED]: { label: 'Released', group: 'Completed' },
  [ApplicationStatus.REJECTED]: { label: 'Rejected', group: 'Rejected' },
});

export function toStatusLabel(status) {
  return StatusMeta[status]?.label ?? status;
}

/**
 * Citizen-friendly top-level filters (matches your mobile design idea).
 */
export const StatusGroups = Object.freeze([
  { key: 'ALL', label: 'All' },
  { key: 'Draft', label: 'Draft' },
  { key: 'In Process', label: 'In Process' },
  { key: 'Completed', label: 'Completed' },
  { key: 'Rejected', label: 'Rejected' },
]);
