// app/actions.js
// Server actions
'use server';

import { revalidatePath } from 'next/cache';

// Delete character function
export async function deleteCharacter(id) {
  await fetch(`http://localhost:4000/characters/${id}`, {
    method: 'DELETE'
  });

  revalidatePath('/admin');
  revalidatePath('/collection');
  revalidatePath(`/collection/${id}`);
}

// Create character function
export async function createCharacter(character) {
  await fetch(`http://localhost:4000/characters`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(character)
  });

  revalidatePath('/admin');
  revalidatePath('/collection');
}

// Update character function
export async function updateCharacter(id, character) {
  await fetch(`http://localhost:4000/characters/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(character)
  });

  revalidatePath('/admin');
  revalidatePath('/collection');
  revalidatePath(`/collection/${id}`);
  revalidatePath(`/admin/edit/${id}`);
}