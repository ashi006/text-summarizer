from fastapi import UploadFile, HTTPException

async def parse_file(file: UploadFile) -> str:
    """
    Reads a .txt file and returns its content as a string.
    Only allows .txt files.
    """
    if not file.filename.endswith('.txt'):
        raise HTTPException(status_code=400, detail="Only .txt files are supported currently.")
    
    try:
        contents = await file.read()
        return contents.decode('utf-8')
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error reading file: {str(e)}")
