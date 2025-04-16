// app/admin/create/CreateForm.jsx
// Form used for character creation
'use client';

import { useState, useEffect  } from 'react';
import { useRouter } from 'next/navigation';
import { createCharacter } from '../../actions';
import { ALLOWED_CLASSES } from '../../../lib/constants';
import { validateCharacterInput } from '../../../lib/validation';

export default function CreateForm() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    character_name: '',
    character_class: '',
    character_level: ''
  });
  
  const [nextId, setNextId] = useState(null);
  const [errors, setErrors] = useState([]);

  useEffect(() => {
    async function fetchAndGenerateId() {
      const res = await fetch('http://localhost:4000/characters');
      const characters = await res.json();

      const usedIds = characters.map(c => c.id).filter(id => id <= 999);
      const availableIds = Array.from({ length: 999 }, (_, i) => i + 1).filter(
        id => !usedIds.includes(id)
      );

      if (availableIds.length === 0) {
        setError('No available IDs below 1000.');
      } else {
        setNextId(availableIds[0]);
      }
    }

    fetchAndGenerateId();
  }, []);

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

    const payload = {
      id: nextId,
      character_name: formData.character_name,
      character_class: formData.character_class,
      character_level: parseInt(formData.character_level)
    };

    await createCharacter(payload);
    router.push('/admin');
  };
  
  if (nextId === null) {
    return <p>Loading...</p>;
  }

  return (
	<>
	  {errors.length > 0 && (
		<ul style={{ color: 'red', marginBottom: '1rem' }}>
		  {errors.map((err, i) => (
			<li key={i}>{err}</li>
		  ))}
		</ul>
	  )}

	  <form onSubmit={handleSubmit}>
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
		  <select
			name="character_class"
			value={formData.character_class}
			onChange={handleChange}
			required
		  >
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
	</>
  );
}