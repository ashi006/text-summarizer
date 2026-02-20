"""
Unit tests for individual backend service functions and prompt builder.
External dependencies (OpenAI, Google Translate) are mocked throughout.
"""
import pytest
from unittest.mock import AsyncMock, MagicMock, patch
from io import BytesIO
from fastapi import HTTPException
from starlette.datastructures import UploadFile

from app.prompts import get_system_prompt
from app.services import translate_service, file_parser, openai_service


# ---------------------------------------------------------------------------
# prompts.py
# ---------------------------------------------------------------------------

class TestGetSystemPrompt:
    def test_brief_summary_type(self):
        prompt = get_system_prompt("brief", "paragraph", "professional")
        assert "concise" in prompt.lower()

    def test_detailed_summary_type(self):
        prompt = get_system_prompt("detailed", "paragraph", "professional")
        assert "comprehensive" in prompt.lower()

    def test_key_points_summary_type(self):
        prompt = get_system_prompt("key_points", "paragraph", "professional")
        assert "key" in prompt.lower()

    def test_action_points_summary_type(self):
        prompt = get_system_prompt("action_points", "paragraph", "professional")
        assert "actionable" in prompt.lower() or "action" in prompt.lower()

    def test_bullets_style(self):
        prompt = get_system_prompt("brief", "bullets", "professional")
        assert "bullet" in prompt.lower()

    def test_numbered_style(self):
        prompt = get_system_prompt("brief", "numbered", "professional")
        assert "numbered" in prompt.lower()

    def test_casual_tonality(self):
        prompt = get_system_prompt("brief", "paragraph", "casual")
        assert "casual" in prompt.lower()

    def test_simplified_tonality(self):
        prompt = get_system_prompt("brief", "paragraph", "simplified")
        assert "simple" in prompt.lower() or "simplified" in prompt.lower()

    def test_prompt_ends_with_transcript_header(self):
        prompt = get_system_prompt("brief", "paragraph", "professional")
        assert "Transcript" in prompt


# ---------------------------------------------------------------------------
# translate_service.py
# ---------------------------------------------------------------------------

class TestTranslateService:
    @pytest.mark.asyncio
    async def test_translate_returns_translated_text(self):
        with patch("app.services.translate_service.GoogleTranslator") as MockTranslator:
            instance = MockTranslator.return_value
            instance.translate.return_value = "Tämä on yhteenveto."

            result = await translate_service.translate("This is a summary.", "fi")

            MockTranslator.assert_called_once_with(source="auto", target="fi")
            instance.translate.assert_called_once_with("This is a summary.")
            assert result == "Tämä on yhteenveto."

    @pytest.mark.asyncio
    async def test_translate_propagates_exception(self):
        with patch("app.services.translate_service.GoogleTranslator") as MockTranslator:
            instance = MockTranslator.return_value
            instance.translate.side_effect = Exception("Network error")

            with pytest.raises(Exception, match="Network error"):
                await translate_service.translate("text", "fi")


# ---------------------------------------------------------------------------
# file_parser.py
# ---------------------------------------------------------------------------

class TestFileParser:
    def _make_upload_file(self, filename: str, content: bytes) -> UploadFile:
        return UploadFile(filename=filename, file=BytesIO(content))

    @pytest.mark.asyncio
    async def test_parse_txt_file_returns_content(self):
        upload = self._make_upload_file("notes.txt", b"Patient has a fever.")
        result = await file_parser.parse_file(upload)
        assert result == "Patient has a fever."

    @pytest.mark.asyncio
    async def test_parse_non_txt_raises_http_exception(self):
        upload = self._make_upload_file("report.pdf", b"%PDF fake content")
        with pytest.raises(HTTPException) as exc_info:
            await file_parser.parse_file(upload)
        assert exc_info.value.status_code == 400

    @pytest.mark.asyncio
    async def test_parse_utf8_content(self):
        content = "Potilaalla on kuumetta.".encode("utf-8")
        upload = self._make_upload_file("notes.txt", content)
        result = await file_parser.parse_file(upload)
        assert result == "Potilaalla on kuumetta."


# ---------------------------------------------------------------------------
# openai_service.py
# ---------------------------------------------------------------------------

class TestOpenAIService:
    @pytest.mark.asyncio
    async def test_summarize_returns_content(self):
        mock_response = MagicMock()
        mock_response.choices[0].message.content = "Mocked summary output."

        mock_client = MagicMock()
        mock_client.chat.completions.create.return_value = mock_response

        with patch("app.services.openai_service.get_client", return_value=mock_client):
            result = await openai_service.summarize(
                text="Patient transcript text.",
                summary_type="brief",
                style="paragraph",
                tonality="professional"
            )

        assert result == "Mocked summary output."
        mock_client.chat.completions.create.assert_called_once()

    @pytest.mark.asyncio
    async def test_summarize_propagates_exception(self):
        mock_client = MagicMock()
        mock_client.chat.completions.create.side_effect = Exception("API error")

        with patch("app.services.openai_service.get_client", return_value=mock_client):
            with pytest.raises(Exception, match="API error"):
                await openai_service.summarize("text", "brief", "paragraph", "professional")

    def test_get_client_raises_without_api_key(self):
        # Reset the global client so get_client() tries to create a new one
        openai_service.client = None
        with patch.dict("os.environ", {"OPENAI_API_KEY": "your_openai_api_key_here"}):
            with pytest.raises(ValueError, match="OPENAI_API_KEY"):
                openai_service.get_client()
