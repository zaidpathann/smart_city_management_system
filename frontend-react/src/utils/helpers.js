/**
 * Shared display helpers (badge classes, date formatting)
 */
export const formatDate = (d) =>
  new Date(d).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });

export const statusClass = (s) =>
  ({ Pending: 'badge-pending', 'In Progress': 'badge-progress', Assigned: 'badge-progress', Resolved: 'badge-resolved' }[s] || 'badge-pending');

export const priorityClass = (p) =>
  ({ Low: 'badge-low', Medium: 'badge-medium', High: 'badge-high', Emergency: 'badge-emergency' }[p] || 'badge-medium');

export const parkingStatusClass = (s) =>
  ({ Available: 'badge-available', Full: 'badge-full', Closed: 'badge-closed' }[s] || 'badge-closed');
