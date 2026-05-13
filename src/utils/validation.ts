export interface ValidationResult {
  valid: boolean;
  message?: string;
}

export function validatePassage(text: string): ValidationResult {
  const trimmed = text.trim();
  if (!trimmed) return { valid: false, message: 'Source passage is required.' };
  if (trimmed.length < 80) return { valid: false, message: 'Add a longer passage so the NLP model can extract useful context.' };
  return { valid: true };
}

export function validateMaxQuestions(value: number): ValidationResult {
  if (!Number.isFinite(value)) return { valid: false, message: 'Max questions must be a valid number.' };
  if (value < 1 || value > 30) return { valid: false, message: 'Max questions must be between 1 and 30.' };
  return { valid: true };
}

export function validateQuestion(text: string): ValidationResult {
  if (!text.trim()) return { valid: false, message: 'Question is required.' };
  return { valid: true };
}
