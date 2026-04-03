from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List, Optional, Dict, Any
from app.api import deps
from app.db.models.base import User
from app.api.schemas.base import GenericResponse
from app.services.academy_service import AcademyService
from pydantic import BaseModel
from datetime import datetime

router = APIRouter()

class ModuleCreate(BaseModel):
    title: str
    content_url: str
    category: str
    brand_id: Optional[str] = None

class TestCreate(BaseModel):
    module_id: int
    questions_json: dict
    passing_score: int = 100

class TestResultSubmit(BaseModel):
    test_id: int
    score: int
    staff_id: Optional[str] = None

class ResultSubmit(BaseModel):
    staff_id: str
    test_id: int
    score: int
    is_passed: bool

@router.get("/modules", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_modules(
    limit: int = 100,
    category: Optional[str] = None,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    """category: filter modules by category."""
    service = AcademyService(db, current_user)
    modules = await service.get_available_modules()
    if category:
        modules = [m for m in modules if getattr(m, "category", None) == category]
    return GenericResponse(data=[{
        "id": m.id,
        "title": m.title,
        "content_url": m.content_url,
        "category": m.category,
        "is_active": m.is_active
    } for m in modules[:limit]])

@router.post("/modules", response_model=GenericResponse[Dict[str, Any]])
async def create_module(
    mod_in: ModuleCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = AcademyService(db, current_user)
    data = mod_in.model_dump()
    if not data.get("brand_id") and current_user.organization_id:
        data["brand_id"] = current_user.organization_id
    mod = await service.create_module(data)
    return GenericResponse(data={"id": mod.id, "status": "created"})

@router.post("/tests", response_model=GenericResponse[Dict[str, Any]])
async def create_test(
    test_in: TestCreate,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = AcademyService(db, current_user)
    test = await service.create_test(test_in.model_dump())
    return GenericResponse(data={"id": test.id})

@router.post("/results", response_model=GenericResponse[Dict[str, Any]])
async def submit_result(
    res_in: ResultSubmit,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = AcademyService(db, current_user)
    result = await service.submit_result_for_staff(
        staff_id=res_in.staff_id,
        test_id=res_in.test_id,
        score=res_in.score,
        is_passed=res_in.is_passed,
    )
    return GenericResponse(data={
        "id": result.id,
        "is_passed": result.is_passed,
        "score": result.score,
        "completed_at": result.completed_at,
    })

@router.get("/results/{staff_id}", response_model=GenericResponse[List[Dict[str, Any]]])
async def get_staff_results(
    staff_id: str,
    limit: int = 50,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = AcademyService(db, current_user)
    results = await service.get_staff_results(staff_id)
    return GenericResponse(data=[{
        "id": r.id,
        "test_id": r.test_id,
        "score": r.score,
        "is_passed": r.is_passed,
        "completed_at": r.completed_at,
    } for r in results[:limit]])

@router.post("/tests/submit", response_model=GenericResponse[Dict[str, Any]])
async def submit_test(
    res_in: TestResultSubmit,
    current_user: User = Depends(deps.get_current_active_user),
    db: AsyncSession = Depends(deps.get_db)
):
    service = AcademyService(db, current_user)
    try:
        result = await service.submit_test_result(res_in.test_id, res_in.score)
        return GenericResponse(data={
            "id": result.id,
            "is_passed": result.is_passed,
            "score": result.score,
            "completed_at": result.completed_at
        })
    except ValueError as e:
        raise HTTPException(status_code=404, detail=str(e))
