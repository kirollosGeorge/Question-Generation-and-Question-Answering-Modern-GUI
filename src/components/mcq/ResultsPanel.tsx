import { Download, FileJson, Timer } from 'lucide-react';
import type { GenerateMcqResponse, GeneratedQuestion } from '../../types/domain';
import { exportResultAsJson, exportResultAsMarkdown } from '../../utils/exporters';
import { Button } from '../common/Button';
import { Card } from '../common/Card';
import { QuestionCard } from './QuestionCard';

interface ResultsPanelProps {
  result: GenerateMcqResponse;
  onUseForQa: (question: GeneratedQuestion) => void;
}

export function ResultsPanel({ result, onUseForQa }: ResultsPanelProps) {
  return (
    <Card className="p-5 sm:p-6">
      <div className="mb-5 flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
        <div>
          <h2 className="text-lg font-black text-slate-950">Generated Questions</h2>
          <p className="mt-1 text-sm text-slate-600">
            {result.questions.length} question{result.questions.length === 1 ? '' : 's'} returned by the generation service.
          </p>
          {result.source ? (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-3 py-1 text-xs font-bold text-amber-800">
              Source: {result.source === 'local-demo-engine' ? 'Local demo engine' : result.source}
            </p>
          ) : null}
          {result.time_taken ? (
            <p className="mt-2 inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-bold text-slate-600">
              <Timer className="h-3.5 w-3.5" aria-hidden="true" /> {result.time_taken.toFixed(2)}s model runtime
            </p>
          ) : null}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="secondary" onClick={() => exportResultAsJson(result)} icon={<FileJson className="h-4 w-4" />}>
            Export JSON
          </Button>
          <Button variant="secondary" onClick={() => exportResultAsMarkdown(result)} icon={<Download className="h-4 w-4" />}>
            Export MD
          </Button>
        </div>
      </div>

      {result.statement ? (
        <div className="mb-5 rounded-2xl bg-blue-50 p-4 text-sm leading-6 text-blue-950">
          <strong>Processed statement:</strong> {result.statement}
        </div>
      ) : null}

      <div className="grid gap-4">
        {result.questions.map((question, index) => (
          <QuestionCard key={`${question.id}-${question.question_statement}`} question={question} index={index} onUseForQa={onUseForQa} />
        ))}
      </div>
    </Card>
  );
}
