# Step-by-Step Implementation Guide

This is the hands-on guide: exactly what to do in each phase, in order.

---

## Phase 1: Project Setup & Foundation

### 1.1 — Create project folders
- Create `frontend/` and `backend/` directories in project root

### 1.2 — Scaffold frontend
- Run Vite scaffolding with React + TypeScript template inside `frontend/`
- Install `axios` as dependency
- Delete boilerplate files (default App content, logos, etc.)

### 1.3 — Scaffold backend
- Create `backend/app/` directory
- Create `backend/requirements.txt` with: `fastapi`, `uvicorn`, `openai`, `deep-translator`, `python-multipart`, `python-dotenv`
- Create `backend/app/main.py` with FastAPI app instance
- Create `backend/.env.example` listing: `OPENAI_API_KEY`

### 1.4 — Wire up CORS + proxy
- In `main.py`: add CORS middleware allowing frontend origin (`http://localhost:5173`)
- In `vite.config.ts`: add proxy rule — `/api` → `http://localhost:8000`

### 1.5 — Health check
- Add `GET /health` endpoint in `main.py` returning `{"status": "ok"}`

### 1.6 — Verify Phase 1
- Start backend: `cd backend && uvicorn app.main:app --reload`
- Start frontend: `cd frontend && npm run dev`
- Open browser → frontend loads
- Frontend fetches `/health` → gets response
- ✅ **Phase 1 complete — move on only after this works**

---

## Phase 2: Core Summarization

### 2.1 — Create prompt templates
- Create `backend/app/prompts.py`
- Define prompt template strings for each combination:
  - **Summary types**: `brief`, `detailed`, `key_points`, `action_points`
  - **Styles**: `paragraph`, `bullets`, `numbered`
  - **Tonality**: `professional`, `casual`, `simplified`
- Each template is a string with placeholders for the transcript text
- Example structure: a function that takes `(summary_type, style, tonality)` and returns the full system prompt

### 2.2 — Build OpenAI service
- Create `backend/app/services/openai_service.py`
- Function: `async def summarize(text, style, tonality, summary_type) -> str`
- Import prompt builder from `prompts.py`
- Call OpenAI `gpt-4o-mini` with built prompt, `temperature=0.7`
- Return the summary text
- Handle missing API key gracefully (raise clear error)

### 2.3 — Add summarize endpoint
- In `main.py`: add `POST /api/summarize`
- Accept JSON body: `text`, `style` (default "paragraph"), `tonality` (default "professional"), `summary_type` (default "brief")
- Call `openai_service.summarize()`
- Return `{ "summary": "...", "style": "...", "summary_type": "..." }`

### 2.4 — Test backend alone
- Use browser or curl to `POST /api/summarize` with sample text
- Confirm summary comes back (or clear error if no API key)
- ✅ **Backend summarization works before touching frontend**

### 2.5 — Build TextInput component
- Create `frontend/src/components/TextInput.tsx`
- Large textarea element
- Character count display below
- Clear button to empty the field

### 2.6 — Build SummaryDisplay component
- Create `frontend/src/components/SummaryDisplay.tsx`
- Card/panel that shows the summary text
- Copy-to-clipboard button

### 2.7 — Build API service
- Create `frontend/src/services/api.ts`
- `summarize(text, options)` function — POST to `/api/summarize`

### 2.8 — Wire up App.tsx
- Import TextInput, SummaryDisplay
- State: `inputText`, `summary`
- Summarize button: calls `api.summarize()`, sets summary state
- On summary change: save to `sessionStorage`
- On app load: restore summary from `sessionStorage`

### 2.9 — Verify Phase 2
- Paste text → click Summarize → summary appears
- Refresh page → summary is still there
- Clear text → paste new text → new summary replaces old
- ✅ **Phase 2 complete**

---

## Phase 3: Translation

### 3.1 — Build translate service
- Create `backend/app/services/translate_service.py`
- Function: `async def translate(text, target_language) -> str`
- Use `deep-translator` (`GoogleTranslator`) to translate text
- Source language is auto-detected by the library

### 3.2 — Add translate endpoint
- In `main.py`: add `POST /api/translate`
- Accept: `text`, `target_language` (language code, e.g., "fi", "sv", "ar", "ur")
- Return: `{ "translated_text": "...", "language": "fi" }`

### 3.3 — Test backend alone
- Curl `POST /api/translate` with sample English text + `target_language: "fi"`
- Confirm Finnish translation returned
- ✅ **Backend translation works before touching frontend**

### 3.4 — Build LanguageSelector component
- Create `frontend/src/components/LanguageSelector.tsx`
- Dropdown with hardcoded options:
  - English (`en`)
  - Finnish (`fi`)
  - Swedish (`sv`)
  - Arabic (`ar`)
  - Urdu (`ur`)
