"""
Virtual Try-On integration (opentryon / pbelevich pattern).
Hooks for garment transfer, background removal, pose estimation.
Production: requires GPU, opentryon or external API.

Eyewear (оправа по фото лица): в web-клиенте (`_ai-share/synth-1-full`) — MediaPipe Face Landmarker
и наложение PNG оправы (`/brand/virtual-tryon/glasses`), без этого сервиса.
"""
from typing import Any, Literal

ProviderType = Literal["opentryon", "pbelevich", "kling", "nova_canvas"]


class VirtualTryOnService:
    """Virtual try-on: garment on model. Stub with hooks for opentryon."""

    PROVIDERS = ["opentryon", "pbelevich", "kling", "nova_canvas"]

    async def try_on(
        self,
        garment_image_url: str,
        model_image_url: str,
        provider: str = "opentryon",
        output_format: str = "jpg",
    ) -> dict[str, Any]:
        """
        Generate virtual try-on: place garment on model.
        provider: opentryon | pbelevich | kling | nova_canvas
        output_format: jpg | png
        """
        p = provider if provider in self.PROVIDERS else "opentryon"
        return {
            "result_url": f"https://cdn.synth.io/tryon/placeholder_{p}.{output_format}",
            "status": "stub",
            "provider": p,
            "output_format": output_format,
            "message": "Install opentryon and GPU for production try-on",
        }

    async def remove_background(
        self, image_url: str, threshold: float = 0.5, output_format: str = "png"
    ) -> dict[str, Any]:
        """Background removal. threshold: 0–1 sensitivity. output_format: png|jpg."""
        fmt = output_format if output_format in ("png", "jpg") else "png"
        return {
            "result_url": image_url + f"?bg_removed=1&fmt={fmt}",
            "status": "stub",
            "threshold": threshold,
            "output_format": fmt,
        }

    async def segment_garment(
        self, image_url: str, include_mask: bool = True, types: list[str] | None = None
    ) -> dict[str, Any]:
        """Garment segmentation. include_mask: return mask URLs. types: filter segment types."""
        all_types = [{"type": "upper"}, {"type": "lower"}, {"type": "full"}]
        filtered = [t for t in all_types if types is None or t["type"] in types]
        if include_mask:
            filtered = [
                {**t, "mask_url": image_url + f"?mask={t['type']}"}
                for t in filtered
            ]
        return {"segments": filtered, "status": "stub"}
