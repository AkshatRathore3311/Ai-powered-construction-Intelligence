from fastapi import APIRouter, Query, HTTPException, status
from typing import Optional
from ..schemas.weather import WeatherResponse
from ..services.weather_service import WeatherService

router = APIRouter(prefix="/api/weather", tags=["Daily Site & Weather Advisory"])

@router.get("/current", response_model=WeatherResponse, status_code=status.HTTP_200_OK)
async def get_current_weather(
    latitude: Optional[float] = Query(None, description="Site latitude coordinates"),
    longitude: Optional[float] = Query(None, description="Site longitude coordinates"),
    city: Optional[str] = Query(None, description="City or site name label")
):
    try:
        return await WeatherService.get_current_weather(
            latitude=latitude,
            longitude=longitude,
            city_name=city
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to fetch live meteorological data: {str(e)}"
        )
