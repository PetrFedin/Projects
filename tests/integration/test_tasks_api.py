import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_create_and_get_task(client: AsyncClient):
    # Create
    response = await client.post(
        "/api/v1/tasks/",
        json={
            "task_id": "T-101",
            "module": "infra",
            "task_type": "test",
            "purpose": "Integration test"
        }
    )
    assert response.status_code == 201
    data = response.json()
    assert data["task_id"] == "T-101"
    
    # Get list
    response = await client.get("/api/v1/tasks/")
    assert response.status_code == 200
    assert len(response.json()) == 1
    
    # Get by task_id
    response = await client.get("/api/v1/tasks/T-101")
    assert response.status_code == 200
    assert response.json()["purpose"] == "Integration test"

@pytest.mark.asyncio
async def test_update_task(client):
    # Create
    await client.post(
        "/api/v1/tasks/",
        json={
            "task_id": "T-102",
            "module": "infra",
            "task_type": "test",
            "purpose": "To be updated"
        }
    )
    
    # Update
    response = await client.patch(
        "/api/v1/tasks/T-102",
        json={"status": "done", "purpose": "Updated purpose"}
    )
    assert response.status_code == 200
    data = response.json()
    assert data["status"] == "done"
    assert data["purpose"] == "Updated purpose"
