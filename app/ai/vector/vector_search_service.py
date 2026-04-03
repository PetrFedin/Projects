"""
Vector search using CLIP + FAISS (clipy-search pattern).
Falls back to mock when ML deps not installed.
"""
from typing import Any

from app.ai.embeddings.clip_backend import (
    encode_text,
    get_dummy_embedding,
    search_similar,
    add_to_index as _add_to_index,
    get_index_size,
    is_clip_available,
)


class VectorSearchService:
    """Semantic search via CLIP embeddings and FAISS."""

    def __init__(self):
        self._use_clip = is_clip_available()

    async def search_similar_products(
        self,
        embedding: list[float],
        top_k: int = 5,
    ) -> list[dict[str, Any]]:
        """Search for visually or semantically similar products."""
        results = search_similar(embedding, top_k=top_k)
        if results:
            return [
                {
                    "product_id": p.get("product_id", f"idx_{i}"),
                    "score": round(score, 4),
                    **{k: v for k, v in p.items() if k != "product_id"},
                }
                for (p, score), i in zip(results, range(top_k))
            ]
        # Mock fallback
        return [
            {"product_id": f"sim_{i}", "score": 0.99 - (i * 0.05)}
            for i in range(top_k)
        ]

    async def search_by_text(self, query: str, top_k: int = 5) -> list[dict[str, Any]]:
        """Search by text query using CLIP text encoder."""
        emb = encode_text(query) if self._use_clip else None
        if emb is None:
            emb = get_dummy_embedding()
        return await self.search_similar_products(emb, top_k)

    async def add_to_index(self, product_id: str, embedding: list[float], metadata: dict | None = None):
        """Add product embedding to FAISS index."""
        if _add_to_index(product_id, embedding, metadata):
            return
        # Mock fallback - just count
        _ = get_index_size()

    def get_dummy_embedding(self) -> list[float]:
        """Fallback embedding when CLIP unavailable."""
        return get_dummy_embedding()
