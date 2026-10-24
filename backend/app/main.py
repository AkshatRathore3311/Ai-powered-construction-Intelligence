from fastapi import FastAPI, status
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timezone

from .config import settings
from .schemas.common import HealthResponse
from .services.ai_service import MultimodalAIService
from .services.supabase_service import SupabaseService

from .routes.safety import router as safety_router
from .routes.cracks import router as cracks_router
from .routes.valuation import router as valuation_router
from .routes.planning import router as planning_router
from .routes.assistant import router as assistant_router
from .routes.weather import router as weather_router
from .routes.analyses import router as analyses_router

app = FastAPI(
    title="BuildIntel AI — Construction Intelligence Platform",
    description="Backend API for Multimodal Construction Safety, Structural Defect Detection, Valuation, and Project Planning.",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS Middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"] if settings.ENVIRONMENT == "development" else settings.cors_origins_list,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount Feature Routers
app.include_router(safety_router)
app.include_router(cracks_router)
app.include_router(valuation_router)
app.include_router(planning_router)
app.include_router(assistant_router)
app.include_router(weather_router)
app.include_router(analyses_router)

@app.get("/api/health", response_model=HealthResponse, tags=["Health"])
async def health_check():
    return HealthResponse(
        status="healthy",
        version="1.0.0",
        environment=settings.ENVIRONMENT,
        timestamp=datetime.now(timezone.utc).isoformat(),
        ai_provider=settings.AI_PROVIDER,
        ai_configured=MultimodalAIService.is_configured(),
        supabase_configured=SupabaseService.is_configured(),
        weather_provider="Open-Meteo Telemetry Feed"
    )

@app.get("/", tags=["Health"])
async def root():
    return {
        "platform": "BuildIntel AI",
        "description": "Multimodal Construction Intelligence Platform API",
        "documentation": "/docs",
        "health": "/api/health"
    }
