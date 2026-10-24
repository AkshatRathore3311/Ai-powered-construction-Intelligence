import os
from typing import List
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field

class Settings(BaseSettings):
    ENVIRONMENT: str = Field(default="development")
    PORT: int = Field(default=8000)
    CORS_ORIGINS: str = Field(default="http://localhost:5173,http://localhost:3000,http://127.0.0.1:5173")
    
    # AI Provider settings
    AI_PROVIDER: str = Field(default="gemini")
    AI_MODEL: str = Field(default="gemini-1.5-flash")
    GEMINI_API_KEY: str = Field(default="")
    OPENAI_API_KEY: str = Field(default="")
    
    # Weather settings
    WEATHER_API_KEY: str = Field(default="")
    DEFAULT_LATITUDE: float = Field(default=28.6139) # Default Metro Coordinates
    DEFAULT_LONGITUDE: float = Field(default=77.2090)
    DEFAULT_CITY_NAME: str = Field(default="Metro Hub Sector 62")
    
    # Supabase credentials
    SUPABASE_URL: str = Field(default="")
    SUPABASE_ANON_KEY: str = Field(default="")
    SUPABASE_SERVICE_ROLE_KEY: str = Field(default="")
    SUPABASE_STORAGE_BUCKET: str = Field(default="inspection-assets")

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        extra="ignore"
    )

    @property
    def cors_origins_list(self) -> List[str]:
        return [origin.strip() for origin in self.CORS_ORIGINS.split(",") if origin.strip()]

settings = Settings()
