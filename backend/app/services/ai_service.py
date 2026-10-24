import httpx
import base64
import json
import logging
from typing import Dict, Any, Optional, List
from ..config import settings

logger = logging.getLogger(__name__)

class MultimodalAIService:
    @staticmethod
    def is_configured() -> bool:
        if settings.AI_PROVIDER.lower() == "gemini":
            return bool(settings.GEMINI_API_KEY and settings.GEMINI_API_KEY.strip() != "your_gemini_api_key_here")
        elif settings.AI_PROVIDER.lower() == "openai":
            return bool(settings.OPENAI_API_KEY and settings.OPENAI_API_KEY.strip())
        return False

    @classmethod
    async def generate_chat_response(cls, user_message: str, context_topic: str = "construction_codes") -> Dict[str, Any]:
        """
        Sends query to the configured LLM. If unconfigured, returns documented setup guidance
        alongside authoritative engineering code references.
        """
        if not cls.is_configured():
            return {
                "configured": False,
                "answer": (
                    "The Multimodal LLM is not yet configured with an active API key on the backend. "
                    "To enable live generative reasoning, set GEMINI_API_KEY or OPENAI_API_KEY in your backend/.env file.\n\n"
                    "For immediate reference:\n"
                    "• OSHA 1926.1408 requires minimum 10 ft clearance for power lines under 50 kV.\n"
                    "• ACI 224R limits exterior concrete crack width to 0.30 mm.\n"
                    "• ACI 308R specifies continuous curing under high-evaporation wind conditions."
                ),
                "key_points": [
                    "Backend AI integration code is ready and waiting for API credentials.",
                    "Set GEMINI_API_KEY in backend/.env to activate live generative responses.",
                    "Engineering codes IBC, ACI, and OSHA are built into the platform system prompts."
                ],
                "standard_references": ["OSHA 1926", "ACI 224R-01", "ACI 318-19"],
                "recommendations": ["Add GEMINI_API_KEY in backend/.env", "Restart backend service"],
                "limitations": ["Live cloud model unconfigured; showing standard engineering references"],
                "model_used": "Offline Knowledge Engine (Pending API Key)"
            }

        # Live Gemini API call
        if settings.AI_PROVIDER.lower() == "gemini":
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.AI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
            system_instruction = (
                "You are an expert Civil & Structural Engineer AI Assistant for BuildIntel. "
                "Provide precise technical answers citing relevant standards (IBC, OSHA 1926, ACI 318, ACI 224R, AISC 360). "
                "Format response as structured JSON with keys: answer (string), key_points (list of strings), "
                "standard_references (list of strings), recommendations (list of strings), limitations (list of strings)."
            )
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": f"{system_instruction}\n\nUser Question ({context_topic}): {user_message}"}
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.2,
                    "responseMimeType": "application/json"
                }
            }

            try:
                async with httpx.AsyncClient(timeout=25.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                        parsed = json.loads(text_content)
                        parsed["configured"] = True
                        parsed["model_used"] = settings.AI_MODEL
                        return parsed
                    else:
                        logger.error(f"Gemini API error {resp.status_code}: {resp.text}")
                        return {
                            "configured": True,
                            "answer": f"API Provider responded with status {resp.status_code}. Please check API quotas or key permissions.",
                            "key_points": ["Provider error encountered"],
                            "standard_references": [],
                            "recommendations": ["Verify API quota in Google AI Studio"],
                            "limitations": [resp.text[:120]],
                            "model_used": settings.AI_MODEL
                        }
            except Exception as e:
                logger.error(f"Exception calling Gemini: {e}")
                return {
                    "configured": True,
                    "answer": f"Network exception communicating with AI provider: {str(e)}",
                    "key_points": ["Network error"],
                    "standard_references": [],
                    "recommendations": ["Verify server internet connectivity"],
                    "limitations": [str(e)],
                    "model_used": settings.AI_MODEL
                }

        return {
            "configured": False,
            "answer": "Configured provider is not recognized. Please use 'gemini' or 'openai'.",
            "key_points": [],
            "standard_references": [],
            "recommendations": [],
            "limitations": [],
            "model_used": "None"
        }

    @classmethod
    async def analyze_multimodal_image(cls, image_bytes: bytes, prompt_type: str = "safety") -> Optional[Dict[str, Any]]:
        """
        Sends image and analysis instructions to Multimodal LLM when configured.
        Returns None if API key is not configured.
        """
        if not cls.is_configured():
            return None

        b64_image = base64.b64encode(image_bytes).decode("utf-8")

        if prompt_type == "safety":
            prompt_text = (
                "Analyze this construction site photo for worker safety and hazard compliance. "
                "Detect visible workers, check PPE (hard hats, high-vis vests, harnesses), identify perimeter hazards, "
                "and heavy equipment boundaries. "
                "Respond in JSON with schema:\n"
                "{\n"
                "  \"total_workers\": int,\n"
                "  \"ppe_compliant_workers\": int,\n"
                "  \"ppe_violations\": int,\n"
                "  \"hazards_count\": int,\n"
                "  \"safety_score\": float,\n"
                "  \"detections\": [{\"label\": string, \"category\": string, \"confidence\": float, \"notes\": string}],\n"
                "  \"recommendations\": [string],\n"
                "  \"limitations\": [string]\n"
                "}"
            )
        else: # crack
            prompt_text = (
                "Analyze this structural surface photo for concrete defects and cracks. "
                "Classify crack type (shear, hairline shrinkage, flexural), estimate severity according to ACI 224R, "
                "structural impact, and recommended remediation. "
                "Respond in JSON with schema:\n"
                "{\n"
                "  \"crack_detected\": bool,\n"
                "  \"crack_type\": string,\n"
                "  \"severity_level\": string,\n"
                "  \"structural_impact\": string,\n"
                "  \"repair_urgency\": string,\n"
                "  \"recommended_repair\": string,\n"
                "  \"confidence\": float,\n"
                "  \"limitations\": [string]\n"
                "}"
            )

        if settings.AI_PROVIDER.lower() == "gemini":
            url = f"https://generativelanguage.googleapis.com/v1beta/models/{settings.AI_MODEL}:generateContent?key={settings.GEMINI_API_KEY}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt_text},
                            {
                                "inline_data": {
                                    "mime_type": "image/jpeg",
                                    "data": b64_image
                                }
                            }
                        ]
                    }
                ],
                "generationConfig": {
                    "temperature": 0.1,
                    "responseMimeType": "application/json"
                }
            }

            try:
                async with httpx.AsyncClient(timeout=35.0) as client:
                    resp = await client.post(url, json=payload)
                    if resp.status_code == 200:
                        data = resp.json()
                        text_content = data["candidates"][0]["content"]["parts"][0]["text"]
                        return json.loads(text_content)
            except Exception as e:
                logger.error(f"Error in multimodal image inference: {e}")
                return None

        return None
