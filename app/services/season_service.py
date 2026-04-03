from typing import List, Dict, Any, Optional
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select
from app.db.models.intelligence import Task
from datetime import datetime, timedelta
from app.core.datetime_util import utc_now

class SeasonService:
    def __init__(self, db: AsyncSession):
        self.db = db

    async def generate_default_timeline(self, season_id: str, start_date: datetime) -> List[Dict[str, Any]]:
        """
        Generates a standard fashion industry timeline for a new season.
        Uses milestones common in wholesale and production workflows.
        """
        milestones = [
            {"name": "Collection Concept Ready", "days": 0},
            {"name": "Design Freeze", "days": 30},
            {"name": "Sample Development Start", "days": 45},
            {"name": "Salesman Samples Ready", "days": 90},
            {"name": "Wholesale Showroom Launch", "days": 105},
            {"name": "Order Deadline", "days": 150},
            {"name": "Production Start", "days": 180},
            {"name": "Shipment to Retail", "days": 240}
        ]
        
        results = []
        for m in milestones:
            due = start_date + timedelta(days=m["days"])
            results.append({
                "milestone": m["name"],
                "due_date": due,
                "status": "planned" if due > utc_now() else "delayed"
            })
            
        return results

    async def create_season_tasks(self, season_id: str, milestones: List[Dict[str, Any]], organization_id: str):
        """
        Populates the Task table with milestones for the new season.
        """
        for m in milestones:
            task = Task(
                organization_id=organization_id,
                task_id=f"{season_id}_{m['milestone'].replace(' ', '_').lower()}",
                module="wholesale",
                task_type="milestone",
                purpose=m["milestone"],
                status="todo",
                priority=2,
                metadata_json={"season_id": season_id, "due_date": m["due_date"].isoformat()}
            )
            self.db.add(task)
        
        await self.db.commit()
