from deep_translator import GoogleTranslator

async def translate(text: str, target_language: str) -> str:
    """
    Translates text to the target language using deep-translator (GoogleTranslator).
    Source language is auto-detected.
    """
    try:
        # GoogleTranslator(source='auto', target='fi')
        # Map some common names to codes if needed, but the UI will send codes.
        translator = GoogleTranslator(source='auto', target=target_language)
        translated = translator.translate(text)
        return translated
    except Exception as e:
        raise e
