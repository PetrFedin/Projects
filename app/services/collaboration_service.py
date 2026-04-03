from typing import List, Optional, Dict, Any
from app.core.datetime_util import utc_now
from sqlalchemy import select, and_, or_, update
from sqlalchemy.ext.asyncio import AsyncSession
from app.db.models.marketing import CollaborationProject, ProjectAccessControl
from app.db.models.collaboration import TeamTask, Notification
from app.db.models.base import User, Organization
from app.core.logging import logger

class CollaborationService:
    def __init__(self, db: AsyncSession, current_user: User):
        self.db = db
        self.current_user = current_user

    async def create_collaboration(
        self, 
        project_name: str, 
        partner_org_id: str, 
        sku_id: Optional[str] = None, 
        collection_id: Optional[str] = None,
        description: Optional[str] = None
    ) -> CollaborationProject:
        """Creates a new collaboration project between the current brand and a partner."""
        project = CollaborationProject(
            owner_brand_id=self.current_user.organization_id,
            partner_brand_id=partner_org_id,
            project_name=project_name,
            sku_id=sku_id,
            collection_id=collection_id,
            description=description,
            status="active",
            created_at=utc_now()
        )
        self.db.add(project)
        await self.db.commit()
        await self.db.refresh(project)
        
        # Grant default admin access to the owner organization
        owner_access = ProjectAccessControl(
            project_id=project.id,
            organization_id=self.current_user.organization_id,
            access_level="admin",
            resource_type="all",
            visibility_config={"enabled": True}
        )
        self.db.add(owner_access)
        await self.db.commit()
        
        return project

    async def set_partner_visibility(
        self, 
        project_id: int, 
        partner_org_id: str, 
        resource_type: str, 
        enabled: bool
    ) -> ProjectAccessControl:
        """Toggles what a partner can see at each stage (resource_type)."""
        stmt = select(ProjectAccessControl).filter_by(
            project_id=project_id, 
            organization_id=partner_org_id, 
            resource_type=resource_type
        )
        res = await self.db.execute(stmt)
        access = res.scalar_one_or_none()
        
        if not access:
            access = ProjectAccessControl(
                project_id=project_id,
                organization_id=partner_org_id,
                access_level="viewer",
                resource_type=resource_type,
                visibility_config={"enabled": enabled}
            )
            self.db.add(access)
        else:
            access.visibility_config = {"enabled": enabled}
            
        await self.db.commit()
        await self.db.refresh(access)
        return access

    async def get_my_collaborations(self) -> List[CollaborationProject]:
        org_id = self.current_user.organization_id
        stmt = select(CollaborationProject).filter(
            or_(
                CollaborationProject.owner_brand_id == org_id,
                CollaborationProject.partner_brand_id == org_id
            )
        )
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def create_task(self, data: Dict[str, Any]) -> TeamTask:
        task = TeamTask(
            organization_id=self.current_user.organization_id,
            creator_id=self.current_user.id,
            assignee_id=data.get("assignee_id"),
            title=data.get("title", "Untitled"),
            description=data.get("description"),
            priority=data.get("priority", "medium"),
            context_type=data.get("context_type"),
            context_id=data.get("context_id"),
        )
        self.db.add(task)
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def get_my_tasks(self) -> List[TeamTask]:
        stmt = select(TeamTask).where(
            TeamTask.organization_id == self.current_user.organization_id
        ).order_by(TeamTask.created_at.desc())
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def get_tasks_by_context(self, context_type: str, context_id: str) -> List[TeamTask]:
        stmt = select(TeamTask).where(
            TeamTask.context_type == context_type,
            TeamTask.context_id == context_id,
            TeamTask.organization_id == self.current_user.organization_id,
        )
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def update_task_status(self, task_id: int, status: str) -> Optional[TeamTask]:
        stmt = select(TeamTask).where(
            TeamTask.id == task_id,
            TeamTask.organization_id == self.current_user.organization_id,
        )
        res = await self.db.execute(stmt)
        task = res.scalar_one_or_none()
        if not task:
            return None
        task.status = status
        await self.db.commit()
        await self.db.refresh(task)
        return task

    async def get_unread_notifications(self) -> List[Notification]:
        stmt = select(Notification).where(
            Notification.user_id == self.current_user.id,
            Notification.is_read == False,
        ).order_by(Notification.created_at.desc())
        res = await self.db.execute(stmt)
        return list(res.scalars().all())

    async def mark_notification_as_read(self, notification_id: int) -> Optional[Notification]:
        stmt = select(Notification).where(
            Notification.id == notification_id,
            Notification.user_id == self.current_user.id,
        )
        res = await self.db.execute(stmt)
        notif = res.scalar_one_or_none()
        if not notif:
            return None
        notif.is_read = True
        await self.db.commit()
        await self.db.refresh(notif)
        return notif
