"""
Text style transfer (Styleformer pattern).
Converts product/lookbook descriptions between formal, casual, active, passive.
"""
from typing import Literal, List

StyleMode = Literal["formal", "casual", "active", "passive"]


class StyleTextService:
    """Style transfer for product descriptions. Uses Styleformer when available."""

    def __init__(self) -> None:
        self._sf_formal = self._sf_casual = None
        self._load_styleformer()

    def _load_styleformer(self) -> None:
        try:
            from styleformer import Styleformer
            self._sf_formal = Styleformer(style=0)  # casual -> formal
            self._sf_casual = Styleformer(style=1)  # formal -> casual
        except ImportError:
            self._sf_formal = self._sf_casual = None

    async def transform(
        self,
        text: str,
        target_style: StyleMode = "formal",
    ) -> str:
        """Transform text to target style (formal/casual/active/passive)."""
        if not text.strip():
            return text
        if self._sf_formal is None:
            return self._fallback_transform(text, target_style)
        try:
            sf = self._sf_formal if target_style == "formal" else self._sf_casual
            out = sf.transfer(text) if sf and target_style in ("formal", "casual") else text
            if target_style in ("active", "passive"):
                return self._fallback_transform(text, target_style)
            return out or text
        except Exception:
            return self._fallback_transform(text, target_style)

    async def transform_batch(
        self, texts: List[str], target_style: StyleMode = "formal"
    ) -> List[str]:
        """Transform multiple texts."""
        return [await self.transform(t, target_style) for t in texts]

    def _fallback_transform(self, text: str, target_style: StyleMode) -> str:
        """Fallback when Styleformer not installed."""
        if target_style == "formal":
            return text.replace("gonna", "going to").replace("wanna", "want to").replace("gotta", "have to")
        if target_style == "casual":
            return text.replace("going to", "gonna").replace("want to", "wanna").replace("have to", "gotta")
        if target_style == "active":
            return text.replace(" was created by ", " created ").replace(" was made by ", " made ")
        if target_style == "passive":
            return text.replace(" created ", " was created by ").replace(" made ", " was made by ")
        return text

    def list_styles(self) -> List[str]:
        return ["formal", "casual", "active", "passive"]
