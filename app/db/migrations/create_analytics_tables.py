"""
Create only analytics layer tables (analytics_*).
Safe to run multiple times; does not alter or drop existing tables.
Run: python -m app.db.migrations.create_analytics_tables
"""
import asyncio
from app.db.session import engine
from app.db.models.analytics import (
    DimProduct, DimSku, DimBrand, DimCategory, DimCollection, DimSeason,
    DimStore, DimRegion, DimSupplier, DimBuyer,
    FactSales, FactOrder, FactInventory, FactPurchase, FactReturn,
    SnapshotSellthrough, SnapshotInventory, SnapshotBudget, SnapshotAssortment,
    SnapshotCategoryPerformance, SnapshotBrandPerformance,
)

ANALYTICS_TABLES = [
    DimProduct.__table__, DimSku.__table__, DimBrand.__table__, DimCategory.__table__,
    DimCollection.__table__, DimSeason.__table__, DimStore.__table__, DimRegion.__table__,
    DimSupplier.__table__, DimBuyer.__table__,
    FactSales.__table__, FactOrder.__table__, FactInventory.__table__,
    FactPurchase.__table__, FactReturn.__table__,
    SnapshotSellthrough.__table__, SnapshotInventory.__table__, SnapshotBudget.__table__,
    SnapshotAssortment.__table__, SnapshotCategoryPerformance.__table__,
    SnapshotBrandPerformance.__table__,
]


async def create_analytics_tables():
    async with engine.begin() as conn:
        for table in ANALYTICS_TABLES:
            await conn.run_sync(lambda c, t=table: t.create(c, checkfirst=True))
            print(f"Created table: {table.name}")


def run():
    asyncio.run(create_analytics_tables())
    print("Analytics tables created.")


if __name__ == "__main__":
    run()
