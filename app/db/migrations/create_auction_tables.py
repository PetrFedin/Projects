"""
Create auction tables (auctions, auction_lots, auction_bids).
Run: python -m app.db.migrations.create_auction_tables
"""
import asyncio
from app.db.session import engine
from app.db.models.auction import Auction, AuctionLot, AuctionBid

AUCTION_TABLES = [Auction.__table__, AuctionLot.__table__, AuctionBid.__table__]


async def create_auction_tables():
    async with engine.begin() as conn:
        for table in AUCTION_TABLES:
            await conn.run_sync(lambda c, t=table: t.create(c, checkfirst=True))
            print(f"Created table: {table.name}")


def run():
    asyncio.run(create_auction_tables())
    print("Auction tables created.")


if __name__ == "__main__":
    run()
