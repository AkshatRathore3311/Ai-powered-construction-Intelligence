from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class HourlyForecast(BaseModel):
    time: str
    temperature_celsius: float
    wind_speed_kmh: float
    precipitation_probability: int
    condition: str

class ConstructionAdvisory(BaseModel):
    category: str # "crane", "concrete", "heat", "scaffolding"
    title: str
    status_level: str # "Optimal", "Caution", "Halt / Severe Risk"
    severity_badge: str # "emerald", "amber", "rose"
    guidance: str

class WeatherResponse(BaseModel):
    location_name: str
    latitude: float
    longitude: float
    timestamp: str
    source: str # e.g. "Open-Meteo Real-time Meteorological Feed"
    current_temperature_celsius: float
    relative_humidity_percentage: int
    wind_speed_kmh: float
    wind_gusts_kmh: float
    weather_condition: str
    precipitation_chance: int
    uv_index: float
    is_live_telemetry: bool
    crane_operation_permitted: bool
    advisories: List[ConstructionAdvisory]
    hourly_progression: List[HourlyForecast]
    disclaimer: str = "Weather advisories provide site operation guidance based on current station feeds. Site superintendents must monitor local anemometers."
