from pydantic import BaseModel, Field
from typing import Optional, Any, Dict
from datetime import datetime, timezone

class HealthResponse(BaseModel):
    status: str = "healthy"
    version: str = "1.0.0"
    environment: str
    timestamp: str
    ai_provider: str
    ai_configured: bool
    supabase_configured: bool
    weather_provider: str

class APIErrorResponse(BaseModel):
    detail: str
    code: Optional[str] = None
    timestamp: str = Field(default_factory=lambda: datetime.now(timezone.utc).isoformat())
