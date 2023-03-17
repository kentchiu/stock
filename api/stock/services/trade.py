import logging

import yfinance as yf
from fastapi import Depends
from pydantic import parse_obj_as

from stock.models.trade import Trade
from stock.repositories.trade import TradeRepository
from stock.schemas.trade import TradeCreate, TradeInDB, TradeUpdate

logger = logging.getLogger("services.trade")


class TradeService:
    def __init__(self, trade_repository=Depends(TradeRepository)) -> None:
        self.trade_repository: TradeRepository = trade_repository

    def list_trades(self) -> list[TradeInDB]:
        return parse_obj_as(list[TradeInDB], self.trade_repository.list_trades())

    def get_trade(self, id: int) -> TradeInDB:
        return TradeInDB.from_orm(self.trade_repository.get_trade(id))

    def create_trade(self, trade_create: TradeCreate) -> TradeInDB:
        trade = self.trade_repository.create_trade(Trade(**trade_create.dict()))
        return TradeInDB.from_orm(trade)

    def update_trade(self, id: int, trade_update: TradeUpdate) -> TradeInDB:
        updates = {k: v for k, v in trade_update.dict().items() if v is not None}
        logger.debug("attrs %s", updates)
        trade = self.trade_repository.update_trade(id, updates)
        return TradeInDB.from_orm(trade)

    def delete_trade(self, id: int) -> None:
        self.trade_repository.delete_trade(id)

    def exists(self, id) -> bool:
        return self.trade_repository.exists(id)


def is_valid_symbol(symbol: str) -> bool:
    """check symbol is valid

    Args:
        symbol (str): symbol name

    Returns:
        bool: return True if exists, otherwise return False
    """
    ticker = yf.Ticker(symbol)
    try:
        return ticker.info is not None
    except KeyError:
        logger.warning("Symbol [%s] not exist", symbol)
        return False
