import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { AppShell } from './components/layout/AppShell';
import { GenerationForm } from './components/mcq/GenerationForm';
import { ResultsPanel } from './components/mcq/ResultsPanel';
import { QaPanel } from './components/qa/QaPanel';
import { HistoryPanel } from './components/history/HistoryPanel';
import { StatusPanel } from './components/common/StatusPanel';
import { QuestionService } from './services/questionService';
import type { GenerateMcqResponse, GeneratedQuestion } from './types/domain';
import { useSessionHistory } from './hooks/useSessionHistory';

export default function App() {
  const [currentResult, setCurrentResult] = useState<GenerateMcqResponse | null>(null);
  const [selectedQuestion, setSelectedQuestion] = useState<GeneratedQuestion | null>(null);
  const { history, addSession, clearHistory } = useSessionHistory();

  const generationMutation = useMutation({
    mutationFn: QuestionService.generateMcqs,
    onSuccess: (result, variables) => {
      setCurrentResult(result);
      addSession(variables.input_text, result);
    }
  });

  return (
    <AppShell>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_420px]">
        <div className="space-y-6">
          <GenerationForm
            loading={generationMutation.isPending}
            onSubmit={(inputText, maxQuestions) => generationMutation.mutate({ input_text: inputText, max_questions: maxQuestions })}
          />

          {generationMutation.isPending ? (
            <StatusPanel
              type="loading"
              title="Generating MCQs"
              description="The request has been sent to the model adapter. Large passages may take longer depending on CPU/GPU availability."
            />
          ) : generationMutation.isError ? (
            <StatusPanel type="error" title="Generation failed" description={(generationMutation.error as Error).message} />
          ) : currentResult && currentResult.questions.length > 0 ? (
            <ResultsPanel result={currentResult} onUseForQa={setSelectedQuestion} />
          ) : currentResult && currentResult.questions.length === 0 ? (
            <StatusPanel
              type="empty"
              title="No questions returned"
              description="The backend returned an empty question list. Try a longer text with clearer noun phrases and educational context."
            />
          ) : (
            <StatusPanel
              type="empty"
              title="Ready for generation"
              description="Generated MCQs will appear here after the backend returns the inference result."
            />
          )}
        </div>

        <aside className="space-y-6">
          <QaPanel selectedQuestion={selectedQuestion} />
          <HistoryPanel history={history} onSelect={setCurrentResult} onClear={clearHistory} />
        </aside>
      </div>
    </AppShell>
  );
}
