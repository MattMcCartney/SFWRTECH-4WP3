// lib/validation.js
// Used to validate item fields

import { ALLOWED_CLASSES } from './constants';

export function validateCharacterInput(formData) {
  const errors = [];

  if (!formData.character_name || formData.character_name.length > 24) {
    errors.push('Character name must be 1–24 characters.');
  }

  if (!ALLOWED_CLASSES.includes(formData.class)) {
    errors.push('Class must be a valid D&D class.');
  }

  const level = parseInt(formData.level);
  if (!Number.isInteger(level) || level < 1 || level > 20) {
    errors.push('Level must be an integer between 1 and 20.');
  }

  return errors;
}