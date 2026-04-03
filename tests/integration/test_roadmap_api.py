import pytest
from httpx import AsyncClient

@pytest.mark.asyncio
async def test_update_roadmap(client: AsyncClient):
    # Test updating roadmap
    resp = await client.post("/api/v1/product/update-roadmap")
    assert resp.status_code == 200
    res = resp.json()
    assert "Roadmap update suggested" in res["message"]
    assert "summary" in res
