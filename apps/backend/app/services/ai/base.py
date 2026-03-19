from abc import ABC, abstractmethod
from typing import Dict, Any

class BaseAIService(ABC):
    @abstractmethod
    async def analyze_report(self, description: str) -> Dict[str, Any]:
        """
        Analisa o texto do relato da comunidade.
        
        Retorna um dicionário estruturado:
        {
            "ai_category": str,      # ex: 'alagamento', 'desabamento', 'infraestrutura'
            "ai_summary": str,       # Resumo de 1 linha
            "ai_priority_score": float # 0.0 a 1.0 (sugestão de criticidade)
        }
        """
        pass
