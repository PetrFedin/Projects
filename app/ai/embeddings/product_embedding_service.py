"""Product embeddings via CLIP. Uses clip_backend when ML deps installed."""
from typing import List

from app.ai.embeddings.clip_backend import (
    encode_image,
    encode_text,
    get_dummy_embedding,
    search_similar,
    is_clip_available,
)


class ProductEmbeddingService:
    def __init__(self):
        self.embedding_dim = 512
        self._use_clip = is_clip_available()

    def get_image_embedding(self, image_url: str) -> List[float]:
        if not self._use_clip:
            return get_dummy_embedding(self.embedding_dim)
        import httpx
        r = httpx.get(image_url, timeout=15)
        r.raise_for_status()
        emb = encode_image(r.content)
        return emb or get_dummy_embedding(self.embedding_dim)

    def get_text_embedding(self, description: str) -> List[float]:
        emb = encode_text(description) if self._use_clip else None
        return emb or get_dummy_embedding(self.embedding_dim)

    async def find_similar_products(self, product_id: str, top_k: int = 5) -> List[str]:
        emb = get_dummy_embedding(self.embedding_dim)
        results = search_similar(emb, top_k)
        return [p.get("product_id", f"similar_{i}") for (p, _), i in zip(results, range(top_k))] if results else [f"similar_{i}" for i in range(top_k)]
