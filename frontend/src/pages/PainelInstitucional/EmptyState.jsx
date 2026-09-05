import './EmptyState.css';

// FA-A1: shown instead of the content cards when MVV/Golden Circle has not
// been cadastrado yet.
export default function EmptyState({ message }) {
  return (
    <div className="empty-state" role="status">
      <p>{message}</p>
    </div>
  );
}
