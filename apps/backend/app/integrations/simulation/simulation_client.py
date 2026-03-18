# Placeholder for predictive simulation engines (e.g., MiroFish)

class SimulationClient:
    def __init__(self, endpoint: str | None = None):
        self.endpoint = endpoint

    async def run_hydro_simulation(self, area_geojson: dict) -> dict:
        """Post area mesh and variables to remote calculation node for flood depth output"""
        return {"simulated_flooding": False, "score": 0.0, "vector_layers": []}
