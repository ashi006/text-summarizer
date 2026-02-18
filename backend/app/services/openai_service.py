import os
from openai import OpenAI
from app.prompts import get_system_prompt
from dotenv import load_dotenv

load_dotenv()

client = None

def get_client():
    global client
    if client is None:
        api_key = os.getenv("OPENAI_API_KEY")
        if not api_key or "your_openai_api_key_here" in api_key:
            raise ValueError("OPENAI_API_KEY is not set correctly in .env file")
        client = OpenAI(api_key=api_key)
    return client

async def summarize(text: str, summary_type: str, style: str, tonality: str) -> str:
    """
    Calls OpenAI GPT-4o-mini to summarize the text.
    """
    try:
        openai_client = get_client()
        system_prompt = get_system_prompt(summary_type, style, tonality)
        
        response = openai_client.chat.completions.create(
            model="gpt-4o-mini",
            messages=[
                {"role": "system", "content": system_prompt},
                {"role": "user", "content": text}
            ],
            temperature=0.7
        )
        
        return response.choices[0].message.content
    except Exception as e:
        raise e
