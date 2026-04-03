"""
CLIP embedding backend for visual and text search.
Uses openai/clip-vit-base-patch32 + FAISS (clipy-search pattern).
Falls back to mock when transformers/torch/faiss not installed.
"""
from __future__ import annotations

import logging
from typing import Any, Callable

import numpy as np

logger = logging.getLogger(__name__)

_CLIP_AVAILABLE = False
_clip_model = None
_clip_processor = None
_faiss_index = None
_id_to_product: dict[int, dict[str, Any]] = {}
_embedding_dim = 512


def _ensure_clip() -> bool:
    global _CLIP_AVAILABLE, _clip_model, _clip_processor
    if _CLIP_AVAILABLE:
        return True
    try:
        import torch
        from transformers import CLIPModel, CLIPProcessor

        device = "cuda" if torch.cuda.is_available() else "cpu"
        _clip_processor = CLIPProcessor.from_pretrained("openai/clip-vit-base-patch32")
        _clip_model = CLIPModel.from_pretrained("openai/clip-vit-base-patch32").to(device)
        _clip_model.eval()
        _CLIP_AVAILABLE = True
        logger.info("CLIP model loaded on %s", device)
        return True
    except ImportError as e:
        logger.warning("CLIP not available (install ml deps): %s", e)
        return False


def _ensure_faiss() -> bool:
    try:
        import faiss  # noqa: F401
        return True
    except ImportError:
        return False


def encode_image(image_input: Any) -> list[float] | None:
    """
    Encode image to CLIP embedding.
    image_input: PIL Image, np.ndarray, or bytes.
    """
    if not _ensure_clip():
        return None
    import torch
    from PIL import Image
    from io import BytesIO

    if isinstance(image_input, bytes):
        image_input = Image.open(BytesIO(image_input)).convert("RGB")
    elif hasattr(image_input, "convert"):
        image_input = image_input.convert("RGB")

    device = next(_clip_model.parameters()).device
    inputs = _clip_processor(images=image_input, return_tensors="pt").to(device)
    with torch.no_grad():
        emb = _clip_model.get_image_features(**inputs)
        emb = emb / emb.norm(dim=-1, keepdim=True)
    return emb.cpu().numpy()[0].tolist()


def encode_text(text: str) -> list[float] | None:
    """Encode text to CLIP embedding."""
    if not _ensure_clip():
        return None
    import torch

    device = next(_clip_model.parameters()).device
    inputs = _clip_processor(text=[text], return_tensors="pt", padding=True).to(device)
    with torch.no_grad():
        emb = _clip_model.get_text_features(**inputs)
        emb = emb / emb.norm(dim=-1, keepdim=True)
    return emb.cpu().numpy()[0].tolist()


def get_dummy_embedding(dim: int = 512) -> list[float]:
    """Fallback when CLIP unavailable."""
    return np.random.rand(dim).astype(np.float32).tolist()


def clip_imports_available() -> bool:
    """True if ML deps exist; does not download or load model weights (fast path for health checks)."""
    if _CLIP_AVAILABLE:
        return True
    try:
        import importlib.util

        return importlib.util.find_spec("torch") is not None and importlib.util.find_spec(
            "transformers"
        ) is not None
    except Exception:
        return False


def is_clip_available() -> bool:
    """CLIP can be used: weights already loaded or torch+transformers are installed."""
    return clip_imports_available()


def build_faiss_index(
    products: list[dict[str, Any]],
    image_loader: Callable[[str], Any] | None = None,
) -> bool:
    """
    Build FAISS index from products.
    Each product: {id, image_url?, image_path?, text?, embedding?}
    If embedding present, use it. Else encode image or text.
    """
    global _faiss_index, _id_to_product, _embedding_dim
    if not _ensure_clip() or not _ensure_faiss():
        return False
    import faiss
    import torch
    from PIL import Image
    import httpx

    embeddings = []
    meta = []
    for p in products:
        emb = None
        if p.get("embedding"):
            emb = np.array(p["embedding"], dtype=np.float32)
        elif p.get("image_path"):
            try:
                img = Image.open(p["image_path"]).convert("RGB")
                emb = encode_image(img)
                if emb:
                    emb = np.array(emb, dtype=np.float32)
            except Exception as e:
                logger.warning("Could not load image %s: %s", p.get("image_path"), e)
        elif p.get("image_url") and p.get("image_url", "").startswith("http"):
            try:
                r = httpx.get(p["image_url"], timeout=10)
                r.raise_for_status()
                emb = encode_image(r.content)
                if emb:
                    emb = np.array(emb, dtype=np.float32)
            except Exception as e:
                logger.warning("Could not fetch image %s: %s", p.get("image_url"), e)
        elif p.get("text"):
            emb = encode_text(p["text"])
            if emb:
                emb = np.array(emb, dtype=np.float32)
        if emb is not None and len(emb) == _embedding_dim:
            embeddings.append(emb)
            meta.append(p)

    if not embeddings:
        return False
    mat = np.vstack(embeddings).astype(np.float32)
    faiss.normalize_L2(mat)
    _faiss_index = faiss.IndexFlatIP(mat.shape[1])
    _faiss_index.add(mat)
    _id_to_product = {i: meta[i] for i in range(len(meta))}
    logger.info("FAISS index built: %d vectors", len(meta))
    return True


def search_similar(
    query_embedding: list[float],
    top_k: int = 10,
) -> list[tuple[dict[str, Any], float]]:
    """
    Search FAISS index. Returns [(product, score), ...].
    Score is cosine similarity (dot product after L2 norm).
    """
    if not _ensure_faiss() or _faiss_index is None or not _id_to_product:
        return []
    import faiss

    q = np.array([query_embedding], dtype=np.float32)
    faiss.normalize_L2(q)
    scores, indices = _faiss_index.search(q, min(top_k, len(_id_to_product)))
    results = []
    for i, idx in enumerate(indices[0]):
        if idx >= 0 and idx in _id_to_product:
            results.append((_id_to_product[idx], float(scores[0][i])))
    return results


def get_index_size() -> int:
    return len(_id_to_product)


def get_index_info() -> dict[str, Any]:
    """Index status: size, clip_available, faiss_available."""
    return {
        "index_size": len(_id_to_product),
        "clip_available": _ensure_clip(),
        "faiss_available": _ensure_faiss(),
        "embedding_dim": _embedding_dim,
    }


def add_to_index(product_id: str, embedding: list[float], metadata: dict[str, Any] | None = None) -> bool:
    """
    Add single product to FAISS index. For incremental updates.
    Note: FAISS IndexFlatIP does not support add-after-build well for large scale;
    consider rebuild for bulk updates.
    """
    global _faiss_index, _id_to_product
    if not _ensure_faiss():
        return False
    import faiss

    emb = np.array([embedding], dtype=np.float32)
    if len(emb[0]) != _embedding_dim:
        return False
    faiss.normalize_L2(emb)
    p = {"product_id": product_id, **(metadata or {})}
    idx = len(_id_to_product)
    if _faiss_index is None:
        _faiss_index = faiss.IndexFlatIP(_embedding_dim)
    _faiss_index.add(emb)
    _id_to_product[idx] = p
    return True
