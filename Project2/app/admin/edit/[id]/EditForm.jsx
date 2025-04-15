// app/admin/edit/[id]/EditForm.jsx
// Form used for character modification
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { updateCharacter } from '../../../actions';
import { ALLOWED_CLASSES } from '../../../../lib/constants';
import { validateCharacterInput } from '../../../../lib/validation';

export default function EditForm({ character }) {
  const router = useRouter();
  const [formData, setFormData] = useState({
    character_name: character.character_name,
    character_class: character.character_class,
    character_level: character.character_level.toString()
  });

  const [errors, setErrors] = useState([]);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const errs = validateCharacterInput(formData);
    if (errs.length > 0) {
      setErrors(errs);
      return;
    }

    await updateCharacter(character.id, {
      id: character.id,
      character_name: formData.character_name,
      character_class: formData.character_class,
      character_level: parseInt(formData.character_level)
    });

    router.push('/admin');
  };

  return (
    <form onSubmit={handleSubmit}>
      {errors.length > 0 && (
        <ul style={{ color: 'red' }}>
          {errors.map((err, i) => (
            <li key={i}>{err}</li>
          ))}
        </ul>
      )}

      <div>
        <label>Character Name:</label><br />
        <input
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
          value={formData.level}
          onChange={handleChange}
          min={1}
          max={20}
          required
        />
      </div>

      <br />
      <button type="submit">Save Changes</button>
    </form>
  );
}