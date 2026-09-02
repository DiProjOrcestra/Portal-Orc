import './EmpityState.css';

export default function EmptyState({ message }) {
  return (
    <div className="empty-state" role="status">
      <p>{message}</p>
    </div>
  );
}