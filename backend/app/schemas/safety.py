from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class SafetyDetectionItem(BaseModel):
    label: str
    category: str # "worker_safe", "ppe_violation", "perimeter_hazard", "equipment"
    confidence: float
    bbox: Optional[List[int]] = None # [ymin, xmin, ymax, xmax]
    notes: Optional[str] = None

class SafetySummary(BaseModel):
    total_workers_observed: int
    ppe_compliant_count: int
    ppe_violations_count: int
    hazard_zones_count: int
    compliance_score_percentage: float
    safety_rating: str # "Compliant", "Attention Needed", "High Risk"

class SafetyAnalysisResponse(BaseModel):
    id: str
    timestamp: str
    image_metadata: Dict[str, Any]
    detections: List[SafetyDetectionItem]
    summary: SafetySummary
    recommendations: List[str]
    method: str
    limitations: List[str]
    disclaimer: str = "Automated visual scan is an assistive tool only. It does not certify site safety or substitute for certified safety engineer oversight."
