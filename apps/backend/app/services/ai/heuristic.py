from app.services.ai.base import BaseAIService
from typing import Dict, Any

class HeuristicAIService(BaseAIService):
    """
    Uma implementação baseada em Heurística/Regex de baixo custo.
    Útil para o MVP rodar em produção sem precisar de API Keys pagas imediatamente.
    """
    async def analyze_report(self, description: str) -> Dict[str, Any]:
        desc_lower = description.lower()
        
        category = "outros"
        priority = 0.3
        summary = description[:80] + "..." if len(description) > 80 else description

        if any(w in desc_lower for w in ["alagamento", "enchente", "chuva", "rio"]):
            category = "alagamento"
            priority = 0.8
        elif any(w in desc_lower for w in ["queda", "arvore", "poste", "fio"]):
            category = "obstaculo"
            priority = 0.6
        elif any(w in desc_lower for w in ["cratera", "buraco", "asfalto", "bueiro"]):
             category = "infraestrutura"
             priority = 0.5
        elif any(w in desc_lower for w in ["desabamento", "desmoronamento", "lama", "encosta"]):
             category = "desabamento"
             priority = 0.95

        return {
            "ai_category": category,
            "ai_summary": f"Relato sobre {category}: {summary}",
            "ai_priority_score": priority
        }
