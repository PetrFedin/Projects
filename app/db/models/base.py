from sqlalchemy.orm import DeclarativeBase

class Base(DeclarativeBase):
    pass

# Import models here for backward compatibility and to ensure they are registered with Base
from .core import User, Organization, PlatformDispute, PlatformAnnouncement
from .order import (
    Order, CustomOrder, BOPISOrder, RentalOrder, 
    TransactionSplit, Invoice, PackingList, CreditMemo, 
    WholesaleMessage, OrderLog, B2BDiscount, WholesaleBNPL, 
    CustomsDeclaration, MOQSetting, Quote, RFQ, RFQVendorQuote, OrderItem
)
from .product import (
    MediaAsset, Linesheet, Showroom, Product3DAsset, 
    GradingChart, ConstructionDetail, DigitalSwatch, 
    MaterialReservation, MaterialLeftover, Lookbook, 
    AIModelAsset, AIStudioAsset, SEOCopy, UGCPost, 
    ProductLCA, RawMaterialTrace, StyleDNA, DesignCopyright, 
    HSCodeClassification, WardrobeItem, LabelData, ColorStory,
    CircularItem, CollectionDrop, Assortment, FitCorrection, VirtualShowEvent,
    BodyScan, UserWallet, WalletTransaction, MerchandiseGrid,
    DigitalProductPassport, SustainabilityProof, BillOfMaterials, ProductionDocument,
    TechPackVersion, ProductDimension, PackagingSpecification, ShowroomItem, LinesheetItem,
    SKUProductionArchive, SKUSalesSync
)
from .factory import (
    MachineTelemetry, NeedleCounter, ChemicalAudit, 
    ProductionMilestone, ProductionSchedule, PredictiveCapacity, 
    FactoryCapacityBooking, SupplyChainTA, QCChecklist, 
    ESGMetric, Supplier, MaterialOrder, LabDip, AISourcingMatch,
    SampleOrder, MachineMaintenance, ProductionBatch,
    StandardMinuteValue, QualityDefectMap, SubcontractorMovement,
    ProductionMessage, ProductionOperation, TechnicalSignOff, MachineSettingRegistry,
    ProductionStage, ProductionStageTemplate, QCInspectionDetailed, LogisticsPreShipment,
    DefectReport, StandardOperationMaster, MaterialMaster,
    SupplierScorecard, SupplierRFQ, SupplierRFQItem, SupplierOffer,
    ComplianceCertificate, SupplierContract, LetterOfCredit, AQLStandard,
    PaymentMilestone, SizeGridMaster, ColorLibrary,
    CuttingMarker, CuttingReport, OperationBreakdown, InlineQC, DefectRouting, ReworkRecord, BatchSourcingType,
    GradingSpec, MaterialVariant, PreProductionMeeting, SizeRunPlan, ColorStockPlan,
    SupplierAudit, MaterialSafetyStock, FactoryFallback, GoodsReceiptNote, LabDipRetest, FactoryLoadPlan,
    DefectTypeRegistry, CAPAAction, OperatorDefectStats,
    PPSSample, WearTest, BatchTraceability
)
from .finance import (
    FinanceBudget, AdvancedCosting, FactoringRequest, 
    CargoInsurance, BrandLiquidity, CreditLimit, 
    SeasonalCredit, InvestmentCampaign, InvestmentContribution,
    SubscriptionPlan, SmartContract, ContractExecutionLog,
    ProductionPaymentSchedule, CustomsPayment
)
from .inventory import (
    FabricRoll, RawMaterialTransaction, TollMaterialBalance,
    MaterialLot, FinishedGoodsStock, StockAllocation, MaterialConsumptionTrace,
    ProductionMaterialPlanning,
    MaterialAllowance, MaterialSubstitute, MaterialReorderPoint, CrossAllocation
)
from .retail import (
    StoreExpense, ReplenishmentRequest, StaffTraining, 
    StaffReward, FootfallMetric, ARNavigationNode, 
    StaffShift, ShiftSwapRequest, SalaryAdvance, 
    StaffLeaderboard, FittingRoomBooking, CategorySellThrough, 
    ReturnAnalysis, WishlistGroup, ReferralProgram, 
    GiftRegistry, BoxSubscription, VideoConsultation, 
    RepairRequest, CustomerFeedback, StoreInventory, POSTransaction, CustomerClienteling
)
from .intelligence import (
    Task, AgentState, FeatureProposal, CompetitorSignal, 
    GlobalLogisticsRisk, SupplyChainBottleneck, MarketExpansion, 
    ComplianceRequirement, AcademyModule, AcademyTest, 
    TestResult, AuditTrail, InventorySyncLog, DealerKPI, 
    QuotaAllocation, DigitalTwinFeedback, ContentGeneration, 
    DealerExclusivity, TaskStatus, TradeComplianceLog, EACCertificate,
    ChestnyZnakCode, EDODocument, BrandESGMetric, 
    LoyaltyProgram, CustomerLoyalty, BrandAsset, RegionalPerformance, 
    DemandForecast, SizeCurve, SupplyChainRisk, GlobalTaxReport, SanctionCheck,
    AgentFeedback,
)
from .marketing import (
    Influencer, InfluencerCampaign, CampaignROI, 
    InfluencerItemTrack, PRSampleReturn, CollaborationProject, 
    ProjectAccessControl
)
from .collaboration import TeamTask, Notification
from .auction import Auction, AuctionLot, AuctionBid
from .analytics import (
    DimProduct, DimSku, DimBrand, DimCategory, DimCollection, DimSeason,
    DimStore, DimRegion, DimSupplier, DimBuyer,
    FactSales, FactOrder, FactInventory, FactPurchase, FactReturn,
    SnapshotSellthrough, SnapshotInventory, SnapshotBudget, SnapshotAssortment,
    SnapshotCategoryPerformance, SnapshotBrandPerformance,
)

