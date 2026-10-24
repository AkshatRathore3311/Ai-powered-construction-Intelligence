import cv2
import numpy as np
from typing import Dict, Any, Tuple, List, Optional
import io
from PIL import Image

class ComputerVisionService:
    @staticmethod
    def validate_and_load_image(file_bytes: bytes, max_size_bytes: int = 15 * 1024 * 1024) -> Tuple[np.ndarray, Dict[str, Any]]:
        """
        Validates file size, file headers, and loads into an OpenCV BGR numpy array safely.
        """
        if len(file_bytes) > max_size_bytes:
            raise ValueError(f"File size exceeds maximum allowed limit ({max_size_bytes // (1024*1024)}MB)")

        # Verify image using PIL first to avoid malformed header exploits
        try:
            pil_img = Image.open(io.BytesIO(file_bytes))
            pil_img.verify()
            format_name = pil_img.format
        except Exception as e:
            raise ValueError(f"Invalid image format or corrupted file: {str(e)}")

        # Convert bytes to numpy array and decode with OpenCV
        nparr = np.frombuffer(file_bytes, np.uint8)
        img_bgr = cv2.imdecode(nparr, cv2.IMREAD_COLOR)
        if img_bgr is None:
            raise ValueError("OpenCV failed to decode image data into raster pixels.")

        height, width, channels = img_bgr.shape
        metadata = {
            "format": format_name,
            "width_px": width,
            "height_px": height,
            "channels": channels,
            "size_kb": round(len(file_bytes) / 1024, 2),
        }
        return img_bgr, metadata

    @staticmethod
    def analyze_image_quality(img_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Computes brightness, contrast, and blurriness using Laplacian variance.
        """
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        blur_score = cv2.Laplacian(gray, cv2.CV_64F).var()
        brightness = float(np.mean(gray))
        contrast = float(np.std(gray))

        is_blurry = blur_score < 100.0
        return {
            "blur_metric": round(blur_score, 2),
            "is_sharp_enough_for_inspection": not is_blurry,
            "mean_brightness": round(brightness, 1),
            "contrast_level": round(contrast, 1),
            "quality_assessment": "Good" if not is_blurry and 40 < brightness < 220 else "Sub-optimal Lighting/Focus"
        }

    @classmethod
    def detect_crack_contours(cls, img_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Uses OpenCV Canny edge detection, bilateral filtering, and morphological
        transforms to detect structural fracture contours and estimate dimensional vectors.
        """
        gray = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2GRAY)
        
        # Bilateral filter reduces surface noise while preserving sharp crack edges
        filtered = cv2.bilateralFilter(gray, d=7, sigmaColor=50, sigmaSpace=50)
        
        # Adaptive thresholding and Canny
        edges = cv2.Canny(filtered, threshold1=40, threshold2=130)
        
        # Morphological closing to connect adjacent crack micro-segments
        kernel = cv2.getStructuringElement(cv2.MORPH_RECT, (3, 3))
        closed_edges = cv2.morphologyEx(edges, cv2.MORPH_CLOSE, kernel)
        
        contours, _ = cv2.findContours(closed_edges, cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_SIMPLE)
        
        crack_candidates = []
        total_crack_pixels = 0
        max_aspect_ratio = 1.0
        max_length_px = 0.0

        for cnt in contours:
            area = cv2.contourArea(cnt)
            perimeter = cv2.arcLength(cnt, False)
            if perimeter > 40 and area > 10:
                rect = cv2.minAreaRect(cnt)
                (w, h) = rect[1]
                if min(w, h) > 0:
                    aspect_ratio = max(w, h) / min(w, h)
                    # Cracks typically have high aspect ratios (> 3.0)
                    if aspect_ratio >= 2.5:
                        total_crack_pixels += area
                        candidate_len = max(w, h)
                        if candidate_len > max_length_px:
                            max_length_px = candidate_len
                            max_aspect_ratio = aspect_ratio
                        crack_candidates.append({
                            "length_px": round(candidate_len, 1),
                            "estimated_width_px": round(min(w, h), 1),
                            "aspect_ratio": round(aspect_ratio, 2)
                        })

        crack_detected = len(crack_candidates) > 0
        return {
            "crack_detected": crack_detected,
            "detected_contour_count": len(crack_candidates),
            "max_fracture_length_px": round(max_length_px, 1),
            "max_aspect_ratio": round(max_aspect_ratio, 2),
            "crack_candidates": crack_candidates[:5]
        }

    @classmethod
    def detect_safety_color_signatures(cls, img_bgr: np.ndarray) -> Dict[str, Any]:
        """
        Analyzes HSV color spectrum for high-visibility PPE safety colors
        (fluorescent green/yellow vests, OSHA safety orange, and safety helmet tones).
        """
        hsv = cv2.cvtColor(img_bgr, cv2.COLOR_BGR2HSV)
        
        # High-visibility neon yellow/green mask
        lower_neon = np.array([22, 90, 90])
        upper_neon = np.array([42, 255, 255])
        neon_mask = cv2.inRange(hsv, lower_neon, upper_neon)
        
        # High-visibility orange mask
        lower_orange = np.array([5, 120, 120])
        upper_orange = np.array([18, 255, 255])
        orange_mask = cv2.inRange(hsv, lower_orange, upper_orange)
        
        combined_ppe_mask = cv2.bitwise_or(neon_mask, orange_mask)
        total_pixels = img_bgr.shape[0] * img_bgr.shape[1]
        ppe_pixels = cv2.countNonZero(combined_ppe_mask)
        ppe_coverage_ratio = ppe_pixels / total_pixels

        return {
            "high_vis_coverage_ratio": round(ppe_coverage_ratio, 4),
            "safety_color_clusters_found": ppe_pixels > 250,
            "neon_yellow_detected": cv2.countNonZero(neon_mask) > 150,
            "safety_orange_detected": cv2.countNonZero(orange_mask) > 150
        }
