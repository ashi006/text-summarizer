import os
from dotenv import load_dotenv

# Load environment variables at the very beginning
load_dotenv()

from fastapi import FastAPI, File, Header, HTTPException, UploadFile
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.services import openai_service, translate_service, file_parser, history_service

app = FastAPI(title="Transcript Summarizer API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "https://calm-tree-002b26003.1.azurestaticapps.net",
        "https://calm-tree-002b26003.azurestaticapps.net",
        os.environ.get("FRONTEND_URL", "").rstrip("/"),
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class SummarizeRequest(BaseModel):
    text: str
    summary_type: Optional[str] = "brief"
    style: Optional[str] = "paragraph"
    tonality: Optional[str] = "professional"

class TranslateRequest(BaseModel):
    text: str
    target_language: str

class SaveHistoryRequest(BaseModel):
    input_text: str
    summary: str
    translated_summary: Optional[str] = None
    summary_type: Optional[str] = "brief"
    style: Optional[str] = "paragraph"
    tonality: Optional[str] = "professional"
    language: Optional[str] = "original"

@app.post("/summarize")
async def summarize_text(request: SummarizeRequest):
    try:
        summary = await openai_service.summarize(
            text=request.text,
            summary_type=request.summary_type,
            style=request.style,
            tonality=request.tonality
        )
        return {
            "summary": summary,
            "summary_type": request.summary_type,
            "style": request.style
        }
    except Exception as e:
        return {"error": str(e)}, 500

@app.post("/translate")
async def translate_text(request: TranslateRequest):
    try:
        translated = await translate_service.translate(
            text=request.text,
            target_language=request.target_language
        )
        return {
            "translated_text": translated,
            "target_language": request.target_language
        }
    except Exception as e:
        return {"error": str(e)}, 500

@app.post("/upload")
async def upload_file(file: UploadFile = File(...)):
    try:
        text = await file_parser.parse_file(file)
        return {"text": text}
    except HTTPException:
        raise
    except Exception as e:
        return {"error": str(e)}, 500


# ── History endpoints ────────────────────────────────────────────────────────

@app.post("/history")
async def save_history(
    request: SaveHistoryRequest,
    x_device_id: str = Header(..., alias="X-Device-Id"),
):
    """Save or update a summary in the device's history (upserts by input_text)."""
    if not x_device_id:
        raise HTTPException(status_code=400, detail="X-Device-Id header is required")
    try:
        saved = await history_service.upsert_summary(x_device_id, request.model_dump())
        return saved
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history")
async def get_history(
    x_device_id: str = Header(..., alias="X-Device-Id"),
    skip: int = 0,
    limit: int = 10,
):
    """Get paginated summaries for the current device, newest first."""
    if not x_device_id:
        raise HTTPException(status_code=400, detail="X-Device-Id header is required")
    try:
        result = await history_service.get_history(x_device_id, skip=skip, limit=limit)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/history/{summary_id}")
async def get_summary(
    summary_id: str,
    x_device_id: str = Header(..., alias="X-Device-Id"),
):
    """Get a single summary by ID for the current device."""
    item = await history_service.get_summary(x_device_id, summary_id)
    if not item:
        raise HTTPException(status_code=404, detail="Summary not found")
    return item


@app.delete("/history/{summary_id}")
async def delete_summary(
    summary_id: str,
    x_device_id: str = Header(..., alias="X-Device-Id"),
):
    """Soft-delete a summary (marks deleted_at, stays in DB)."""
    deleted = await history_service.delete_summary(x_device_id, summary_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Summary not found")
    return {"deleted": True}


@app.get("/health")
async def health_check():
    return {"status": "ok"}
