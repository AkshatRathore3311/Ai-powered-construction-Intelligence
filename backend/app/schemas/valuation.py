from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class ValuationRequest(BaseModel):
    property_type: str = Field(default="commercial", description="commercial, residential, industrial, mixed")
    built_up_area_sqft: float = Field(gt=0, description="Gross built-up area in sq.ft")
    land_area_sqft: Optional[float] = Field(default=None, description="Land parcel area")
    location_tier: str = Field(default="prime", description="prime, suburban, outer")
    structural_grade: str = Field(default="grade_a", description="grade_a, grade_b, grade_c")
    construction_age_stage: str = Field(default="new", description="new, 1_to_3, 5_plus")
    transit_proximity_miles: float = Field(default=1.0, ge=0)
    is_leed_certified: bool = Field(default=False)
    target_currency: str = Field(default="USD")

class ValuationComp(BaseModel):
    address: str
    sqft: float
    sale_price: str
    price_per_sqft: str
    date: str

class ValuationResponse(BaseModel):
    id: str
    timestamp: str
    estimated_total_value: float
    formatted_value: str
    estimated_price_per_sqft: float
    formatted_per_sqft: str
    valuation_range_low: float
    valuation_range_high: float
    confidence_score_percentage: float
    formula_breakdown: Dict[str, Any]
    comparables: List[ValuationComp]
    assumptions: List[str]
    data_sources: List[str]
    limitations: List[str]
    disclaimer: str = "This estimate is an algorithmic comparative model based on architectural specifications and regional multipliers. It is not an official certified appraisal."
