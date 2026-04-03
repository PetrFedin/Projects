from typing import Dict, Any, List
import json

class DataIngestionService:
    def __init__(self):
        self.sources = ["catalog", "collections", "orders", "inventory", "brands", "buyers", "images"]

    async def collect_and_normalize(self, source: str, raw_data: Dict[str, Any]) -> Dict[str, Any]:
        """
        Collects raw data from platform systems and normalizes it for the AI layer.
        """
        if source not in self.sources:
            raise ValueError(f"Unknown data source: {source}")
        
        # Simple normalization logic mock
        normalized = {
            "source": source,
            "id": raw_data.get("id"),
            "timestamp": raw_data.get("created_at") or raw_data.get("timestamp"),
            "features": raw_data, # Simplified for example
            "status": "normalized"
        }
        
        print(f"Normalized data from {source}: {normalized.get('id')}")
        return normalized

    async def ingest_batch(self, source: str, data_batch: List[Dict[str, Any]]):
        for record in data_batch:
            await self.collect_and_normalize(source, record)
        print(f"Ingested batch of {len(data_batch)} records from {source}")
