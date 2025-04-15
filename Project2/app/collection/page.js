// app/collection/page.js
// Collection panel
import Link from 'next/link';

async function getCharacters() {
  const res = await fetch('http://localhost:4000/characters', {
    cache: 'no-store'
  });

  if (!res.ok) {
    throw new Error('Failed to fetch characters');
  }

  return res.json();
}

export default async function CollectionPage() {
  const characters = await getCharacters();

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Character Collection</h1>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        {characters.map((char) => (
          <div
            key={char.id}
            style={{
              border: '1px solid #ccc',
              borderRadius: '6px',
              padding: '1rem',
              backgroundColor: '#fdfdfd'
            }}
          >
            <p><strong>ID:</strong> {char.id}</p>
            <p><strong>Name:</strong> {char.character_name}</p>
            <Link href={`/collection/${char.id}`}>more</Link>
          </div>
        ))}
      </div>
    </div>
  );
}