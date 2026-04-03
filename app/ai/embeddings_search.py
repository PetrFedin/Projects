"""Semantic search for RAG. Uses CLIP when available, fallback to keyword."""
from typing import Any

# Global doc store for persistence across requests (when FAISS not built)
_global_doc_store: list[dict[str, Any]] = []

from app.ai.embeddings.clip_backend import (
    encode_text,
    get_dummy_embedding,
    search_similar,
    build_faiss_index,
    add_to_index,
    is_clip_available,
)


class EmbeddingsSearch:
    """Semantic search for products, trends, docs. CLIP+FAISS or keyword fallback."""

    def __init__(self, vector_db: Any = None):
        self.vector_db = vector_db
        self._doc_store = _global_doc_store

    async def generate_embedding(self, text: str) -> list[float]:
        """Generate text embedding via CLIP or dummy."""
        emb = encode_text(text) if is_clip_available() else None
        return emb or get_dummy_embedding()

    async def search(self, query: str, top_k: int = 5) -> list[dict[str, Any]]:
        """Search by query. Uses FAISS if index built, else keyword match."""
        emb = await self.generate_embedding(query)
        results = search_similar(emb, top_k=top_k)
        if results:
            return [{"content": p.get("text", p.get("content", p.get("product_id", ""))), "score": round(s, 4)} for (p, s) in results]
        kw = set(w.lower() for w in query.split() if len(w) > 2)
        out = []
        for d in self._doc_store[:20]:
            doc_text = (d.get("text", "") + " " + d.get("content", "")).lower()
            overlap = sum(1 for w in kw if w in doc_text)
            if overlap > 0:
                out.append({"content": d.get("text", d.get("content", "")), "score": overlap / max(len(kw), 1)})
        return sorted(out, key=lambda x: -x["score"])[:top_k]

    async def add_documents(self, docs: list[dict[str, Any]]) -> bool:
        """Index docs. Uses FAISS when CLIP+FAISS available. Else keyword store."""
        global _global_doc_store
        products = []
        for d in docs:
            text = d.get("text", d.get("content", str(d)))
            products.append({"product_id": d.get("id", str(len(products))), "text": text})
        if build_faiss_index(products):
            _global_doc_store = products
            return True
        _global_doc_store.extend(products)
        return False
