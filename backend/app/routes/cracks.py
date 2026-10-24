from fastapi import APIRouter, UploadFile, File, Form, HTTPException, status
from typing import Optional
from ..schemas.cracks import CrackAnalysisResponse
from ..services.crack_service import CrackService
from ..services.history_service import HistoryService
from ..services.supabase_service import SupabaseService

router = APIRouter(prefix="/api/cracks", tags=["Structural Crack Detection"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp", "image/jpg"}
MAX_FILE_SIZE = 15 * 1024 * 1024

@router.post("/analyze", response_model=CrackAnalysisResponse, status_code=status.HTTP_200_OK)
async def analyze_structural_crack(
    image: UploadFile = File(..., description="Structural element surface photo"),
    element_type: str = Form("column"),
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
            detail=f"Failed to read image stream: {str(e)}"
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
        result = await CrackService.analyze_crack_image(file_bytes, element_type=element_type)

        # Upload image to Supabase Storage if configured
        storage_url = await SupabaseService.upload_asset(file_bytes, image.filename or "crack.jpg", image.content_type)

        await HistoryService.add_record(
            id_str=result.id,
            category="Crack Detection",
            title=f"Structural Defect: {element_type.capitalize()} ({site_name})",
            site_name=site_name,
            summary=f"{result.crack_type} - {result.severity_level}. Urgency: {result.repair_urgency}",
            status="Completed",
            badge_color="rose" if "Critical" in result.severity_level else "emerald",
            metadata={"crack_detected": result.crack_detected, "element": element_type}
        )

        return result
    except ValueError as val_err:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(val_err))
    except Exception as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Internal error executing crack detection: {str(err)}"
        )
