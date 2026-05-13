# Model Analysis

## 1. Source Project Summary

The uploaded project is a notebook-based NLP application named **Question Generation / Question Answering**. It performs two related workflows:

1. **MCQ Question Generation** from a supplied English text passage.
2. **Question Answering** using a generated or manually provided question and a supporting context.

The original code is implemented inside `Question Generation MCQ.ipynb` and uses Python NLP / ML libraries including `transformers`, `torch`, `spaCy`, `NLTK`, `PKE`, `Sense2Vec`, `FlashText`, and `python-Levenshtein`.

The new GUI project keeps the same concept and data flow while separating the frontend layer from the ML execution layer. Because the source project does not include a web server, API routes, or formal backend controllers, this frontend provides explicit service contracts that can be connected to the existing Python logic through any backend adapter such as FastAPI, Flask, Django, or a serverless API.

To avoid a broken first-run experience, the revised GUI includes a browser-side local demo engine enabled by default. This mode is clearly labeled as `local-demo-engine` and exists only to validate the GUI workflow without requiring a running Python API. Exact ML behavior still requires connecting the original notebook logic through the documented API contracts.

## 2. Chosen Frontend Stack

**React + Vite + TypeScript + Tailwind CSS + TanStack React Query** was selected as the target stack.

### Justification

- **React + Vite** provides a lightweight, fast, production-ready frontend setup.
- **TypeScript** enforces strict typing around the extracted data contracts.
- **Tailwind CSS** supports responsive, consistent, accessible UI implementation without heavy UI dependencies.
- **TanStack React Query** cleanly separates server-state workflows such as MCQ generation and question answering from component rendering.
- The architecture remains easy to integrate with a Python backend without forcing backend changes.

## 3. Core Entities

### 3.1 Generation Payload

Represents the input sent to the MCQ generation workflow.

| Field | Type | Required | Default | Source Logic |
|---|---:|---:|---:|---|
| `input_text` | `string` | Yes | N/A | Passed as the passage used for sentence tokenization, keyword extraction, and model generation. |
| `max_questions` | `number` | No | `15` | Used to limit generated keyword/question count. |

### 3.2 Generated MCQ Question

Represents one generated multiple-choice question.

| Field | Type | Required | Description |
|---|---:|---:|---|
| `id` | `number` | Yes | Sequential generated question ID. |
| `question_statement` | `string` | Yes | T5-generated question text. |
| `question_type` | `'MCQ'` | Yes | Original code sets this to `MCQ`. |
| `answer` | `string` | Yes | Correct answer keyword or phrase. |
| `options` | `string[]` | Yes | First distractor options produced by Sense2Vec and filtered. |
| `extra_options` | `string[]` | No | Additional distractors after the first three. |
| `options_algorithm` | `string` | No | Original value can be `sense2vec` or `None`. |
| `context` | `string` | Yes | Supporting sentence snippet mapped to the answer keyword. |

### 3.3 Generation Result

Represents the full MCQ generation response.

| Field | Type | Required | Description |
|---|---:|---:|---|
| `statement` | `string` | No | Normalized / sentence-filtered input statement returned by the original workflow. |
| `questions` | `GeneratedQuestion[]` | Yes | Generated MCQ list. |
| `time_taken` | `number` | No | Generation runtime in seconds. |

### 3.4 Question Answering Payload

Represents the input sent to the QA workflow.

| Field | Type | Required | Description |
|---|---:|---:|---|
| `input_text` | `string` | Yes | Context passage used as answer source. |
| `input_question` | `string` | Yes | Question to answer. |

### 3.5 Question Answering Result

The notebook function currently computes an answer but does not return it in the reusable `predict_answer` function. The GUI expects the backend integration layer to return a normalized object.

| Field | Type | Required | Description |
|---|---:|---:|---|
| `answer` | `string` | Yes | Generated answer text. |
| `time_taken` | `number` | No | Runtime in seconds. |
| `context` | `string` | No | Context used for the answer. |
| `question` | `string` | No | Submitted question. |

## 4. Relationships

- A **Generation Result** contains many **Generated MCQ Questions**.
- Each **Generated MCQ Question** is linked to exactly one extracted **answer** and one supporting **context** snippet.
- A **QA Payload** can be created from any generated question by reusing its `context` and `question_statement`.
- `options` are distractors related to a question answer and must be displayed alongside the correct answer after randomization or controlled reveal.

## 5. Validation Rules

### 5.1 Text Input

- `input_text` is required.
- The text should be long enough to contain meaningful sentences.
- The original notebook removes sentences shorter than 20 characters during tokenization.
- The GUI enforces a minimum useful passage length before submitting.

