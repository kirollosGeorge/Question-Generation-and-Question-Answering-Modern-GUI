import { useState } from 'react';
import { CheckCircle2, Copy, Eye, EyeOff, HelpCircle, MessageSquareText } from 'lucide-react';
import type { GeneratedQuestion } from '../../types/domain';
import { Button } from '../common/Button';

interface QuestionCardProps {
  question: GeneratedQuestion;
  index: number;
  onUseForQa: (question: GeneratedQuestion) => void;
}

export function QuestionCard({ question, index, onUseForQa }: QuestionCardProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const allOptions = [...question.options, question.answer].filter(Boolean);

  const copyQuestion = async () => {
    const content = [
      `Question ${index + 1}: ${question.question_statement}`,
      ...allOptions.map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`),
      `Answer: ${question.answer}`,
      `Context: ${question.context}`
    ].join('\n');
    await navigator.clipboard.writeText(content);
  };

  return (
    <article className="rounded-3xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-soft">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex items-start gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-blue-50 text-sm font-black text-blue-700">
            {index + 1}
          </div>
          <div>
            <div className="mb-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-bold text-slate-600">{question.question_type}</span>
              {question.options_algorithm ? (
                <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-bold text-emerald-700">
                  {question.options_algorithm}
                </span>
              ) : null}
            </div>
            <h3 className="text-base font-black leading-7 text-slate-950">{question.question_statement}</h3>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" onClick={copyQuestion} aria-label="Copy question" icon={<Copy className="h-4 w-4" />} />
          <Button
            variant="secondary"
            onClick={() => onUseForQa(question)}
            icon={<MessageSquareText className="h-4 w-4" aria-hidden="true" />}
          >
            Ask QA
          </Button>
        </div>
      </div>

      <div className="space-y-2">
        {allOptions.map((option, optionIndex) => {
          const isAnswer = option === question.answer;
          return (
            <div
              key={`${option}-${optionIndex}`}
              className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                showAnswer && isAnswer
                  ? 'border-emerald-200 bg-emerald-50 text-emerald-900'
                  : 'border-slate-200 bg-slate-50 text-slate-700'
              }`}
            >
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-white text-xs font-black text-slate-700">
                {String.fromCharCode(65 + optionIndex)}
              </span>
              <span className="flex-1">{option}</span>
              {showAnswer && isAnswer ? <CheckCircle2 className="h-5 w-5 text-emerald-600" aria-hidden="true" /> : null}
            </div>
          );
        })}
      </div>

      <div className="mt-4 rounded-2xl bg-slate-50 p-4">
        <div className="mb-2 flex items-center gap-2 text-xs font-black uppercase tracking-[0.18em] text-slate-500">
          <HelpCircle className="h-4 w-4" aria-hidden="true" /> Context
        </div>
        <p className="text-sm leading-6 text-slate-700">{question.context}</p>
      </div>

      {question.extra_options?.length ? (
        <div className="mt-3 text-xs leading-5 text-slate-500">Extra options: {question.extra_options.join(', ')}</div>
      ) : null}

      <div className="mt-4 flex justify-end">
        <Button
          variant="ghost"
          onClick={() => setShowAnswer((value) => !value)}
          icon={showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        >
          {showAnswer ? 'Hide Answer' : 'Reveal Answer'}
        </Button>
      </div>
    </article>
  );
}
