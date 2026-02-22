from datetime import datetime, timezone
from bson import ObjectId
from app.services.db import get_db


def _serialize(doc: dict) -> dict:
    """Convert MongoDB document to JSON-serializable dict."""
    doc["id"] = str(doc.pop("_id"))
    return doc


async def save_summary(device_id: str, data: dict) -> dict:
    """Save a new summary document for the given device."""
    db = get_db()
    now = datetime.now(timezone.utc)
    # Build a short title from the first 60 chars of input text
    raw_title = data.get("input_text", "").strip()
    title = (raw_title[:57] + "...") if len(raw_title) > 60 else raw_title

    doc = {
        "device_id": device_id,
        "title": title,
        "input_text": data.get("input_text", ""),
        "summary": data.get("summary", ""),
        "translated_summary": data.get("translated_summary"),
        "summary_type": data.get("summary_type", "brief"),
        "style": data.get("style", "paragraph"),
        "tonality": data.get("tonality", "professional"),
        "language": data.get("language", "original"),
        "created_at": now,
        "updated_at": now,
        "deleted_at": None,
    }
    result = await db["summaries"].insert_one(doc)
    doc["_id"] = result.inserted_id
    return _serialize(doc)


async def get_history(device_id: str, skip: int = 0, limit: int = 10) -> dict:
    """Return paginated non-deleted summaries for a device, newest first."""
    db = get_db()
    cursor = db["summaries"].find(
        {"device_id": device_id, "deleted_at": None},
        sort=[("created_at", -1)]
    ).skip(skip).limit(limit + 1)  # Fetch one extra to detect has_more
    docs = await cursor.to_list(length=limit + 1)
    has_more = len(docs) > limit
    return {
        "items": [_serialize(doc) for doc in docs[:limit]],
        "has_more": has_more,
        "skip": skip,
    }


async def upsert_summary(device_id: str, data: dict) -> dict:
    """Insert or update a summary based on input_text for the device.
    
    If a non-deleted summary with the same input_text already exists,
    update it with the latest values. Otherwise insert a new document.
    """
    db = get_db()
    now = datetime.now(timezone.utc)
    raw_title = data.get("input_text", "").strip()
    title = (raw_title[:57] + "...") if len(raw_title) > 60 else raw_title

    # Look for an existing non-deleted doc with the same input_text
    existing = await db["summaries"].find_one({
        "device_id": device_id,
        "input_text": data.get("input_text", ""),
        "deleted_at": None,
    })

    if existing:
        # Update in place
        update_fields = {
            "title": title,
            "summary": data.get("summary", existing["summary"]),
            "translated_summary": data.get("translated_summary", existing.get("translated_summary")),
            "summary_type": data.get("summary_type", existing["summary_type"]),
            "style": data.get("style", existing["style"]),
            "tonality": data.get("tonality", existing["tonality"]),
            "language": data.get("language", existing["language"]),
            "updated_at": now,
        }
        await db["summaries"].update_one(
            {"_id": existing["_id"]},
            {"$set": update_fields}
        )
        existing.update(update_fields)
        return _serialize(existing)
    else:
        return await save_summary(device_id, data)


async def get_summary(device_id: str, summary_id: str) -> dict | None:
    """Return a single summary by ID for the given device."""
    db = get_db()
    try:
        oid = ObjectId(summary_id)
    except Exception:
        return None
    doc = await db["summaries"].find_one({"_id": oid, "device_id": device_id})
    return _serialize(doc) if doc else None


async def delete_summary(device_id: str, summary_id: str) -> bool:
    """Soft-delete a summary (set deleted_at). Returns True if found."""
    db = get_db()
    try:
        oid = ObjectId(summary_id)
    except Exception:
        return False
    result = await db["summaries"].update_one(
        {"_id": oid, "device_id": device_id, "deleted_at": None},
        {"$set": {"deleted_at": datetime.now(timezone.utc)}}
    )
    return result.modified_count > 0
