import type {
  AnswerQuestionPayload,
  AnswerQuestionResponse,
  GenerateMcqPayload,
  GenerateMcqResponse
} from '../types/domain';
import { apiConfig } from './config';
import { postJson } from './http';
import { answerQuestionLocally, generateMcqsLocally } from './localDemoEngine';

async function withLocalFallback<T>(apiCall: () => Promise<T>, fallbackCall: () => Promise<T>): Promise<T> {
  if (apiConfig.useLocalDemo) return fallbackCall();

  try {
    return await apiCall();
  } catch (error) {
    if (apiConfig.fallbackToLocalDemo) return fallbackCall();
    throw error;
  }
}

export const QuestionService = {
  generateMcqs(payload: GenerateMcqPayload) {
    return withLocalFallback<GenerateMcqResponse>(
      () => postJson<GenerateMcqResponse, GenerateMcqPayload>(apiConfig.generateMcqEndpoint, payload),
      () => generateMcqsLocally(payload)
    );
  },

  answerQuestion(payload: AnswerQuestionPayload) {
    return withLocalFallback<AnswerQuestionResponse>(
      () => postJson<AnswerQuestionResponse, AnswerQuestionPayload>(apiConfig.answerQuestionEndpoint, payload),
      () => answerQuestionLocally(payload)
    );
  }
};
