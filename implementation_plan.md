# Transcript Summarization & Translation Service — Plan

A web service where doctors paste text (or upload files), get AI-generated summaries in configurable styles, and translate them via Google Translate.

**Timeline**: 4–6 hours (max 8h)

## Tech Stack

| Layer | Tech |
|-------|------|
| Frontend | React + TypeScript (Vite) |
| Backend | Python FastAPI |
| Summarization | OpenAI API (`gpt-4o-mini`) |
| Translation | `deep-translator` (GoogleTranslator) |
| Persistence | `sessionStorage` (client-side) |
| Deployment | Render (backend + frontend static site) |

---

## Project Structure

```
text-summarizer/
├── frontend/
│   ├── src/
│   │   ├── components/          # All UI components
│   │   ├── services/api.ts      # API client (axios)
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
├── backend/
│   ├── app/
│   │   ├── main.py              # FastAPI app + CORS + all routes
│   │   ├── prompts.py           # All prompt templates (separated)
│   │   ├── services/
│   │   │   ├── openai_service.py
│   │   │   ├── translate_service.py
│   │   │   └── file_parser.py
│   ├── requirements.txt
│   └── .env.example
└── README.md
```

---

## Phase 1: Project Setup & Foundation (~30 min)

- Scaffold React + TS frontend with Vite, install `axios`
- Scaffold FastAPI backend with `requirements.txt`
- Configure Vite proxy → backend, CORS on backend
- Basic layout component with header
- `GET /health` endpoint
- **Verify**: Both servers run, frontend calls backend health check

---

## Phase 2: Core Summarization (~60–90 min)

### Backend
- `prompts.py` — Prompt templates for each summary type × style × tonality combo
  - Summary types: **Brief**, **Detailed**, **Key Points**, **Action Points**
  - Styles: Paragraph / Bullet Points / Numbered List
  - Tonality: Professional / Casual / Simplified
- `openai_service.py` — Builds prompt from `prompts.py` templates, calls `gpt-4o-mini` (`temperature=0.7`)
- `POST /api/summarize` — accepts `text`, `style`, `tonality`, `summary_type`

### Frontend
- `TextInput.tsx` — textarea + char count + clear button
- `SummaryDisplay.tsx` — result card + copy button
- `api.ts` — API client
- `App.tsx` — wire up, persist summary to `sessionStorage`

### Verify
- Paste text → Summarize → summary appears
- Refresh → summary persists
- No API key → clear error message

---

## Phase 3: Translation (~45–60 min)

### Backend
- `translate_service.py` — `deep-translator` (GoogleTranslator) with auto-detect source language
- `POST /api/translate` — accepts `text`, `target_language`, returns translated text

### Frontend
- `LanguageSelector.tsx` — dropdown: **English, Finnish, Swedish, Arabic, Urdu**
- Doctor picks output language only (input auto-detected)
- Show original + translated summary
- Persist in `sessionStorage`

### Verify
- Summarize → select Finnish → translation appears
- Switch to Arabic → updates
- Refresh → persists

---

## Phase 4: Optional Features (~90–120 min)

### 4a: File Upload (~25 min)
- **Backend**: `file_parser.py` — extract text from `.txt` files only
- `POST /api/upload` — returns extracted text
- **Frontend**: `FileUpload.tsx` — file picker (`.txt`), populate text area on upload
- **Verify**: Upload `.txt` → text appears → summarize works. Unsupported → error.

### 4b: Personalization (~30 min)
- **Frontend**: `PersonalizationPanel.tsx`
  - Style picker: Paragraph / Bullet Points / Numbered List
  - Tonality: Professional / Casual / Simplified
  - Passed to `/api/summarize`, prompts come from `prompts.py`
  - Persist selections in `sessionStorage`
- **Verify**: Bullets + Simplified → different output. Refresh → persists.

### 4c: Regenerate Summary (~15 min)
- 🔄 Regenerate button on `SummaryDisplay.tsx`
- Same inputs, `temperature=0.7` gives variation
- **Verify**: Click Regenerate → different summary.

### 4d: Multiple Summary Types (~30 min)
- **Frontend**: `SummaryTypeTabs.tsx`
  - Tabs: **Brief** | **Detailed** | **Key Points** | **Action Points**
  - Action Points extracts actionable to-do items (e.g., *"Schedule follow-up"*, *"Order blood work"*)
  - Each tab calls `/api/summarize` with different `summary_type`, prompt from `prompts.py`
  - Re-fetch on tab switch (no caching)
- **Verify**: Each tab produces distinct output style.

---

## Phase 5: Polish & Deploy (~45–60 min)

- Loading spinners, error toasts, responsive layout
- Clean medical-themed UI (whites, soft blues)
- GitHub repo + README
- Deploy to Render (backend web service + frontend static site)
- Set env vars in Render dashboard

### Verify
- Full end-to-end flow locally
- Deployed URL works the same

---

## Time Budget

| Phase | Est. | Cumulative |
|-------|------|------------|
| 1. Setup | 30 min | 0:30 |
| 2. Summarization | 75 min | 1:45 |
| 3. Translation | 50 min | 2:35 |
| 4a. File Upload | 25 min | 3:00 |
| 4b. Personalization | 30 min | 3:30 |
| 4c. Regenerate | 15 min | 3:45 |
| 4d. Multi-type | 30 min | 4:15 |
| 5. Polish & Deploy | 50 min | **5:05** |

**~5h05m total** — ~55 min buffer before 6h mark.