### 5.2 Max Questions

- `max_questions` defaults to `15` in the original source.
- The GUI constrains it to a practical range of `1` to `30` to avoid accidental heavy inference requests.

### 5.3 QA Input

- `input_question` is required.
- `input_text` / context is required.
- Generated MCQs can prefill these fields.

## 6. Business Rules Preserved

1. MCQ generation starts from a source passage, not from isolated questions.
2. The generation service accepts `input_text` and optional `max_questions` exactly like the notebook payload.
3. Generated questions retain the original properties: `id`, `question_statement`, `question_type`, `answer`, `options`, `extra_options`, `options_algorithm`, and `context`.
4. Question answering uses the same conceptual input format: `question: ... <s> context: ... </s>` handled by backend ML logic.
5. The frontend either displays real API responses or, when `VITE_USE_LOCAL_DEMO=true`, displays clearly labeled browser-side demo results generated from the user's own input text. Demo mode is not presented as original ML inference.
6. The original Python logic remains backend-owned; the GUI only provides a clean presentation and integration layer.

## 7. CRUD / Operations Mapping

The original project is not a database CRUD application. Its operations are inference workflows.

| Operation | Original Source Equivalent | New GUI Equivalent |
|---|---|---|
| Create MCQ generation request | `predict_mcq(payload)` | Submit generation form via `QuestionService.generateMcqs()` |
| Read generated results | Printed notebook output | Render question cards, context, answers, options, metadata |
| Create QA request | QA inference cell using `input_text` + `input_question` | Submit QA panel via `QuestionService.answerQuestion()` |
| Read QA answer | Notebook print output | Render answer result panel |
| Export generated output | Manual notebook output copying | Download JSON or Markdown from current result |
| Session history | Not available | Local browser history for submitted frontend sessions only |

## 8. User Journeys

### 8.1 MCQ Generation Journey

1. User opens the dashboard.
2. User pastes an English passage into the passage input area.
3. User selects the maximum number of questions.
4. User submits the generation request.
5. UI displays loading state while inference runs.
6. UI displays generated question cards.
7. User can reveal answers, inspect context, copy/export results, or send one question to the QA panel.

### 8.2 Question Answering Journey

1. User enters or auto-fills a context.
2. User enters or auto-fills a question.
3. User submits the QA request.
4. UI displays loading/error/empty states.
5. UI displays the generated answer.

### 8.3 Review / Export Journey

1. User generates MCQs.
2. User reviews questions, options, answers, and context.
3. User exports current results as JSON or Markdown.
4. User may copy individual question cards.

## 9. API Integration Points

The frontend expects the following endpoints by default. They can be changed through `.env`.

### Generate MCQs

```http
POST /api/generate-mcq
Content-Type: application/json
```

Request:

```json
{
  "input_text": "Long source passage...",
  "max_questions": 15
}
```

Response:

```json
{
  "statement": "Normalized or processed source passage...",
  "questions": [
    {
      "id": 1,
      "question_statement": "What is ...?",
      "question_type": "MCQ",
      "answer": "Correct Answer",
      "options": ["Option A", "Option B", "Option C"],
      "extra_options": ["Optional Extra"],
      "options_algorithm": "sense2vec",
      "context": "Supporting context sentence."
    }
  ],
  "time_taken": 2.41
}
```

### Answer Question

```http
POST /api/answer-question
Content-Type: application/json
```

Request:

```json
{
  "input_text": "Supporting context...",
  "input_question": "Question?"
}
```

Response:

```json
{
  "answer": "Generated answer",
  "time_taken": 0.82,
  "context": "Supporting context...",
  "question": "Question?"
}
```

## 10. State Requirements

- Current passage text.
- Selected `max_questions`.
- Current generated result.
- Current QA context/question/answer.
- Loading states for generation and QA.
- Error states for failed API requests when backend mode is enabled. Standalone local demo mode prevents first-run API connection errors while keeping backend integration configurable.
- Local session history stored in `localStorage`.
- UI state for answer reveal, selected question, and export actions.

## 11. Limitations and Professional Equivalents

- The source project does not include backend routes. The GUI therefore includes typed service functions and endpoint contracts instead of backend code.
- The notebook uses local model folders such as `Parth/result`, `model-QA/`, and `s2v_old`; these are backend runtime dependencies and are documented as integration prerequisites.
- The notebook prints randomized answer options. The GUI displays options in a stable, review-friendly order and highlights the correct answer only when the user reveals it. This is a UX equivalent that does not alter the generated data.
