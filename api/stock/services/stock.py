import logging
from typing import Any

import requests
from fastapi import Depends
from pydantic import parse_obj_as

from stock.models.trade import Stock
from stock.repositories.stock import StockRepository
from stock.schemas.stock import StockCreate, StockInDB, StockUpdate

logger = logging.getLogger("services.stock")


class StockCRUD:
    def __init__(self, stock_repository=Depends(StockRepository)) -> None:
        self.stock_repository: StockRepository = stock_repository

    def list_stocks(self) -> list[StockInDB]:
        return parse_obj_as(list[StockInDB], self.stock_repository.list_stocks())

    def get_stock(self, id: int) -> StockInDB:
        return StockInDB.from_orm(self.stock_repository.get_stock(id))

    def create_stock(self, stock_create: StockCreate) -> StockInDB:
        stock = self.stock_repository.create_stock(Stock(**stock_create.dict()))
        return StockInDB.from_orm(stock)

    def update_stock(self, id: int, stock_update: StockUpdate) -> StockInDB:
        updates = {k: v for k, v in stock_update.dict().items() if v is not None}
        logger.debug("attrs %s", updates)
        stock = self.stock_repository.update_stock(id, updates)
        return StockInDB.from_orm(stock)

    def delete_stock(self, id: int) -> None:
        self.stock_repository.delete_stock(id)

    def exists(self, id: int) -> bool:
        return self.stock_repository.exists(id)


class StockService:
    def __init__(self, stock_crud=Depends(StockCRUD)) -> None:
        self.stock_crud: StockCRUD = stock_crud

    def importStocks(self) -> int:
        # source https://www.nasdaq.com/market-activity/stocks/screener
        # curl 'https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true' \
        #   -H 'user-agent: Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36' \
        #   --compressed
        url = f"https://api.nasdaq.com/api/screener/stocks?tableonly=true&limit=25&offset=0&download=true"
        headers = {
            "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/106.0.0.0 Safari/537.36"
        }
        r = requests.get(url, headers=headers)
        json = r.json()
        stocks: list[dict[str, Any]] = json["data"]["rows"]
        for stock in stocks:
            try:
                ipoyear = int(stock["ipoyear"])
            except:
                ipoyear = None
            if ipoyear:
                sc = StockCreate(
                    symbol=stock["symbol"],
                    name=stock["name"],
                    country=stock["country"],
                    ipoyear=stock["ipoyear"],
                    industry=stock["industry"],
                    sector=stock["sector"],
                )
            else:
                sc = StockCreate(
                    symbol=stock["symbol"],
                    name=stock["name"],
                    country=stock["country"],
                    industry=stock["industry"],
                    sector=stock["sector"],
                )
            self.stock_crud.create_stock(sc)
        return len(stocks)
