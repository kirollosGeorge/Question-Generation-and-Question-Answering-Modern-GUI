export interface GenerateMcqPayload {
  input_text: string;
  max_questions?: number;
}

export interface GeneratedQuestion {
  id: number;
  question_statement: string;
  question_type: 'MCQ' | string;
  answer: string;
  options: string[];
  extra_options?: string[];
  options_algorithm?: string;
  context: string;
}

export interface GenerateMcqResponse {
  statement?: string;
  questions: GeneratedQuestion[];
  time_taken?: number;
  source?: 'api' | 'local-demo-engine' | string;
}

export interface AnswerQuestionPayload {
  input_text: string;
  input_question: string;
}

export interface AnswerQuestionResponse {
  answer: string;
  time_taken?: number;
  context?: string;
  question?: string;
  source?: 'api' | 'local-demo-engine' | string;
}

export interface SessionHistoryItem {
  id: string;
  createdAt: string;
  inputPreview: string;
  questionCount: number;
  result: GenerateMcqResponse;
}
