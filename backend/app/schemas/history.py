from pydantic import BaseModel
from typing import List, Optional, Any, Dict

class AnalysisRecord(BaseModel):
    id: str
    timestamp: str
    category: str # "Safety Monitoring", "Crack Detection", "Real Estate Valuation", "Project Planning"
    title: str
    site_name: str
    summary: str
    status: str
    badge_color: str
    metadata: Dict[str, Any]

class HistoryListResponse(BaseModel):
    total_count: int
    items: List[AnalysisRecord]
