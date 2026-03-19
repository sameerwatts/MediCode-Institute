"""
services/storage_service.py — Supabase Storage integration for image uploads.

Handles uploading course-related images (thumbnails, TipTap inline images)
to Supabase Storage and returning public URLs.

Requires SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY env vars.
"""

import uuid
from pathlib import PurePosixPath

from supabase import create_client, Client

from app.config import settings


def _get_client() -> Client:
    """Create a Supabase client using the service role key."""
    return create_client(settings.supabase_url, settings.supabase_service_role_key)


def upload_image(
    file_bytes: bytes,
    original_filename: str,
    folder: str = "images",
) -> str:
    """
    Upload an image to Supabase Storage.

    Args:
        file_bytes: Raw image bytes.
        original_filename: Original filename (used for extension).
        folder: Subfolder within the bucket (e.g. "thumbnails", "content").

    Returns:
        Public URL of the uploaded image.
    """
    ext = PurePosixPath(original_filename).suffix or ".png"
    unique_name = f"{uuid.uuid4().hex}{ext}"
    path = f"{folder}/{unique_name}"

    client = _get_client()
    bucket = settings.supabase_storage_bucket

    client.storage.from_(bucket).upload(
        path=path,
        file=file_bytes,
        file_options={"content-type": _get_content_type(ext)},
    )

    public_url = client.storage.from_(bucket).get_public_url(path)
    return public_url


def _get_content_type(ext: str) -> str:
    """Map file extension to MIME type."""
    content_types = {
        ".png": "image/png",
        ".jpg": "image/jpeg",
        ".jpeg": "image/jpeg",
        ".gif": "image/gif",
        ".webp": "image/webp",
        ".svg": "image/svg+xml",
    }
    return content_types.get(ext.lower(), "application/octet-stream")
