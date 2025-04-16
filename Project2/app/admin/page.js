// app/admin/page.js
// Admin panel
import Link from 'next/link';
import { deleteCharacter } from '../actions';

async function getCharacters() {
  const res = await fetch('http://localhost:4000/characters', {
    cache: 'no-store'
  });
  return res.json();
}

export default async function AdminPage() {
  const characters = await getCharacters();

  return (
    <div style={{ padding: '1rem' }}>
      <h1>Admin Panel</h1>

      <div style={{ marginBottom: '1rem' }}>
        <Link href="/admin/create">Create New</Link>
      </div>

      <table style={{
        width: '100%',
        borderCollapse: 'collapse',
        border: '1px solid #ccc'
      }}>
        <thead>
          <tr>
            <th style={thStyle}>ID</th>
            <th style={thStyle}>Name</th>
            <th style={thStyle}>Class</th>
            <th style={thStyle}>Level</th>
            <th style={thStyle}></th>
            <th style={thStyle}></th>
          </tr>
        </thead>
        <tbody>
          {characters.map((char) => (
            <tr key={char.id}>
              <td style={tdStyle}>{char.id}</td>
              <td style={tdStyle}>{char.character_name}</td>
              <td style={tdStyle}>{char.character_class}</td>
              <td style={tdStyle}>{char.character_level}</td>
              <td style={tdStyle}>
                <form
                  action={async () => {
                    'use server';
                    await deleteCharacter(char.id);
                  }}
                >
                  <button type="submit" style={buttonStyle}>D</button>
                </form>
              </td>
              <td style={tdStyle}>
                <Link href={`/admin/edit/${char.id}`} style={linkStyle}>E</Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  textAlign: 'left',
  padding: '8px',
  backgroundColor: '#f2f2f2',
  borderBottom: '1px solid #ccc'
};

const tdStyle = {
  padding: '8px',
  borderBottom: '1px solid #eee'
};

const buttonStyle = {
  backgroundColor: '#e74c3c',
  color: 'white',
  border: 'none',
  padding: '4px 8px',
  cursor: 'pointer'
};

const linkStyle = {
  color: '#3498db',
  textDecoration: 'none'
};