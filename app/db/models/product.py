from datetime import datetime
from app.core.datetime_util import utc_now
from typing import Optional
from sqlalchemy import String, DateTime, JSON, Integer, Float, Boolean, ForeignKey
from sqlalchemy.orm import Mapped, mapped_column
from .base import Base

class MediaAsset(Base):
    __tablename__ = "media_assets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    asset_type: Mapped[str] = mapped_column(String, index=True)
    original_url: Mapped[str] = mapped_column(String)
    processed_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    has_background_removed: Mapped[bool] = mapped_column(Boolean, default=False)
    has_watermark: Mapped[bool] = mapped_column(Boolean, default=False)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class Linesheet(Base):
    __tablename__ = "linesheets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[str] = mapped_column(String, index=True)
    season: Mapped[str] = mapped_column(String, index=True)
    status: Mapped[str] = mapped_column(String, default="draft")
    sku_list_json: Mapped[dict] = mapped_column(JSON)
    pdf_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class Showroom(Base):
    __tablename__ = "showrooms"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String, index=True)
    slug: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    season_id: Mapped[Optional[str]] = mapped_column(String, nullable=True, index=True)
    is_public: Mapped[bool] = mapped_column(default=False)
    access_code: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    # Event microsites (RepSpark): type=event, dates, invite-only
    showroom_type: Mapped[str] = mapped_column(String, default="standard")  # standard, event
    event_start_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    event_end_date: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    invite_only: Mapped[bool] = mapped_column(default=False)
    vr_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    media_asset_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("media_assets.id"), nullable=True)
    linesheet_id: Mapped[Optional[int]] = mapped_column(Integer, ForeignKey("linesheets.id"), nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class ShowroomItem(Base):
    __tablename__ = "showroom_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    showroom_id: Mapped[int] = mapped_column(Integer, ForeignKey("showrooms.id"), index=True)
    product_name: Mapped[str] = mapped_column(String)
    sku: Mapped[str] = mapped_column(String, index=True)
    brand_name: Mapped[str] = mapped_column(String)
    color: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    size_range: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    wholesale_price: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="USD")

class LinesheetItem(Base):
    __tablename__ = "linesheet_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    linesheet_id: Mapped[int] = mapped_column(Integer, ForeignKey("linesheets.id"), index=True)
    product_name: Mapped[str] = mapped_column(String)
    sku: Mapped[str] = mapped_column(String, index=True)
    color: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    size_range: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    wholesale_price: Mapped[float] = mapped_column(Float, default=0.0)
    moq: Mapped[int] = mapped_column(Integer, default=1)

class Product3DAsset(Base):
    __tablename__ = "product_3d_assets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    clo3d_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    viewer_config_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    file_format: Mapped[str] = mapped_column(String, default="glb")

class GradingChart(Base):
    __tablename__ = "grading_charts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    base_size: Mapped[str] = mapped_column(String)
    # detailed measurements per size: {"S": {"chest": 50, "length": 70}, "M": {"chest": 52, "length": 72}, ...}
    measurements_per_size_json: Mapped[dict] = mapped_column(JSON)
    # increments relative to base size: {"chest": 2, "length": 2}
    increments_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    # tolerance for quality control: {"chest": 0.5, "length": 1.0}
    tolerance_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ConstructionDetail(Base):
    __tablename__ = "construction_details"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    seam_schemes_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    finishing_description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class DigitalSwatch(Base):
    __tablename__ = "digital_swatches"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_name: Mapped[str] = mapped_column(String, index=True)
    pantone_code: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    texture_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    hex_color: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class MaterialReservation(Base):
    __tablename__ = "material_reservations"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    reserved_quantity: Mapped[float] = mapped_column(Float)
    status: Mapped[str] = mapped_column(String, default="reserved")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MaterialLeftover(Base):
    __tablename__ = "material_leftovers"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    supplier_id: Mapped[str] = mapped_column(String, index=True)
    material_name: Mapped[str] = mapped_column(String)
    quantity: Mapped[float] = mapped_column(default=0.0)
    unit: Mapped[str] = mapped_column(String)
    price_per_unit: Mapped[float] = mapped_column(default=0.0)
    composition: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="available")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class Lookbook(Base):
    __tablename__ = "lookbooks"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[str] = mapped_column(String)
    season: Mapped[str] = mapped_column(String)
    items_json: Mapped[dict] = mapped_column(JSON)
    ai_story: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_published: Mapped[bool] = mapped_column(default=False)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class AIModelAsset(Base):
    __tablename__ = "ai_model_assets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    lookbook_id: Mapped[int] = mapped_column(Integer, index=True)
    image_url: Mapped[str] = mapped_column(String)
    asset_type: Mapped[str] = mapped_column(String)
    prompt_used: Mapped[str] = mapped_column(String)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)

