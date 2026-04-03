"""
Visual similarity via CLIP + FAISS (Fashion-Image-Search-Engine pattern).
Image search and similar products.
"""
from typing import Any

from app.ai.embeddings.clip_backend import (
    encode_image,
    encode_text,
    get_dummy_embedding,
    search_similar,
    is_clip_available,
)


class VisualSimilarityService:
    """CLIP-based visual and semantic search for fashion products."""

    def __init__(self, embedding_dim: int = 512):
        self.embedding_dim = embedding_dim
        self._use_clip = is_clip_available()

    async def get_image_embedding(self, image_url: str) -> list[float]:
        """Generate CLIP embedding from image URL (fetches image)."""
        if not self._use_clip:
            return get_dummy_embedding(self.embedding_dim)
        try:
            import httpx
            async with httpx.AsyncClient() as client:
                r = await client.get(image_url, timeout=15)
            r.raise_for_status()
            emb = encode_image(r.content)
            return emb or get_dummy_embedding(self.embedding_dim)
        except Exception:
            return get_dummy_embedding(self.embedding_dim)

    async def find_similar_products(
        self,
        product_id: str,
        top_k: int = 10,
    ) -> list[dict[str, Any]]:
        """Find visually similar products. Uses index if built, else mock."""
        # If we had product embedding in DB, we'd fetch it here
        emb = get_dummy_embedding(self.embedding_dim)
        results = search_similar(emb, top_k)
        if results:
            return [
                {
                    "product_id": p.get("product_id", f"SIM-{i}"),
                    "score": round(score, 4),
                    "thumbnail": p.get("thumbnail", f"https://cdn.fashion-os.com/thumb/{i}.jpg"),
                }
                for (p, score), i in zip(results, range(top_k))
            ]
        return [
            {
                "product_id": f"SIM-{i}",
                "score": 0.98 - (i * 0.02),
                "thumbnail": f"https://cdn.fashion-os.com/thumb/{i}.jpg",
            }
            for i in range(top_k)
        ]

    async def find_similar_by_image(
        self,
        image_data: bytes,
        top_k: int = 10,
    ) -> list[dict[str, Any]]:
        """Search by uploaded image (CLIP image encoder)."""
        emb = encode_image(image_data) if self._use_clip else None
        if emb is None:
            emb = get_dummy_embedding(self.embedding_dim)
        results = search_similar(emb, top_k)
        if results:
            return [
                {
                    "product_id": p.get("product_id", f"VIS-{i}"),
                    "score": round(score, 4),
                }
                for (p, score), i in zip(results, range(top_k))
            ]
        return [
            {"product_id": f"VIS-{i}", "score": 0.95 - (i * 0.03)}
            for i in range(top_k)
        ]
