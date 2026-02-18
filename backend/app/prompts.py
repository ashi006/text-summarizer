def get_system_prompt(summary_type: str, style: str, tonality: str) -> str:
    """
    Constructs the system prompt based on summary type, style, and tonality.
    """
    
    # Base instructions
    prompt = f"You are a medical assistant helping a doctor summarize patient transcripts. "
    
    # 1. Summary Type logic
    if summary_type == "brief":
        prompt += "Provide a very concise summary focusing on the most critical clinical information. "
    elif summary_type == "detailed":
        prompt += "Provide a comprehensive summary including background, symptoms, diagnosis, and plan. "
    elif summary_type == "key_points":
        prompt += "Extract the main topics and key information points from the transcript. "
    elif summary_type == "action_points":
        prompt += "Extract all actionable items as a to-do list (e.g., follow-ups, prescriptions, tests). "
    else:
        prompt += "Summarize the following transcript. "

    # 2. Style logic
    if style == "bullets":
        prompt += "Format the output using bullet points. "
    elif style == "numbered":
        prompt += "Format the output as a numbered list. "
    else:
        prompt += "Format the output as a cohesive paragraph. "

    # 3. Tonality logic
    if tonality == "casual":
        prompt += "Use a casual, friendly tone. "
    elif tonality == "simplified":
        prompt += "Use simple language suitable for a patient to understand. "
    else:
        prompt += "Use a professional and formal medical tone. "

    prompt += "\n\nTranscript to process:\n"
    
    return prompt
