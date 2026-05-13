import type {
  AnswerQuestionPayload,
  AnswerQuestionResponse,
  GenerateMcqPayload,
  GenerateMcqResponse,
  GeneratedQuestion
} from '../types/domain';

const STOP_WORDS = new Set([
  'the', 'a', 'an', 'and', 'or', 'but', 'if', 'then', 'than', 'that', 'this', 'these', 'those', 'with', 'from',
  'into', 'onto', 'over', 'under', 'about', 'between', 'through', 'during', 'before', 'after', 'above', 'below',
  'is', 'are', 'was', 'were', 'be', 'been', 'being', 'to', 'of', 'in', 'on', 'for', 'by', 'as', 'at', 'it', 'its',
  'their', 'there', 'they', 'them', 'he', 'she', 'we', 'you', 'your', 'our', 'his', 'her', 'not', 'can', 'will',
  'may', 'also', 'such', 'more', 'most', 'other', 'which', 'who', 'when', 'where', 'why', 'how'
]);

function splitSentences(text: string): string[] {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+/)
    .map((sentence) => sentence.trim())
    .filter((sentence) => sentence.length > 40);
}

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 3 && !STOP_WORDS.has(word));
}

function titleCase(value: string): string {
  return value.replace(/\b\w/g, (char) => char.toUpperCase());
}

function getKeywords(text: string): string[] {
  const frequency = new Map<string, number>();
  tokenize(text).forEach((word) => frequency.set(word, (frequency.get(word) || 0) + 1));

  return [...frequency.entries()]
    .sort((a, b) => b[1] - a[1] || b[0].length - a[0].length)
    .map(([word]) => word)
    .slice(0, 40);
}

function createDistractors(answer: string, keywords: string[]): string[] {
  const normalizedAnswer = answer.toLowerCase();
  const candidates = keywords
    .filter((keyword) => keyword !== normalizedAnswer)
    .filter((keyword) => Math.abs(keyword.length - normalizedAnswer.length) <= 8)
    .slice(0, 8);

  const fallback = keywords.filter((keyword) => keyword !== normalizedAnswer).slice(0, 8);
  return [...new Set([...candidates, ...fallback])].slice(0, 3).map(titleCase);
}

function blankAnswer(sentence: string, answer: string): string {
  const pattern = new RegExp(`\\b${answer.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i');
  return sentence.replace(pattern, '________');
}

export async function generateMcqsLocally(payload: GenerateMcqPayload): Promise<GenerateMcqResponse> {
  const startedAt = performance.now();
  const sentences = splitSentences(payload.input_text);
  const keywords = getKeywords(payload.input_text);
  const maxQuestions = Math.min(payload.max_questions || 15, 30);
  const usedAnswers = new Set<string>();

  const questions: GeneratedQuestion[] = [];

  for (const sentence of sentences) {
    const sentenceKeywords = getKeywords(sentence).filter((keyword) => keywords.includes(keyword));
    const answer = sentenceKeywords.find((keyword) => !usedAnswers.has(keyword));
    if (!answer) continue;

    const distractors = createDistractors(answer, keywords);
    if (distractors.length < 3) continue;

    usedAnswers.add(answer);
    const options = [...distractors, titleCase(answer)].sort(() => Math.random() - 0.5);

    questions.push({
      id: questions.length + 1,
      question_statement: `What best completes the statement: "${blankAnswer(sentence, answer)}"?`,
      question_type: 'MCQ',
      answer: titleCase(answer),
      options,
      extra_options: distractors,
      options_algorithm: 'browser-local-demo-keyword-extraction',
      context: sentence
    });

    if (questions.length >= maxQuestions) break;
  }

  return {
    statement: 'Generated using the browser-side local demo engine. Connect the Python API adapter for original ML inference.',
    questions,
    time_taken: (performance.now() - startedAt) / 1000,
    source: 'local-demo-engine'
  };
}

export async function answerQuestionLocally(payload: AnswerQuestionPayload): Promise<AnswerQuestionResponse> {
  const startedAt = performance.now();
  const questionTokens = new Set(tokenize(payload.input_question));
  const sentences = splitSentences(payload.input_text);

  const ranked = sentences
    .map((sentence) => {
      const sentenceTokens = tokenize(sentence);
      const score = sentenceTokens.filter((token) => questionTokens.has(token)).length;
      return { sentence, score };
    })
    .sort((a, b) => b.score - a.score);

  const best = ranked[0]?.score > 0 ? ranked[0].sentence : 'No confident answer was found in the provided context.';

  return {
    answer: best,
    context: ranked[0]?.sentence,
    question: payload.input_question,
    time_taken: (performance.now() - startedAt) / 1000,
    source: 'local-demo-engine'
  };
}
