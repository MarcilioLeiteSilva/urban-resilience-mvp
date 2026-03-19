from app.services.ai.base import BaseAIService
from app.services.ai.heuristic import HeuristicAIService

def get_ai_service() -> BaseAIService:
    """
    Factory que retorna a implementação de IA configurada.
    Aqui é fácil trocar para OpenAI, Anthropic, Gemini, etc. futuramente.
    """
    # Exemplo futuro: if settings.AI_PROVIDER == "openai": return OpenAIService(...)
    return HeuristicAIService()
