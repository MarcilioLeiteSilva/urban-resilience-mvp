from app.models.area import Area
from app.schemas.area import AreaCreate
from app.domains.areas.constants import (
    SCORE_THRESHOLD_HIGH,
    SCORE_THRESHOLD_MEDIUM,
    DEFAULT_INITIAL_SCORE,
    SCORE_BOOST_FLOOD_WORDS,
    SCORE_BOOST_LARGE_GEOM,
    VETOR_COUNT_LARGE_THRESHOLD
)

class RiskScoringService:
    @staticmethod
    def calculate_initial_risk(area: Area, obj_in: AreaCreate) -> dict:
        """
        Calcula o score e a categoria de risco inicial baseado em métricas simples de criação.
        """
        score = DEFAULT_INITIAL_SCORE
        
        # 1. Heurística baseada na descrição (procurando palavras de risco)
        description = (area.description or "").lower()
        keywords_risk = ["alagam", "inund", "chuva", "enchorr", "alagado"]
        
        if any(keyword in description for keyword in keywords_risk):
             score += SCORE_BOOST_FLOOD_WORDS
             
        # 2. Atributos geométricos simples (baseados na lista de coordenadas do GeoJSON)
        try:
            coords = obj_in.geometry.get("coordinates", [[]])
            # Se for Polygon, a primeira lista contém os pontos
            vertex_count = len(coords[0]) if coords else 0
        except Exception:
            vertex_count = 0
        if vertex_count > VETOR_COUNT_LARGE_THRESHOLD:
            score += SCORE_BOOST_LARGE_GEOM

        score = min(max(score, 0.0), 1.0)
        
        # 3. Classificação
        if score >= SCORE_THRESHOLD_HIGH:
            level = "HIGH"
        elif score >= SCORE_THRESHOLD_MEDIUM:
            level = "MEDIUM"
        else:
            level = "LOW"

        return {
            "score": score,
            "level": level
        }
