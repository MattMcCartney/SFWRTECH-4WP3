// app/collection/[id]/not-found.js
// Handles case when requested character does not exist

export default function NotFound() {
  return (
    <div style={{ padding: '1rem' }}>
      <h1>Error</h1>
      <p>No item with that ID exists.</p>
      <a href="/collection">← Back to Collection</a>
    </div>
  );
}