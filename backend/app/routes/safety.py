from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from ..schemas.safety import SafetyAnalysisResponse
from ..services.safety_service import SafetyService
from ..services.history_service import HistoryService
from ..services.supabase_service import SupabaseService

router = APIRouter(prefix="/api/safety", tags=["Safety Monitoring"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE = 15 * 1024 * 1024 # 15 MB

@router.post("/analyze", response_model=SafetyAnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_site_safety(
    image: UploadFile = File(..., description="Construction site inspection photo"),
    site_name: str = Form("Metro Heights Tower A")
):
    if image.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Unsupported file type '{image.content_type}'. Must be JPG, PNG, or WEBP."
        )

    try:
        file_bytes = await image.read()
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Failed to read uploaded image stream: {str(e)}"
        )

    if len(file_bytes) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_413_REQUEST_ENTITY_TOO_LARGE,
            detail="File size exceeds maximum 15MB limit."
        )

    if len(file_bytes) == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Uploaded file is empty."
        )

    try:
        # Run safety analysis
        result = await SafetyService.analyze_safety_image(file_bytes)

        # Upload image to Supabase Storage if configured
        storage_url = await SupabaseService.upload_asset(file_bytes, image.filename or "safety.jpg", image.content_type)
        if storage_url:
            result.image_metadata["storage_url"] = storage_url

        # Log into history registry
        await HistoryService.add_record(
            id_str=result.id,
            category="Safety Monitoring",
            title=f"Site Safety Audit ({site_name})",
            site_name=site_name,
            summary=f"Safety score {result.summary.compliance_score_percentage}%. {result.summary.ppe_violations_count} PPE violations.",
            status="Completed",
            badge_color="emerald" if result.summary.compliance_score_percentage > 85 else "rose",
            metadata={"safety_score": result.summary.compliance_score_percentage}
        )

        return result
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error processing safety analysis: {str(err)}"
        )
