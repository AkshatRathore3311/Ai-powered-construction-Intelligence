from pydantic import BaseModel, Field
from typing import List, Optional, Dict, Any

class CrackAnalysisResponse(BaseModel):
    id: str
    timestamp: str
    element_type: str # column, beam, slab, wall, foundation
    crack_detected: bool
    crack_type: Optional[str] = None # e.g. "Diagonal Shear Crack", "Hairline Shrinkage", "Longitudinal Flexural"
    severity_level: str # "Critical", "Moderate", "Hairline / Low", "None Detected"
    estimated_width_mm: Optional[float] = None
    estimated_length_cm: Optional[float] = None
    is_dimension_calibrated: bool = False
    structural_impact_analysis: str
    repair_urgency: str # "Immediate (within 48h)", "Monitor Next Cycle", "Non-Critical"
    recommended_repair_method: str
    detection_method: str
    confidence: float
    limitations: List[str]
    disclaimer: str = "Optical analysis does not certify subsurface or structural load-bearing capacity. Ultrasonic or non-destructive testing (NDT) required for structural sign-off."