# Export all models at the module level for convenience
__all__ = [
    "Base", "User", "Organization", "Order", "CustomOrder", "BOPISOrder", "RentalOrder",
    "TransactionSplit", "Invoice", "PackingList", "CreditMemo", "WholesaleMessage",
    "OrderLog", "B2BDiscount", "WholesaleBNPL", "CustomsDeclaration", "MOQSetting", "Quote", "RFQ", "RFQVendorQuote",
    "MediaAsset", "Linesheet", "Showroom", "Product3DAsset", "GradingChart",
    "ConstructionDetail", "DigitalSwatch", "MaterialReservation", "MaterialLeftover",
    "Lookbook", "AIModelAsset", "AIStudioAsset", "SEOCopy", "UGCPost",
    "ProductLCA", "RawMaterialTrace", "StyleDNA", "DesignCopyright",
    "HSCodeClassification", "WardrobeItem", "LabelData", "ColorStory",
    "CircularItem", "CollectionDrop", "Assortment", "FitCorrection", "VirtualShowEvent", "BodyScan", "UserWallet", "WalletTransaction",
    "MachineTelemetry", "NeedleCounter", "ChemicalAudit", "ProductionMilestone",
    "ProductionSchedule", "PredictiveCapacity", "FactoryCapacityBooking",
    "SupplyChainTA", "QCChecklist", "ESGMetric", "Supplier", "MaterialOrder",
    "LabDip", "AISourcingMatch", "SampleOrder", "MachineMaintenance", "ProductionBatch",
    "FinanceBudget", "AdvancedCosting",
    "FactoringRequest", "CargoInsurance", "BrandLiquidity", "CreditLimit",
    "SeasonalCredit", "InvestmentCampaign", "InvestmentContribution", "SubscriptionPlan",
    "SmartContract", "ContractExecutionLog", "ProductionPaymentSchedule", "CustomsPayment",
    "FabricRoll", "RawMaterialTransaction", "TollMaterialBalance",
    "MaterialLot", "FinishedGoodsStock", "StockAllocation", "MaterialConsumptionTrace",
    "ProductionMaterialPlanning",
    "StoreExpense", "ReplenishmentRequest", "StaffTraining", "StaffReward",
    "FootfallMetric", "ARNavigationNode", "StaffShift", "ShiftSwapRequest",
    "SalaryAdvance", "StaffLeaderboard", "FittingRoomBooking", "CategorySellThrough",
    "ReturnAnalysis", "WishlistGroup", "ReferralProgram", "GiftRegistry",
    "BoxSubscription", "VideoConsultation", "RepairRequest", "CustomerFeedback", 
    "StoreInventory", "POSTransaction", "CustomerClienteling", "Task",
    "AgentState", "FeatureProposal", "CompetitorSignal", "GlobalLogisticsRisk",
    "SupplyChainBottleneck", "MarketExpansion", "ComplianceRequirement",
    "AcademyModule", "AcademyTest", "TestResult", "AuditTrail", "InventorySyncLog",
    "DealerKPI", "QuotaAllocation", "DigitalTwinFeedback", "ContentGeneration",
    "DealerExclusivity", "TaskStatus", "TradeComplianceLog", "EACCertificate", 
    "ChestnyZnakCode", "EDODocument", "BrandESGMetric", "RegionalPerformance", "DemandForecast", "SizeCurve", "SupplyChainRisk", "GlobalTaxReport", "SanctionCheck", "AgentFeedback",
    "Influencer", "InfluencerCampaign",
    "CampaignROI", "InfluencerItemTrack", "PRSampleReturn", "CollaborationProject",
    "ProjectAccessControl", "MerchandiseGrid", "TeamTask", "Notification",
    "DigitalProductPassport", "SustainabilityProof", "BillOfMaterials", "ProductionDocument",
    "TechPackVersion", "ProductDimension", "PackagingSpecification",
    "StandardMinuteValue", "QualityDefectMap", "SubcontractorMovement", "ProductionMessage",
    "ProductionOperation", "TechnicalSignOff", "MachineSettingRegistry",
    "ProductionStageTemplate", "ProductionStage", "QCInspectionDetailed", "LogisticsPreShipment",
    "ShowroomItem", "LinesheetItem", "OrderItem", "SKUProductionArchive", "SKUSalesSync",
    "SupplierScorecard", "SupplierRFQ", "SupplierRFQItem", "SupplierOffer",
    "ComplianceCertificate", "SupplierContract", "LetterOfCredit", "AQLStandard",
    "PaymentMilestone", "SizeGridMaster", "ColorLibrary",
    "CuttingMarker", "CuttingReport", "OperationBreakdown", "InlineQC", "DefectRouting", "ReworkRecord", "BatchSourcingType",
    "GradingSpec", "MaterialVariant", "PreProductionMeeting", "SizeRunPlan", "ColorStockPlan",
    "SupplierAudit", "MaterialSafetyStock", "FactoryFallback", "GoodsReceiptNote", "LabDipRetest", "FactoryLoadPlan",
    "DefectTypeRegistry", "CAPAAction", "OperatorDefectStats",
    "PPSSample", "WearTest", "BatchTraceability",
    "MaterialAllowance", "MaterialSubstitute", "MaterialReorderPoint", "CrossAllocation",
    "DimProduct", "DimSku", "DimBrand", "DimCategory", "DimCollection", "DimSeason",
    "DimStore", "DimRegion", "DimSupplier", "DimBuyer",
    "FactSales", "FactOrder", "FactInventory", "FactPurchase", "FactReturn",
    "SnapshotSellthrough", "SnapshotInventory", "SnapshotBudget", "SnapshotAssortment",
    "SnapshotCategoryPerformance", "SnapshotBrandPerformance",
    "Auction", "AuctionLot", "AuctionBid",
]
