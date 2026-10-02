export function StatusBadge({ status }) {
  const styles = {
    pending:      'bg-yellow-100 text-yellow-800',
    approved:     'bg-green-100 text-green-800',
    rejected:     'bg-red-100 text-red-800',
    filed:        'bg-blue-100 text-blue-800',
    under_review: 'bg-purple-100 text-purple-800',
  };
  const label = status?.replace('_', ' ');
  return (
    <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-semibold capitalize ${styles[status] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
}