class AIStudioAsset(Base):
    __tablename__ = "ai_studio_assets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    original_url: Mapped[str] = mapped_column(String)
    processed_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    task_type: Mapped[str] = mapped_column(String)
    status: Mapped[str] = mapped_column(String, default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SEOCopy(Base):
    __tablename__ = "seo_copies"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    language: Mapped[str] = mapped_column(String)
    tone_of_voice: Mapped[str] = mapped_column(String)
    content: Mapped[str] = mapped_column(String)
    meta_title: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    meta_description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class UGCPost(Base):
    __tablename__ = "ugc_posts"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    image_url: Mapped[str] = mapped_column(String)
    caption: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending")
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ProductLCA(Base):
    __tablename__ = "product_lca"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    carbon_footprint_kg: Mapped[float] = mapped_column(Float, default=0.0)
    water_usage_liters: Mapped[float] = mapped_column(Float, default=0.0)
    recycle_info_json: Mapped[dict] = mapped_column(JSON)
    sustainability_score: Mapped[float] = mapped_column(Float, default=0.0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class RawMaterialTrace(Base):
    __tablename__ = "raw_material_traces"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    material_id: Mapped[str] = mapped_column(String, index=True)
    origin_country: Mapped[str] = mapped_column(String)
    factory_id: Mapped[str] = mapped_column(String)
    blockchain_hash: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    certification_urls_json: Mapped[dict] = mapped_column(JSON)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class StyleDNA(Base):
    __tablename__ = "style_dna"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    color_type: Mapped[str] = mapped_column(String)
    silhouette: Mapped[str] = mapped_column(String)
    preferences_json: Mapped[dict] = mapped_column(JSON)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class DesignCopyright(Base):
    __tablename__ = "design_copyrights"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    design_id: Mapped[str] = mapped_column(String, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    blockchain_tx_hash: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[str] = mapped_column(String, default="pending")
    image_fingerprint: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    monitoring_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class HSCodeClassification(Base):
    __tablename__ = "hs_code_classifications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    hs_code: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String)
    confidence_score: Mapped[float] = mapped_column(default=0.0)
    country_context: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class WardrobeItem(Base):
    __tablename__ = "wardrobe_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    purchase_date: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    condition: Mapped[str] = mapped_column(String, default="new")
    last_worn_at: Mapped[Optional[datetime]] = mapped_column(DateTime, nullable=True)
    outfit_id: Mapped[Optional[int]] = mapped_column(Integer, nullable=True)

class LabelData(Base):
    __tablename__ = "label_data"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    barcode_ean13: Mapped[str] = mapped_column(String, unique=True)
    care_instructions: Mapped[str] = mapped_column(String)
    composition: Mapped[str] = mapped_column(String)
    size_label: Mapped[str] = mapped_column(String)

class ColorStory(Base):
    __tablename__ = "color_stories"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    collection_name: Mapped[str] = mapped_column(String)
    palette_json: Mapped[dict] = mapped_column(JSON)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class CircularItem(Base):
    __tablename__ = "circular_items"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    serial_number: Mapped[str] = mapped_column(String, unique=True, index=True)
    rental_count: Mapped[int] = mapped_column(Integer, default=0)
    current_condition: Mapped[str] = mapped_column(String, default="excellent")
    total_revenue_generated: Mapped[float] = mapped_column(Float, default=0.0)
    is_active: Mapped[bool] = mapped_column(default=True)

class CollectionDrop(Base):
    __tablename__ = "collection_drops"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    season: Mapped[str] = mapped_column(String)
    drop_name: Mapped[str] = mapped_column(String)
    scheduled_date: Mapped[datetime] = mapped_column(DateTime)
    sku_list_json: Mapped[dict] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String, default="planned")


class Assortment(Base):
    """Curated assortments for retail networks (NuOrder). Collection + retailers + size recommendations."""
    __tablename__ = "assortments"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    collection_id: Mapped[str] = mapped_column(String, index=True)
    name: Mapped[str] = mapped_column(String)
    retailer_ids: Mapped[dict] = mapped_column(JSON)  # ["RET-001", "RET-002"]
    sku_list_json: Mapped[dict] = mapped_column(JSON)  # [{sku_id, recommended_sizes: ["S","M","L"]}]
    status: Mapped[str] = mapped_column(String, default="draft")  # draft, active, delivered
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)


class FitCorrection(Base):
    __tablename__ = "fit_corrections"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    photo_url: Mapped[str] = mapped_column(String)
    pencil_marks_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    voice_note_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    comments: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class VirtualShowEvent(Base):
    __tablename__ = "virtual_show_events"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    title: Mapped[str] = mapped_column(String)
    scheduled_at: Mapped[datetime] = mapped_column(DateTime)
    streaming_url: Mapped[str] = mapped_column(String)
    preorder_skus_json: Mapped[dict] = mapped_column(JSON)
    status: Mapped[str] = mapped_column(String, default="upcoming")

class BodyScan(Base):
    __tablename__ = "body_scans"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    customer_id: Mapped[str] = mapped_column(String, index=True)
    height_cm: Mapped[float] = mapped_column(Float)
    chest_cm: Mapped[float] = mapped_column(Float)
    waist_cm: Mapped[float] = mapped_column(Float)
    hips_cm: Mapped[float] = mapped_column(Float)
    scan_url: Mapped[Optional[str]] = mapped_column(String, nullable=True) # Link to 3D model
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class UserWallet(Base):
    __tablename__ = "user_wallets"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    user_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    balance: Mapped[float] = mapped_column(Float, default=0.0)
    currency: Mapped[str] = mapped_column(String, default="RUB")
    bonus_points: Mapped[int] = mapped_column(Integer, default=0)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class WalletTransaction(Base):
    __tablename__ = "wallet_transactions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    wallet_id: Mapped[int] = mapped_column(Integer, index=True)
    amount: Mapped[float] = mapped_column(Float)
    transaction_type: Mapped[str] = mapped_column(String) # deposit, withdrawal, payment, cashback
    description: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class MerchandiseGrid(Base):
    __tablename__ = "merchandise_grids"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    brand_id: Mapped[str] = mapped_column(String, index=True)
    season: Mapped[str] = mapped_column(String)
    total_budget: Mapped[float] = mapped_column(Float)
    category_split_json: Mapped[dict] = mapped_column(JSON)
    target_units: Mapped[int] = mapped_column(Integer)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class DigitalProductPassport(Base):
    __tablename__ = "digital_product_passports"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    passport_uid: Mapped[str] = mapped_column(String, unique=True, index=True) # Unique identifier for QR/NFC
    composition_json: Mapped[dict] = mapped_column(JSON)
    origin_details_json: Mapped[dict] = mapped_column(JSON) # Factory, country, date
    sustainability_kpis_json: Mapped[dict] = mapped_column(JSON) # CO2, water, recycled %
    circularity_options_json: Mapped[dict] = mapped_column(JSON) # Rental, resell, recycle links
    blockchain_proof_url: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    is_active: Mapped[bool] = mapped_column(default=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    updated_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now, onupdate=utc_now)

class SustainabilityProof(Base):
    """Blockchain-ready event log for sustainability claims."""
    __tablename__ = "sustainability_proofs"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    entity_type: Mapped[str] = mapped_column(String, index=True) # batch, material, garment
    entity_id: Mapped[str] = mapped_column(String, index=True)
    event_type: Mapped[str] = mapped_column(String) # carbon_offset, chemical_audit, fair_wage_audit
    proof_hash: Mapped[str] = mapped_column(String, unique=True)
    blockchain_tx_id: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    metadata_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    timestamp: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class BillOfMaterials(Base):
    """Detailed components for a specific garment/SKU with size-dependent consumption."""
    __tablename__ = "bill_of_materials"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    # Generic materials: [{"item": "Brand Label", "qty": 1, "unit": "pc", "cost": 0.5}, ...]
    items_json: Mapped[dict] = mapped_column(JSON)
    # Size-dependent: {"S": {"Fabric": 1.4, "Lining": 1.2}, "XL": {"Fabric": 1.7, "Lining": 1.5}, ...}
    size_consumption_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    # Trims (button count can vary per size): {"S": {"Buttons": 6}, "XL": {"Buttons": 8}, ...}
    trims_per_size_json: Mapped[Optional[dict]] = mapped_column(JSON, nullable=True)
    total_material_cost: Mapped[float] = mapped_column(Float, default=0.0)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class TechPackVersion(Base):
    __tablename__ = "tech_pack_versions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    version_number: Mapped[str] = mapped_column(String)
    data_json: Mapped[dict] = mapped_column(JSON) # Full snapshot of tech pack data
    change_log: Mapped[str] = mapped_column(String)
    created_by: Mapped[str] = mapped_column(String)
    responsible_user_id: Mapped[Optional[str]] = mapped_column(String, ForeignKey("users.id"), nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
    is_approved: Mapped[bool] = mapped_column(Boolean, default=False)
    approved_by: Mapped[Optional[str]] = mapped_column(String, nullable=True)

class ProductDimension(Base):
    __tablename__ = "product_dimensions"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, unique=True, index=True)
    unit_weight_g: Mapped[float] = mapped_column(Float, default=0.0)
    folded_width_cm: Mapped[float] = mapped_column(Float, default=0.0)
    folded_length_cm: Mapped[float] = mapped_column(Float, default=0.0)
    folded_height_cm: Mapped[float] = mapped_column(Float, default=0.0)
    box_capacity_units: Mapped[int] = mapped_column(Integer, default=1) # How many units fit in a standard box
    hs_code: Mapped[Optional[str]] = mapped_column(String, nullable=True) # ТН ВЭД

class PackagingSpecification(Base):
    __tablename__ = "packaging_specifications"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    folding_instructions: Mapped[str] = mapped_column(String)
    hangtag_position: Mapped[str] = mapped_column(String)
    polybag_type: Mapped[str] = mapped_column(String)
    labeling_requirements_json: Mapped[dict] = mapped_column(JSON) # Positions for barcodes, QR codes, etc.
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class ProductionDocument(Base):
    """Storage link for Tech Packs, SOPs, and lab reports."""
    __tablename__ = "production_documents"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    organization_id: Mapped[str] = mapped_column(String, index=True)
    sku_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    batch_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    doc_type: Mapped[str] = mapped_column(String) # tech_pack, lab_report, contract, shipping_doc
    file_url: Mapped[str] = mapped_column(String)
    title: Mapped[str] = mapped_column(String)
    created_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)

