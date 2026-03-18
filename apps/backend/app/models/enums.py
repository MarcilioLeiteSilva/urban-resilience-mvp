from enum import Enum

class UserRole(str, Enum):
    ADMIN = "admin"
    ANALYST = "analyst"
    COMMUNITY_MEMBER = "community_member"

class IncidentType(str, Enum):
    FLOOD = "alagamento"
    LANDSLIDE = "deslizamento"
    STRUCTURAL_DAMAGE = "dano_estrutural"
    OTHER = "outro"

class IncidentSeverity(str, Enum):
    LOW = "baixo"
    MEDIUM = "medio"
    HIGH = "alto"
    CRITICAL = "critico"

class ReportStatus(str, Enum):
    OPEN = "aberto"
    INGESTING = "em_analise"
    VALIDATED = "validado"
    REJECTED = "rejeitado"
    RESOLVED = "resolvido"

class InterventionStatus(str, Enum):
    PLANNED = "planejado"
    IN_PROGRESS = "em_andamento"
    COMPLETED = "concluido"
    CANCELLED = "cancelado"
