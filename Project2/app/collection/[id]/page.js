// app/collection/[id]/page.js
// Returns character info
import Link from 'next/link';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
  const res = await fetch('http://localhost:4000/characters');
  if (!res.ok) return [];

  const characters = await res.json();
  return characters.slice(0, 10).map((char) => ({
    id: char.id.toString()
  }));
}

async function getCharacter(id) {
  const res = await fetch(`http://localhost:4000/characters/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function CharacterPage({ params }) {
  const character = await getCharacter(params.id);
  if (!character) return notFound();

  return (
    <div style={{ padding: '1rem' }}>
      <Link href="/collection">← Back</Link>
      <h2>{character.character_name}</h2>

      <table style={{
        marginTop: '1rem',
        borderCollapse: 'collapse',
        width: '100%'
      }}>
        <tbody>
          <tr>
            <td style={tdLabelStyle}>ID:</td>
            <td style={tdValueStyle}>{character.id}</td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>Name:</td>
            <td style={tdValueStyle}>{character.character_name}</td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>Class:</td>
            <td style={tdValueStyle}>{character.character_class}</td>
          </tr>
          <tr>
            <td style={tdLabelStyle}>Level:</td>
            <td style={tdValueStyle}>{character.character_level}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
}

const tdLabelStyle = {
  fontWeight: 'bold',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  border: '1px solid #ddd'
};

const tdValueStyle = {
  padding: '8px',
  border: '1px solid #ddd'
};