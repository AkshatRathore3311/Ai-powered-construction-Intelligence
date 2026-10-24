from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class PlanningRequest(BaseModel):
    project_name: str = Field(min_length=2)
    site_area_sqft: float = Field(gt=0, default=25000)
    target_budget: float = Field(gt=0, default=3500000)
    target_duration_months: int = Field(gt=0, le=60, default=6)
    construction_method: str = Field(default="Cast-in-place Concrete Core with Steel Frame")

class MilestoneItem(BaseModel):
    id: int
    phase: str
    duration_days: int
    start_day_offset: int
    completion_day_offset: int
    dependency: str
    risk_level: str # "Low", "Medium", "High"
    status: str # "Pending", "In Progress", "Completed"
    key_deliverable: str

class MaterialTakeoff(BaseModel):
    item: str
    estimated_quantity: str
    unit_cost_estimate: str
    total_cost_allocation: str

class PlanningResponse(BaseModel):
    id: str
    timestamp: str
    project_name: str
    total_duration_days: int
    target_completion_formatted: str
    total_estimated_cost_band: str
    budget_variance_status: str
    critical_path: List[str]
    potential_conflicts_and_risks: List[str]
    milestones: List[MilestoneItem]
    materials_bill_of_quantities: List[MaterialTakeoff]
    deterministic_validation: Dict[str, Any]
    disclaimer: str = "Project schedule and material forecasts are preliminary planning models. Actual execution requires site superintendent validation and contractor bidding."
