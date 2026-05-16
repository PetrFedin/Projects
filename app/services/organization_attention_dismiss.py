"""Persist hub «Требует внимания» dismiss ids per organization (cross-device)."""

from __future__ import annotations

from typing import Any, Dict, List, Optional

from pydantic import BaseModel, ConfigDict, Field
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm.attributes import flag_modified

from app.db.models.base import Organization

ATTENTION_DISMISS_EMPTY: Dict[str, Any] = {
    "v": 1,
    "certificateIds": [],
    "profileIds": [],
    "taskIds": [],
    "integrationIssueIds": [],
}


class AttentionDismissMergeBody(BaseModel):
    model_config = ConfigDict(populate_by_name=True)

    certificate_ids: Optional[List[str]] = Field(default=None, alias="certificateIds")
    profile_ids: Optional[List[str]] = Field(default=None, alias="profileIds")
    task_ids: Optional[List[str]] = Field(default=None, alias="taskIds")
    integration_issue_ids: Optional[List[str]] = Field(default=None, alias="integrationIssueIds")


def _normalize_record(raw: Any) -> Dict[str, Any]:
    if not raw or not isinstance(raw, dict):
        return dict(ATTENTION_DISMISS_EMPTY)
    if raw.get("v") != 1:
        return dict(ATTENTION_DISMISS_EMPTY)
    out = dict(ATTENTION_DISMISS_EMPTY)
    for key in ("certificateIds", "profileIds", "taskIds", "integrationIssueIds"):
        arr = raw.get(key)
        if isinstance(arr, list):
            out[key] = sorted({str(x) for x in arr if isinstance(x, str) and x.strip()})
        else:
            out[key] = []
    return out


def _merge_ids(cur: List[str], incoming: Optional[List[str]]) -> List[str]:
    if not incoming:
        return cur
    clean = {str(x) for x in incoming if isinstance(x, str) and x.strip()}
    return sorted(set(cur) | clean)


async def get_attention_dismiss_for_brand(db: AsyncSession, brand_id: str) -> Dict[str, Any]:
    r = await db.execute(select(Organization).where(Organization.id == brand_id))
    org = r.scalar_one_or_none()
    if not org or org.attention_dismiss_json is None:
        return dict(ATTENTION_DISMISS_EMPTY)
    return _normalize_record(org.attention_dismiss_json)


async def merge_attention_dismiss_for_brand(
    db: AsyncSession, brand_id: str, body: AttentionDismissMergeBody
) -> Optional[Dict[str, Any]]:
    """Returns updated record or None if organization row missing."""
    r = await db.execute(select(Organization).where(Organization.id == brand_id))
    org = r.scalar_one_or_none()
    if org is None:
        return None
    cur = _normalize_record(org.attention_dismiss_json)
    cur["certificateIds"] = _merge_ids(cur["certificateIds"], body.certificate_ids)
    cur["profileIds"] = _merge_ids(cur["profileIds"], body.profile_ids)
    cur["taskIds"] = _merge_ids(cur["taskIds"], body.task_ids)
    cur["integrationIssueIds"] = _merge_ids(cur["integrationIssueIds"], body.integration_issue_ids)
    org.attention_dismiss_json = cur
    flag_modified(org, "attention_dismiss_json")
    await db.commit()
    await db.refresh(org)
    return cur
