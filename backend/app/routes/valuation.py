from fastapi import APIRouter, HTTPException, status
from ..schemas.valuation import ValuationRequest, ValuationResponse
from ..services.valuation_service import ValuationService
from ..services.history_service import HistoryService

router = APIRouter(prefix="/api/valuation", tags=["Real Estate Valuation"])

@router.post("/estimate", response_model=ValuationResponse, status_code=status.HTTP_200_OK)
async def estimate_property_valuation(req: ValuationRequest):
    try:
        result = ValuationService.calculate_valuation(req)

        await HistoryService.add_record(
            id_str=result.id,
            category="Real Estate Valuation",
            title=f"Valuation: {req.property_type.capitalize()} ({req.built_up_area_sqft:,.0f} sq.ft)",
            site_name="Metro Heights Portfolio",
            summary=f"Estimated market valuation at {result.formatted_value} ({result.formatted_per_sqft}/sq.ft).",
            status="Completed",
            badge_color="blue",
            metadata={"estimated_value": result.estimated_total_value}
        )

        return result
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Valuation calculation error: {str(e)}"
        )
