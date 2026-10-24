from fastapi import APIRouter, HTTPException, status
from ..schemas.planning import PlanningRequest, PlanningResponse
from ..services.planning_service import PlanningService
from ..services.history_service import HistoryService

router = APIRouter(prefix="/api/planning", tags=["Project Planning"])

@router.post("/generate", response_model=PlanningResponse, status_code=status.HTTP_200_OK)
async def generate_project_plan(req: PlanningRequest):
    try:
        result = PlanningService.generate_project_plan(req)

        await HistoryService.add_record(
            id_str=result.id,
            category="Project Planning",
            title=f"Schedule: {req.project_name}",
            site_name="Active Project Site",
            summary=f"{len(result.milestones)} milestones planned across {result.total_duration_days} days. Budget band: {result.total_estimated_cost_band}.",
            status="Completed",
            badge_color="amber",
            metadata={"duration_days": result.total_duration_days}
        )

        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Project planning calculation failed: {str(e)}"
        )
