import type { GenerateMcqResponse, GeneratedQuestion } from '../types/domain';

function downloadFile(filename: string, content: string, type: string) {
  const blob = new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  URL.revokeObjectURL(url);
}

export function exportResultAsJson(result: GenerateMcqResponse) {
  downloadFile('generated-mcqs.json', JSON.stringify(result, null, 2), 'application/json');
}

function questionToMarkdown(question: GeneratedQuestion, index: number) {
  const options = [...question.options, question.answer]
    .filter(Boolean)
    .map((option, optionIndex) => `${String.fromCharCode(65 + optionIndex)}. ${option}`)
    .join('\n');

  return [
    `## Question ${index + 1}`,
    '',
    `**Context:** ${question.context}`,
    '',
    `**Question:** ${question.question_statement}`,
    '',
    options,
    '',
    `**Answer:** ${question.answer}`,
    question.options_algorithm ? `**Options Algorithm:** ${question.options_algorithm}` : ''
  ]
    .filter(Boolean)
    .join('\n');
}

export function exportResultAsMarkdown(result: GenerateMcqResponse) {
  const markdown = [
    '# Generated MCQs',
    result.statement ? `\n## Source Statement\n\n${result.statement}` : '',
    result.time_taken ? `\n**Time Taken:** ${result.time_taken.toFixed(2)} seconds` : '',
    '',
    ...result.questions.map(questionToMarkdown)
  ]
    .filter(Boolean)
    .join('\n\n');

  downloadFile('generated-mcqs.md', markdown, 'text/markdown');
}
