from fastapi import APIRouter, status
from ..schemas.history import HistoryListResponse
from ..services.history_service import HistoryService

router = APIRouter(prefix="/api/analyses", tags=["Analysis History"])

@router.get("", response_model=HistoryListResponse, status_code=status.HTTP_200_OK)
async def get_all_analyses():
    return HistoryService.get_all_records()
