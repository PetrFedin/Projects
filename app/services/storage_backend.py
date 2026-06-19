"""Local media storage for DAM uploads."""

from __future__ import annotations

import uuid
from pathlib import Path

from fastapi import UploadFile

from app.core.config import settings


class LocalStorageBackend:
    def __init__(self, base_dir: str | None = None):
        self.base_dir = Path(base_dir or settings.MEDIA_UPLOAD_DIR)
        self.base_dir.mkdir(parents=True, exist_ok=True)

    async def save_upload(self, file: UploadFile, subdir: str = "dam") -> tuple[str, str]:
        ext = Path(file.filename or "upload.bin").suffix or ".bin"
        name = f"{uuid.uuid4().hex}{ext}"
        dest_dir = self.base_dir / subdir
        dest_dir.mkdir(parents=True, exist_ok=True)
        dest = dest_dir / name
        content = await file.read()
        dest.write_bytes(content)
        rel = f"{subdir}/{name}"
        url = f"/static/media/{rel}"
        return rel, url


storage_backend = LocalStorageBackend()
