import uuid
from datetime import datetime, timezone
from fastapi import APIRouter, HTTPException, status
from ..schemas.assistant import ChatRequest, ChatResponse
from ..services.ai_service import MultimodalAIService

router = APIRouter(prefix="/api/assistant", tags=["Construction Knowledge Assistant"])

@router.post("/chat", response_model=ChatResponse, status_code=status.HTTP_200_OK)
async def chat_with_knowledge_assistant(req: ChatRequest):
    try:
        ai_data = await MultimodalAIService.generate_chat_response(
            user_message=req.message,
            context_topic=req.context_topic or "construction_codes"
        )

        return ChatResponse(
            id=f"AST-{uuid.uuid4().hex[:8].upper()}",
            timestamp=datetime.now(timezone.utc).isoformat(),
            answer=ai_data.get("answer", "Response generated."),
            key_points=ai_data.get("key_points", []),
            standard_references=ai_data.get("standard_references", []),
            recommendations=ai_data.get("recommendations", []),
            limitations=ai_data.get("limitations", []),
            model_used=ai_data.get("model_used", "Standard Knowledge Engine")
        )
    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Knowledge assistant communication error: {str(e)}"
        )
