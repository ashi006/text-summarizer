import os
from dotenv import load_dotenv

# Load environment variables at the very beginning
load_dotenv()

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional
from app.services import openai_service, translate_service

app = FastAPI(title="Transcript Summarizer API")

# CORS setup
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
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

@app.get("/health")
async def health_check():
    return {"status": "ok"}
