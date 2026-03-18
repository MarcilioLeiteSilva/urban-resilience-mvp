# Placeholder for external Weather integrations (e.g., INMET, OpenWeather)

class WeatherClient:
    def __init__(self, api_key: str | None = None):
        self.api_key = api_key

    async def get_current_rainfall(self, lat: float, lon: float) -> dict:
        """Fetch rainfall amounts for coordinates (mm)"""
        # Integrate with real APIs here
        return {"rainfall_mm": 0.0, "status": "no_data"}
