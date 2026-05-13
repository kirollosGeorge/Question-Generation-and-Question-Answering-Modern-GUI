# QGQA Modern GUI

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Build](https://img.shields.io/badge/build-passing-brightgreen.svg)
![Stars](https://img.shields.io/github/stars/your-org/qgqa-modern-gui?style=social)

A modern, responsive, production-ready frontend for a **Question Generation / Question Answering** NLP workflow.

The application allows users to generate **MCQ questions** from English passages, review generated answers and distractors, run a **Question Answering** workflow, and export results as JSON or Markdown.

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Screenshots](#screenshots)
- [Tech Stack](#tech-stack)
- [Quick Start](#quick-start)
- [Environment Variables](#environment-variables)
- [API / Config Notes](#api--config-notes)
- [Project Structure](#project-structure)
- [Available Scripts](#available-scripts)
- [Troubleshooting](#troubleshooting)
- [Roadmap](#roadmap)
- [Contributing](#contributing)
- [Security](#security)
- [License](#license)

---

## Overview

**QGQA Modern GUI** is a clean frontend implementation for the original notebook-based **Question Generation / Question Answering** project.

The original project uses Python NLP / ML tooling such as:

- `transformers`
- `torch`
- `spaCy`
- `NLTK`
- `PKE`
- `Sense2Vec`
- `FlashText`

This repository focuses only on the frontend layer. It does not include backend code, model files, notebooks, or heavy ML assets.

Because the original source project does not expose API routes, this frontend includes a clear service layer and documented API contracts that can be connected to a Python adapter using FastAPI, Flask, Django, or any compatible backend framework.

The project runs in **Local Demo Mode** by default so the UI can be tested immediately without a backend. Demo mode is clearly labeled and should not be considered a replacement for the original ML inference pipeline.

---

## Features

- Generate MCQ questions from English source passages.
- Review generated question statements, answers, options, and context.
- Reveal correct answers only when needed.
- Send generated questions into the Question Answering panel.
- Manually submit context/question pairs for QA.
- Export generated results as JSON.
- Export generated results as Markdown.
- Store local session history in browser `localStorage`.
- Responsive layout for desktop, tablet, and mobile.
- Loading, error, and empty states.
- Typed API service layer.
- Configurable API endpoints through environment variables.
- Local demo engine enabled by default for first-run usability.

---

## Screenshots

> Add screenshots in this section after deploying or capturing the interface.

```text
docs/screenshots/dashboard.png
<img width="1168" height="941" alt="image" src="https://github.com/user-attachments/assets/ff538615-12ec-4789-a013-70fc7d0b6bcb" />

docs/screenshots/generated-questions.png
<img width="390" height="915" alt="image" src="https://github.com/user-attachments/assets/56796c50-3b1f-446a-90b2-e64a302b6026" />

docs/screenshots/question-answering.png
<img width="389" height="732" alt="image" src="https://github.com/user-attachments/assets/d7965940-2891-47cd-a948-61f9010ec283" />

```



---

## Tech Stack

- **React 18**
- **Vite**
- **TypeScript**
- **Tailwind CSS**
- **TanStack React Query**
- **Lucide React Icons**

---

## Quick Start

Clone the repository:

```bash
git clone https://github.com/your-org/qgqa-modern-gui.git
cd qgqa-modern-gui
```

Install dependencies:

```bash
npm install
```

Create the environment file:

```bash
cp .env.example .env
```

Run the development server:

```bash
npm run dev
```

Open the local app:

```bash
http://localhost:5173
```

Build for production:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

---

## Environment Variables

Default `.env.example`:

```env
VITE_USE_LOCAL_DEMO=true
VITE_FALLBACK_TO_LOCAL_DEMO=true

VITE_API_BASE_URL=http://localhost:8000
VITE_GENERATE_MCQ_ENDPOINT=/api/generate-mcq
VITE_ANSWER_QUESTION_ENDPOINT=/api/answer-question
```

### Variables

| Variable | Description | Default |
|---|---|---|
| `VITE_USE_LOCAL_DEMO` | Runs the browser-side demo engine instead of calling the backend API. | `true` |
| `VITE_FALLBACK_TO_LOCAL_DEMO` | Falls back to local demo mode if the backend request fails. | `true` |
| `VITE_API_BASE_URL` | Base URL for the Python API adapter. | `http://localhost:8000` |
| `VITE_GENERATE_MCQ_ENDPOINT` | Endpoint used for MCQ generation. | `/api/generate-mcq` |
| `VITE_ANSWER_QUESTION_ENDPOINT` | Endpoint used for Question Answering. | `/api/answer-question` |

---

## API / Config Notes

### Local Demo Mode

The project runs locally without a backend when:

```env
VITE_USE_LOCAL_DEMO=true
```

This mode is useful for:

- Testing layout and UX.
- Reviewing frontend workflows.
- Running the project without Python model setup.
- Avoiding first-run API connection errors.

It is not the original ML inference engine.

### Real Backend Mode

To connect to a real Python API adapter:

```env
VITE_USE_LOCAL_DEMO=false
VITE_FALLBACK_TO_LOCAL_DEMO=false
VITE_API_BASE_URL=http://localhost:8000
VITE_GENERATE_MCQ_ENDPOINT=/api/generate-mcq
VITE_ANSWER_QUESTION_ENDPOINT=/api/answer-question
```

The backend must enable CORS for the frontend origin, usually:

```text
http://localhost:5173
```

### Generate MCQs Endpoint

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
  "statement": "Processed passage...",
  "questions": [
    {
      "id": 1,
      "question_statement": "What best completes the statement?",
      "question_type": "MCQ",
      "answer": "Correct Answer",
      "options": ["Option A", "Option B", "Option C", "Correct Answer"],
      "extra_options": ["Optional Extra"],
      "options_algorithm": "sense2vec",
      "context": "Supporting context sentence."
    }
  ],
  "time_taken": 2.41,
  "source": "python-api"
}
```

### Question Answering Endpoint

```http
POST /api/answer-question
Content-Type: application/json
```

Request:

```json
{
  "input_text": "Supporting context...",
  "input_question": "What is being described?"
}
```

Response:

```json
{
  "answer": "Generated answer",
  "time_taken": 0.82,
  "context": "Supporting context...",
  "question": "What is being described?"
}
```

---

## Project Structure

```text
qgqa-modern-gui/
├── MODEL_ANALYSIS.md
├── README.md
├── package.json
├── .env.example
├── index.html
├── src/
│   ├── App.tsx
│   ├── main.tsx
│   ├── components/
│   │   ├── common/
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Field.tsx
│   │   │   └── StatusPanel.tsx
│   │   ├── history/
│   │   │   └── HistoryPanel.tsx
│   │   ├── layout/
│   │   │   └── AppShell.tsx
│   │   ├── mcq/
│   │   │   ├── GenerationForm.tsx
│   │   │   ├── QuestionCard.tsx
│   │   │   └── ResultsPanel.tsx
│   │   └── qa/
│   │       └── QaPanel.tsx
│   ├── hooks/
│   │   └── useSessionHistory.ts
│   ├── services/
│   │   ├── config.ts
│   │   ├── http.ts
│   │   ├── localDemoEngine.ts
│   │   └── questionService.ts
│   ├── styles/
│   │   └── index.css
│   ├── types/
│   │   └── domain.ts
│   └── utils/
│       ├── exporters.ts
│       └── validation.ts
├── tailwind.config.js
├── postcss.config.js
├── tsconfig.json
└── vite.config.ts
```

---

## Available Scripts

Run development server:

```bash
npm run dev
```

Build the app:

```bash
npm run build
```

Preview production build:

```bash
npm run preview
```

Run lint script:

```bash
npm run lint
```

---

## Troubleshooting

### `Generation failed: Unable to reach the API`

This means the frontend tried to call the backend API but could not reach it.

Check the following:

1. Make sure the Python adapter is running.
2. Confirm the API base URL in `.env`:

```env
VITE_API_BASE_URL=http://localhost:8000
```

3. Confirm the endpoints exist:

```http
POST /api/generate-mcq
POST /api/answer-question
```

4. Enable CORS in the backend for:

```text
http://localhost:5173
```

5. If you only want to test the GUI without a backend, enable demo mode:

```env
VITE_USE_LOCAL_DEMO=true
VITE_FALLBACK_TO_LOCAL_DEMO=true
```

---

### The app runs but results say `Local demo engine`

This is expected when demo mode is enabled.

To use real ML inference, set:

```env
VITE_USE_LOCAL_DEMO=false
```

and run a compatible Python backend adapter.

---

### Build fails after editing environment variables

Restart the Vite dev server after changing `.env`:

```bash
npm run dev
```

Vite reads environment variables at startup.

---

### No questions are generated

Possible reasons:

- The passage is too short.
- The text does not contain enough meaningful noun phrases or keywords.
- The backend returned an empty `questions` array.
- In demo mode, the local engine could not extract enough usable terms.

Try a longer educational passage with clear concepts, definitions, and factual sentences.

---

## Roadmap

- Add official FastAPI adapter example.
- Add backend health-check indicator.
- Add copy-to-clipboard for individual questions.
- Add import/export session history.
- Add automated tests for service contracts and validation utilities.
- Add GitHub Actions workflow for build validation.

---

## Contributing

Contributions are welcome.

Recommended workflow:

```bash
git checkout -b feature/your-feature-name
npm install
npm run build
```

Before opening a Pull Request:

- Keep TypeScript types explicit.
- Preserve the existing data contracts.
- Avoid adding unnecessary dependencies.
- Do not include backend code or model files.
- Ensure new UI features include loading, error, and empty states.
- Keep accessibility and responsive behavior in mind.

---

## Security

Do not commit:

- `.env`
- API secrets
- private model files
- large ML artifacts
- user-generated datasets
- notebook outputs containing sensitive data

Use `.env.example` for public configuration documentation.

---

## License

This project is licensed under the **MIT License**.
