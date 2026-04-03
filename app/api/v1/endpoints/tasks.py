from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from typing import List
from app.db.session import get_db
from app.db.repositories.task import TaskRepository
from app.api.schemas.task import Task, TaskCreate, TaskUpdate
from app.db.models.base import Task as TaskModel

router = APIRouter()

@router.get("/", response_model=List[Task])
async def get_tasks(skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)):
    repo = TaskRepository(db)
    return await repo.get_all(skip=skip, limit=limit)

@router.post("/", response_model=Task, status_code=status.HTTP_201_CREATED)
async def create_task(task_in: TaskCreate, db: AsyncSession = Depends(get_db)):
    repo = TaskRepository(db)
    existing = await repo.get_by_task_id(task_in.task_id)
    if existing:
        raise HTTPException(status_code=400, detail="Task ID already exists")
    
    new_task = TaskModel(**task_in.model_dump())
    return await repo.create(new_task)

@router.get("/{task_id}", response_model=Task)
async def get_task(task_id: str, db: AsyncSession = Depends(get_db)):
    repo = TaskRepository(db)
    task = await repo.get_by_task_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    return task

@router.patch("/{task_id}", response_model=Task)
async def update_task(task_id: str, task_update: TaskUpdate, db: AsyncSession = Depends(get_db)):
    repo = TaskRepository(db)
    task = await repo.get_by_task_id(task_id)
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    update_data = task_update.model_dump(exclude_unset=True)
    # Since BaseRepository.update uses integer ID, we use the internal ID
    return await repo.update(task.id, **update_data)