class SKUProductionArchive(Base):
    """Historical record of all production runs for a SKU."""
    __tablename__ = "sku_production_archives"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    collection_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True)
    batch_id: Mapped[str] = mapped_column(String, index=True)
    planned_qty: Mapped[int] = mapped_column(Integer)
    actual_qty: Mapped[int] = mapped_column(Integer)
    defect_rate: Mapped[float] = mapped_column(Float)
    total_cost: Mapped[float] = mapped_column(Float)
    factory_id: Mapped[str] = mapped_column(String)
    produced_at: Mapped[datetime] = mapped_column(DateTime)
    
class SKUSalesSync(Base):
    """Sync of production batches with actual sales performance."""
    __tablename__ = "sku_sales_sync"
    id: Mapped[int] = mapped_column(Integer, primary_key=True, index=True)
    sku_id: Mapped[str] = mapped_column(String, index=True)
    batch_id: Mapped[str] = mapped_column(String, index=True)
    order_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True) # Linked B2B order
    store_id: Mapped[Optional[str]] = mapped_column(String, index=True, nullable=True) # Store that received it
    color: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    size: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    qty_shipped: Mapped[int] = mapped_column(Integer)
    qty_sold: Mapped[int] = mapped_column(Integer, default=0)
    sell_through_rate: Mapped[float] = mapped_column(Float, default=0.0)
    revenue_generated: Mapped[float] = mapped_column(Float, default=0.0)
    sync_source: Mapped[str] = mapped_column(String) # marketroom, outlet, external_pos
    last_synced_at: Mapped[datetime] = mapped_column(DateTime, default=utc_now)
