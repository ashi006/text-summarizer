# Text Summarizer & Translator

A powerful web application for summarizing and translating text, built with React, TypeScript, and FastAPI.

## Features

-   **Text Summarization**: Generate summaries in various styles (paragraph, bullet points) and lengths (brief, detailed).
-   **Translation**: Translate summaries into multiple languages (Finnish, Swedish, Arabic, Urdu).
-   **File Upload**: Support for summarizing text from uploaded `.txt` files.
-   **Personalization**: Adjust the tone (professional, casual) and style of the summary.
-   **Regenerate**: Quickly regenerate summaries for different variations.

## Technology Stack

-   **Frontend**: React, TypeScript, Vite, Tailwind CSS (styled with vanilla CSS per project requirements)
-   **Backend**: FastAPI, Python
-   **AI Services**: OpenAI (GPT-4o-mini) for summarization, `deep-translator` for translation

## Setup Instructions

### Prerequisites

-   Node.js (v16+)
-   Python (v3.8+)
-   OpenAI API Key

### Backend Setup

1.  Navigate to the backend directory:
    ```bash
    cd backend
    ```
2.  Create a virtual environment and activate it:
    ```bash
    python -m venv venv
    # Windows
    venv\Scripts\activate
    # macOS/Linux
    source venv/bin/activate
    ```
3.  Install dependencies:
    ```bash
    pip install -r requirements.txt
    ```
4.  Create a `.env` file in the `backend` directory and add your OpenAI API key:
    ```
    OPENAI_API_KEY=your_api_key_here
    ```
5.  Start the backend server:
    ```bash
    uvicorn app.main:app --reload
    ```
    The backend will run at `http://localhost:8000`.

### Frontend Setup

1.  Navigate to the frontend directory:
    ```bash
    cd frontend
    ```
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Start the development server:
    ```bash
    npm run dev
    ```
    The frontend will run at `http://localhost:5173`.

## Usage

1.  Open the frontend application in your browser.
2.  Enter text or upload a `.txt` file.
3.  Select your desired summary style and tonality.
4.  Click "Summarize" to generate a summary.
5.  Use the translation dropdown to translate the summary if needed.
