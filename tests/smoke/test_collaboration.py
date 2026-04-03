import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_collaboration_task_workflow(client: AsyncClient, brand_token_headers):
    # 1. Create a task
    task_payload = {
        "title": "Review Prototype 1",
        "description": "Please check the seam quality on the first prototype of SKU-001",
        "assignee_id": "another-user-id",
        "priority": "high",
        "context_type": "sample",
        "context_id": "SMP-123"
    }
    response = await client.post("/api/v1/collaboration/tasks", json=task_payload, headers=brand_token_headers)
    assert response.status_code == 200
    task_id = response.json()["data"]["id"]
    
    # 2. Update task status
    update_payload = {"status": "in_progress"}
    response = await client.patch(f"/api/v1/collaboration/tasks/{task_id}/status", json=update_payload, headers=brand_token_headers)
    assert response.status_code == 200
    assert response.json()["data"]["status"] == "in_progress"

@pytest.mark.asyncio
async def test_collaboration_notifications(client: AsyncClient, brand_token_headers):
    # 1. Get unread notifications
    response = await client.get("/api/v1/collaboration/notifications/unread", headers=brand_token_headers)
    assert response.status_code == 200
    assert isinstance(response.json()["data"], list)