- Default: no translation selected (original language)

### 3.5 — Wire up translation in App.tsx
- Add `translate()` function to `api.ts`
- When language selected → call `/api/translate` with current summary
- Display original + translated text (in SummaryDisplay or side by side)
- Save translated text to `sessionStorage`

### 3.6 — Verify Phase 3
- Summarize text → pick Finnish → Finnish translation appears
- Switch to Arabic → Arabic translation
- Refresh → translation persists
- ✅ **Phase 3 complete**

---

## Phase 4: Optional Features

### 4a: File Upload (~25 min)

#### 4a.1 — Build file parser
- Create `backend/app/services/file_parser.py`
- Function: `parse_file(file) -> str` — read `.txt` file and return contents
- Reject non-`.txt` files with clear error

#### 4a.2 — Add upload endpoint
- In `main.py`: add `POST /api/upload`
- Accept file upload (multipart)
- Call `file_parser.parse_file()`, return `{ "text": "..." }`

#### 4a.3 — Build FileUpload component
- Create `frontend/src/components/FileUpload.tsx`
- File picker button accepting `.txt`
- On file selected → upload to `/api/upload` → populate text area

#### 4a.4 — Verify
- Upload `.txt` → text fills textarea → summarize works
- Upload `.pdf` → error message shown
- ✅ **4a complete**

---

### 4b: Personalization (~30 min)

#### 4b.1 — Build PersonalizationPanel component
- Create `frontend/src/components/PersonalizationPanel.tsx`
- **Style picker**: radio/buttons — Paragraph / Bullet Points / Numbered List
- **Tonality selector**: radio/buttons — Professional / Casual / Simplified
- Save selections to `sessionStorage`

#### 4b.2 — Pass options to summarize
- Update `App.tsx` to read style + tonality from PersonalizationPanel
- Pass to `api.summarize(text, { style, tonality, summary_type })`
- Backend `prompts.py` already has templates for each combo

#### 4b.3 — Verify
- Select Bullet Points + Simplified → summary in bullets, simple language
- Switch to Paragraph + Professional → formal paragraph
- Refresh → selections persist
- ✅ **4b complete**

---

### 4c: Regenerate Summary (~15 min)

#### 4c.1 — Add regenerate button
- Add 🔄 Regenerate button to `SummaryDisplay.tsx`
- On click → call `api.summarize()` with same inputs
- `temperature=0.7` ensures OpenAI gives a different result

#### 4c.2 — Verify
- Summarize → click Regenerate → a different summary appears
- ✅ **4c complete**

---

### 4d: Multiple Summary Types (~30 min)

#### 4d.1 — Build SummaryTypeTabs component
- Create `frontend/src/components/SummaryTypeTabs.tsx`
- Tab bar with 4 tabs: **Brief** | **Detailed** | **Key Points** | **Action Points**
- Active tab highlighted
- On tab click → call `api.summarize()` with that `summary_type`

#### 4d.2 — Action Points behavior
- When "Action Points" tab selected, `prompts.py` uses a prompt like:
  *"Extract all actionable items from this transcript as a to-do list. Include items like follow-up appointments, prescriptions, referrals, tests to order, etc."*
- Returns a clear numbered action list

#### 4d.3 — Wire into App.tsx
- SummaryTypeTabs controls which `summary_type` is sent
- On tab switch → re-fetch summary with new type
- Display result in SummaryDisplay

#### 4d.4 — Verify
- Brief → short paragraph
- Detailed → longer comprehensive summary
- Key Points → bullet list of main topics
- Action Points → numbered to-do list of actionable items
- ✅ **4d complete**

---

## Phase 5: Polish & Deploy

### 5.1 — Loading & error states
- Add loading spinner/skeleton while API calls are in progress
- Add error toast/banner when API fails
- Disable buttons during loading

### 5.2 — UI polish
- Clean medical-themed design: whites, soft blues, subtle shadows
- Responsive layout (works on tablet/desktop)
- Consistent spacing, typography

### 5.3 — GitHub repo
- Initialize git in project root
- Create `.gitignore` (node_modules, __pycache__, .env, etc.)
- Write `README.md` — project description, setup instructions, env vars needed
- Push to GitHub

### 5.4 — Deploy to Render
- Create Render account (free tier)
- **Backend**: New Web Service → connect GitHub repo → root dir `backend/` → build command `pip install -r requirements.txt` → start command `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
- **Frontend**: New Static Site → connect GitHub repo → root dir `frontend/` → build command `npm run build` → publish dir `dist/`
- Set environment variables in Render dashboard for both services
- Update frontend API URL to point to deployed backend URL

### 5.5 — Final verification
- Open deployed URL
- Full flow: paste/upload text → pick style/tonality → pick summary type → summarize → translate → regenerate
- Refresh → everything persists
- ✅ **Done!**
