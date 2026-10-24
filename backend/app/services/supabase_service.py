import httpx
import logging
import uuid
from typing import Dict, Any, Optional, List
from ..config import settings

logger = logging.getLogger(__name__)

class SupabaseService:
    @staticmethod
    def is_configured() -> bool:
        return bool(
            settings.SUPABASE_URL
            and settings.SUPABASE_URL.startswith("http")
            and settings.SUPABASE_ANON_KEY
            and settings.SUPABASE_ANON_KEY != "your_supabase_anon_key"
        )

    @classmethod
    async def insert_record(cls, table_name: str, data: Dict[str, Any]) -> Optional[Dict[str, Any]]:
        """
        Inserts a row into Supabase PostgreSQL table via PostgREST endpoint.
        """
        if not cls.is_configured():
            logger.info("Supabase credentials unconfigured; skipping remote database insert.")
            return None

        url = f"{settings.SUPABASE_URL.rstrip('/')}/rest/v1/{table_name}"
        headers = {
            "apikey": settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY}",
            "Content-Type": "application/json",
            "Prefer": "return=representation"
        }

        try:
            async with httpx.AsyncClient(timeout=10.0) as client:
                resp = await client.post(url, headers=headers, json=data)
                if resp.status_code in (200, 201):
                    result = resp.json()
                    return result[0] if isinstance(result, list) and result else result
                else:
                    logger.warning(f"Supabase insert failed ({resp.status_code}): {resp.text}")
                    return None
        except Exception as e:
            logger.error(f"Error connecting to Supabase: {e}")
            return None

    @classmethod
    async def upload_asset(cls, file_bytes: bytes, filename: str, content_type: str = "image/jpeg") -> Optional[str]:
        """
        Uploads image file to Supabase Storage bucket and returns public/signed URL.
        """
        if not cls.is_configured():
            return None

        safe_name = f"{uuid.uuid4().hex}_{filename.replace(' ', '_')}"
        url = f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1/object/{settings.SUPABASE_STORAGE_BUCKET}/{safe_name}"
        headers = {
            "apikey": settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY,
            "Authorization": f"Bearer {settings.SUPABASE_SERVICE_ROLE_KEY or settings.SUPABASE_ANON_KEY}",
            "Content-Type": content_type
        }

        try:
            async with httpx.AsyncClient(timeout=15.0) as client:
                resp = await client.post(url, headers=headers, content=file_bytes)
                if resp.status_code in (200, 201):
                    return f"{settings.SUPABASE_URL.rstrip('/')}/storage/v1/object/public/{settings.SUPABASE_STORAGE_BUCKET}/{safe_name}"
                else:
                    logger.warning(f"Supabase storage upload failed ({resp.status_code}): {resp.text}")
                    return None
        except Exception as e:
            logger.error(f"Error uploading to Supabase storage: {e}")
            return None
