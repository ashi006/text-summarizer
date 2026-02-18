# Project Checklist: Text Summarizer & Translator

This checklist tracks the progress and time spent on the Text Summarizer & Translator project.

## Phase 1: Project Setup & Foundation
**Estimated Time:** 30 min | **Actual Time:** 15 min
- [x] 1.1 — Create project folders (`frontend/`, `backend/`)
- [x] 1.2 — Scaffold frontend (Vite + React + TS, axios)
- [x] 1.3 — Scaffold backend (FastAPI, requirements.txt, main.py, .env.example)
- [x] 1.4 — Wire up CORS + proxy
- [x] 1.5 — Health check endpoint (`GET /health`)
- [x] 1.6 — Verify Phase 1 (Start both servers, check health)

## Phase 2: Core Summarization
**Estimated Time:** 75 min | **Actual Time:** 35 min
- [x] 2.1 — Create prompt templates (`backend/app/prompts.py`)
- [x] 2.2 — Build OpenAI service (`backend/app/services/openai_service.py`)
- [x] 2.3 — Add summarize endpoint (`POST /api/summarize`)
- [x] 2.4 — Test backend alone
- [x] 2.5 — Build `TextInput` component
- [x] 2.6 — Build `SummaryDisplay` component
- [x] 2.7 — Build API service (`frontend/src/services/api.ts`)
- [x] 2.8 — Wire up `App.tsx` (State, Persistence)
- [x] 2.9 — Verify Phase 2

## Phase 3: Translation
**Estimated Time:** 50 min | **Actual Time:** ---
- [ ] 3.1 — Build translate service (`backend/app/services/translate_service.py` using `deep-translator`)
- [ ] 3.2 — Add translate endpoint (`POST /api/translate`)
- [ ] 3.3 — Test backend alone
- [ ] 3.4 — Build `LanguageSelector` component (EN, FI, SV, AR, UR)
- [ ] 3.5 — Wire up translation in `App.tsx`
- [ ] 3.6 — Verify Phase 3

## Phase 4: Optional Features
**Estimated Time:** 100 min | **Actual Time:** ---

### 4a: File Upload (25 min)
- [ ] 4a.1 — Build file parser (`backend/app/services/file_parser.py` - .txt only)
- [ ] 4a.2 — Add upload endpoint (`POST /api/upload`)
- [ ] 4a.3 — Build `FileUpload` component
- [ ] 4a.4 — Verify 4a

### 4b: Personalization (30 min)
- [ ] 4b.1 — Build `PersonalizationPanel` component (Style, Tonality)
- [ ] 4b.2 — Pass options to summarize
- [ ] 4b.3 — Verify 4b

### 4c: Regenerate Summary (15 min)
- [ ] 4c.1 — Add regenerate button to `SummaryDisplay.tsx`
- [ ] 4c.2 — Verify 4c

### 4d: Multiple Summary Types (30 min)
- [ ] 4d.1 — Build `SummaryTypeTabs` component (Brief, Detailed, Key Points, Action Points)
- [ ] 4d.2 — Action Points behavior in `prompts.py`
- [ ] 4d.3 — Wire into `App.tsx`
- [ ] 4d.4 — Verify 4d

## Phase 5: Polish & Deploy
**Estimated Time:** 50 min | **Actual Time:** ---
- [ ] 5.1 — Loading & error states
- [ ] 5.2 — UI polish (Medical theme: whites, soft blues)
- [ ] 5.3 — GitHub repo setup (.gitignore, README.md)
- [ ] 5.4 — Deploy to Render (Backend + Frontend)
- [ ] 5.5 — Final verification
