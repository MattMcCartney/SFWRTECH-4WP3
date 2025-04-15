// app/admin/create/CreateForm.jsx
// Form used for character creation
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createCharacter } from '../../actions';
import { ALLOWED_CLASSES } from '../../../lib/constants';

export default function CreateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    id: '',
    character_name: '',
    character_class: '',
    character_level: ''
  });

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // NOTE: Assuming valid inputs and unique ID as per your instruction
    const payload = {
      id: parseInt(formData.id),
      character_name: formData.character_name,
      character_class: formData.character_class,
      character_level: parseInt(formData.character_level)
    };

    await createCharacter(payload);
    router.push('/admin');
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>ID:</label><br />
        <input
          type="number"
          name="id"
          value={formData.id}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Character Name:</label><br />
        <input
          type="text"
          name="character_name"
          value={formData.character_name}
          onChange={handleChange}
          required
        />
      </div>
      <div>
        <label>Class:</label><br />
        <select name="character_class" value={formData.character_class} onChange={handleChange} required>
          <option value="">-- Select Class --</option>
          {ALLOWED_CLASSES.map(cls => (
            <option key={cls} value={cls}>{cls}</option>
          ))}
        </select>
      </div>
      <div>
        <label>Level:</label><br />
        <input
          type="number"
          name="character_level"
          value={formData.character_level}
          onChange={handleChange}
          min={1}
          max={20}
          required
        />
      </div>
      <br />
      <button type="submit">Create</button>
    </form>
  );
}