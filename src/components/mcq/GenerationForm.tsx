import { useState } from 'react';
import { Wand2 } from 'lucide-react';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Field } from '../common/Field';
import { validateMaxQuestions, validatePassage } from '../../utils/validation';

interface GenerationFormProps {
  loading: boolean;
  onSubmit: (inputText: string, maxQuestions: number) => void;
}

export function GenerationForm({ loading, onSubmit }: GenerationFormProps) {
  const [inputText, setInputText] = useState('');
  const [maxQuestions, setMaxQuestions] = useState(15);
  const [errors, setErrors] = useState<{ inputText?: string; maxQuestions?: string }>({});

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const passageValidation = validatePassage(inputText);
    const maxValidation = validateMaxQuestions(maxQuestions);

    if (!passageValidation.valid || !maxValidation.valid) {
      setErrors({ inputText: passageValidation.message, maxQuestions: maxValidation.message });
      return;
    }

    setErrors({});
    onSubmit(inputText, maxQuestions);
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-black text-slate-950">Generate MCQs</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Paste the source passage used by the original keyword extraction and T5 generation workflow.
        </p>
      </div>
      <form className="space-y-5" onSubmit={handleSubmit}>
        <Field label="Source Passage" hint={`${inputText.trim().length} characters`} error={errors.inputText}>
          <textarea
            className="focus-ring min-h-[260px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900 placeholder:text-slate-400"
            placeholder="Paste the English educational text or article content here..."
            value={inputText}
            onChange={(event) => setInputText(event.target.value)}
          />
        </Field>

        <Field label="Maximum Questions" hint="Original default: 15" error={errors.maxQuestions}>
          <input
            className="focus-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            type="number"
            min={1}
            max={30}
            value={maxQuestions}
            onChange={(event) => setMaxQuestions(Number(event.target.value))}
          />
        </Field>

        <Button type="submit" disabled={loading} icon={<Wand2 className="h-4 w-4" aria-hidden="true" />} className="w-full sm:w-auto">
          {loading ? 'Generating...' : 'Generate Questions'}
        </Button>
      </form>
    </Card>
  );
}
