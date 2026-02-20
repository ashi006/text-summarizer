"""
Endpoint integration tests for the Text Summarizer & Translator API.
Uses FastAPI TestClient and mocks external service calls to keep tests fast and offline.
"""
import pytest
from unittest.mock import AsyncMock, patch
from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)


# ---------------------------------------------------------------------------
# Health check
# ---------------------------------------------------------------------------

def test_health_check():
    response = client.get("/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok"}


# ---------------------------------------------------------------------------
# /summarize endpoint
# ---------------------------------------------------------------------------

@patch("app.services.openai_service.summarize", new_callable=AsyncMock)
def test_summarize_success(mock_summarize):
    mock_summarize.return_value = "This is a brief summary."

    response = client.post("/summarize", json={
        "text": "Patient reports headache and fever for two days.",
        "summary_type": "brief",
        "style": "paragraph",
        "tonality": "professional"
    })

    assert response.status_code == 200
    data = response.json()
    assert data["summary"] == "This is a brief summary."
    assert data["summary_type"] == "brief"
    mock_summarize.assert_called_once()


def test_summarize_missing_text():
    """Omitting required 'text' field should return a 422 validation error."""
    response = client.post("/summarize", json={})
    assert response.status_code == 422


@patch("app.services.openai_service.summarize", new_callable=AsyncMock)
def test_summarize_defaults(mock_summarize):
    """Optional fields should use their defaults."""
    mock_summarize.return_value = "Default summary."

    response = client.post("/summarize", json={"text": "Some text."})
    assert response.status_code == 200
    data = response.json()
    assert data["summary"] == "Default summary."


# ---------------------------------------------------------------------------
# /translate endpoint
# ---------------------------------------------------------------------------

@patch("app.services.translate_service.translate", new_callable=AsyncMock)
def test_translate_success(mock_translate):
    mock_translate.return_value = "Tämä on lyhyt yhteenveto."

    response = client.post("/translate", json={
        "text": "This is a brief summary.",
        "target_language": "fi"
    })

    assert response.status_code == 200
    data = response.json()
    assert data["translated_text"] == "Tämä on lyhyt yhteenveto."
    assert data["target_language"] == "fi"
    mock_translate.assert_called_once_with(text="This is a brief summary.", target_language="fi")


def test_translate_missing_language():
    """Omitting required 'target_language' should return 422."""
    response = client.post("/translate", json={"text": "Some text."})
    assert response.status_code == 422


def test_translate_missing_text():
    """Omitting required 'text' should return 422."""
    response = client.post("/translate", json={"target_language": "fi"})
    assert response.status_code == 422


# ---------------------------------------------------------------------------
# /upload endpoint
# ---------------------------------------------------------------------------

def test_upload_txt_success():
    """A valid .txt file upload should return its text content."""
    file_content = b"Patient reports persistent cough."
    response = client.post(
        "/upload",
        files={"file": ("notes.txt", file_content, "text/plain")}
    )
    assert response.status_code == 200
    assert response.json()["text"] == "Patient reports persistent cough."


def test_upload_non_txt():
    """Uploading a non-.txt file should return a 400 error."""
    file_content = b"%PDF-1.4 fake pdf content"
    response = client.post(
        "/upload",
        files={"file": ("document.pdf", file_content, "application/pdf")}
    )
    assert response.status_code == 400
