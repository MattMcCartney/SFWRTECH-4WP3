// app/admin/edit/[id]/page.js
// Used for editing an item

import EditForm from './EditForm';
import { notFound } from 'next/navigation';

async function getCharacter(id) {
  const res = await fetch(`http://localhost:4000/characters/${id}`);
  if (!res.ok) return null;
  return res.json();
}

export default async function EditPage({ params }) {
  const character = await getCharacter(params.id);
  if (!character) return notFound();

  return (
    <div style={{ padding: '1rem' }}>
      <h2>Edit Character: {character.character_name}</h2>
      <EditForm character={character} />
    </div>
  );
}