from pydantic import BaseModel, Field
from typing import List, Optional

class ChatRequest(BaseModel):
    message: str = Field(min_length=1)
    context_topic: Optional[str] = Field(default="general_construction")
    session_id: Optional[str] = Field(default="default_session")

class ChatResponse(BaseModel):
    id: str
    timestamp: str
    answer: str
    key_points: List[str]
    standard_references: List[str] # e.g. ["OSHA 1926.1408", "ACI 318-19"]
    recommendations: List[str]
    limitations: List[str]
    model_used: str
    disclaimer: str = "AI Construction Assistant provides informative guidance based on published engineering literature. It is not licensed architectural or engineering advice."
