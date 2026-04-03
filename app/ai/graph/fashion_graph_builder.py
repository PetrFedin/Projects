from typing import List, Dict, Any

class FashionGraphBuilder:
    def __init__(self):
        self.nodes = []
        self.edges = []

    def build_brand_product_relationships(self, brand_id: str, product_ids: List[str]):
        for pid in product_ids:
            self.edges.append({"source": brand_id, "target": pid, "type": "OWNED_BY"})

    def build_style_similarities(self, product_id: str, similar_ids: List[str]):
        for sid in similar_ids:
            self.edges.append({"source": product_id, "target": sid, "type": "VISUALLY_SIMILAR"})

    def export_graph(self) -> Dict[str, Any]:
        return {"nodes": self.nodes, "edges": self.edges}
