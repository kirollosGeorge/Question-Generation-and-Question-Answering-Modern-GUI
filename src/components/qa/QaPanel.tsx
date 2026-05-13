import { useEffect, useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { SendHorizonal } from 'lucide-react';
import type { GeneratedQuestion } from '../../types/domain';
import { QuestionService } from '../../services/questionService';
import { validatePassage, validateQuestion } from '../../utils/validation';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { Field } from '../common/Field';
import { StatusPanel } from '../common/StatusPanel';

interface QaPanelProps {
  selectedQuestion?: GeneratedQuestion | null;
}

export function QaPanel({ selectedQuestion }: QaPanelProps) {
  const [context, setContext] = useState('');
  const [question, setQuestion] = useState('');
  const [errors, setErrors] = useState<{ context?: string; question?: string }>({});

  useEffect(() => {
    if (selectedQuestion) {
      setContext(selectedQuestion.context);
      setQuestion(selectedQuestion.question_statement);
      setErrors({});
    }
  }, [selectedQuestion]);

  const answerMutation = useMutation({
    mutationFn: QuestionService.answerQuestion
  });

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const contextValidation = validatePassage(context);
    const questionValidation = validateQuestion(question);

    if (!contextValidation.valid || !questionValidation.valid) {
      setErrors({ context: contextValidation.message, question: questionValidation.message });
      return;
    }

    setErrors({});
    answerMutation.mutate({ input_text: context, input_question: question });
  };

  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5">
        <h2 className="text-lg font-black text-slate-950">Question Answering</h2>
        <p className="mt-1 text-sm leading-6 text-slate-600">
          Use a generated question or manually enter a context and question for the QA model.
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <Field label="Context" error={errors.context}>
          <textarea
            className="focus-ring min-h-[140px] w-full resize-y rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm leading-6 text-slate-900"
            value={context}
            onChange={(event) => setContext(event.target.value)}
            placeholder="Supporting sentence or paragraph..."
          />
        </Field>

        <Field label="Question" error={errors.question}>
          <input
            className="focus-ring w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-900"
            value={question}
            onChange={(event) => setQuestion(event.target.value)}
            placeholder="Enter the question to answer..."
          />
        </Field>

        <Button disabled={answerMutation.isPending} icon={<SendHorizonal className="h-4 w-4" aria-hidden="true" />}>
          {answerMutation.isPending ? 'Answering...' : 'Get Answer'}
        </Button>
      </form>

      <div className="mt-5">
        {answerMutation.isPending ? (
          <StatusPanel type="loading" title="Running QA inference" description="The frontend is waiting for the backend model response." />
        ) : answerMutation.isError ? (
          <StatusPanel type="error" title="Question answering failed" description={(answerMutation.error as Error).message} />
        ) : answerMutation.data ? (
          <div className="rounded-3xl border border-emerald-200 bg-emerald-50 p-5">
            <p className="text-xs font-black uppercase tracking-[0.18em] text-emerald-700">Generated Answer</p>
            <h3 className="mt-2 text-xl font-black text-emerald-950">{answerMutation.data.answer}</h3>
            {answerMutation.data.time_taken ? (
              <p className="mt-2 text-sm font-medium text-emerald-800">
                Runtime: {answerMutation.data.time_taken.toFixed(2)} seconds
              </p>
            ) : null}
          </div>
        ) : (
          <StatusPanel type="empty" title="No answer yet" description="Submit a context and question to display the generated answer here." />
        )}
      </div>
    </Card>
  );
}
