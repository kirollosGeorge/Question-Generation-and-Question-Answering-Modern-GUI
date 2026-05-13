export const apiConfig = {
  baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000',
  generateMcqEndpoint: import.meta.env.VITE_GENERATE_MCQ_ENDPOINT || '/api/generate-mcq',
  answerQuestionEndpoint: import.meta.env.VITE_ANSWER_QUESTION_ENDPOINT || '/api/answer-question',
  useLocalDemo:
    import.meta.env.VITE_USE_LOCAL_DEMO === undefined
      ? true
      : import.meta.env.VITE_USE_LOCAL_DEMO === 'true',
  fallbackToLocalDemo:
    import.meta.env.VITE_FALLBACK_TO_LOCAL_DEMO === undefined
      ? true
      : import.meta.env.VITE_FALLBACK_TO_LOCAL_DEMO === 'true'
};
