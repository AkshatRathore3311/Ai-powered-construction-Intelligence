import uuid
from datetime import datetime, timezone
from typing import Dict, Any, List

from .cv_service import ComputerVisionService
from .ai_service import MultimodalAIService
from ..schemas.cracks import CrackAnalysisResponse

class CrackService:
    @classmethod
    async def analyze_crack_image(cls, file_bytes: bytes, element_type: str = "column") -> CrackAnalysisResponse:
        # 1. OpenCV Ingestion & Morphological Edge Detection
        img_bgr, img_meta = ComputerVisionService.validate_and_load_image(file_bytes)
        quality = ComputerVisionService.analyze_image_quality(img_bgr)
        cv_crack_metrics = ComputerVisionService.detect_crack_contours(img_bgr)

        # 2. Check for Multimodal LLM analysis
        ai_result = await MultimodalAIService.analyze_multimodal_image(file_bytes, prompt_type="crack")

        crack_detected = cv_crack_metrics["crack_detected"]
        limitations: List[str] = [
            "2D photography cannot determine subsurface crack propagation depth or internal rebar condition.",
            "Pixel dimensional estimates are uncalibrated (no physical metric scale target present in frame).",
            f"Image sharpness metric: {quality['blur_metric']}."
        ]

        if ai_result:
            crack_type = ai_result.get("crack_type", "Diagonal Shear Crack")
            severity = ai_result.get("severity_level", "Moderate")
            impact = ai_result.get("structural_impact", "Surface fracture detected along shear plane.")
            urgency = ai_result.get("repair_urgency", "Monitor Next Inspection Cycle")
            repair = ai_result.get("recommended_repair", "Surface sealant and ultrasonic pulse velocity verification.")
            confidence = float(ai_result.get("confidence", 0.92))
            method = "Multimodal Vision Analysis + OpenCV Canny Segmentation"
            limitations.extend(ai_result.get("limitations", []))
        else:
            if crack_detected:
                max_len_px = cv_crack_metrics["max_fracture_length_px"]
                max_ratio = cv_crack_metrics["max_aspect_ratio"]
                crack_type = "Diagonal Shear Crack" if max_ratio > 4.0 else "Surface Shrinkage Crack"
                severity = "Critical / High Structural Risk" if max_len_px > 250 else "Moderate"
                impact = f"OpenCV edge segmentation identified continuous linear fracture of {max_len_px}px with elongation ratio {max_ratio}."
                urgency = "Immediate (Within 48h)" if severity.startswith("Critical") else "Schedule NDT Inspection"
                repair = "Epoxy resin pressure injection per ACI 503.7 standard with carbon fiber composite (CFRP) wrap if shear rebar deficiency is suspected."
                confidence = 0.86
                method = "OpenCV Bilateral Canny & Morphological Contour Tracking (Multimodal LLM Key Unconfigured)"
                limitations.append("Cloud LLM API key not configured; dimensional metrics are purely relative pixel counts.")
            else:
                crack_type = "No Prominent Continuous Cracks Isolated"
                severity = "None Detected / Low"
                impact = "No continuous linear contours with aspect ratio exceeding 2.5 were isolated under current lighting."
                urgency = "Standard Routine Monitoring"
                repair = "No immediate structural remediation required. Maintain standard visual inspection cadence."
                confidence = 0.80
                method = "OpenCV Bilateral Canny & Morphological Contour Tracking"

        return CrackAnalysisResponse(
            id=f"CRK-{uuid.uuid4().hex[:8].upper()}",
            timestamp=datetime.now(timezone.utc).isoformat(),
            element_type=element_type,
            crack_detected=crack_detected,
            crack_type=crack_type,
            severity_level=severity,
            estimated_width_mm=None, # Explicitly None to prevent inventing uncalibrated physical dimensions
            estimated_length_cm=None,
            is_dimension_calibrated=False,
            structural_impact_analysis=impact,
            repair_urgency=urgency,
            recommended_repair_method=repair,
            detection_method=method,
            confidence=confidence,
            limitations=limitations
        )
