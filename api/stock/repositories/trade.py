import logging
from typing import Any

from fastapi import Depends
from sqlalchemy.orm import Session

from stock.config.database import get_db
from stock.models.trade import Trade

logger = logging.getLogger("repositories.trade")


class TradeRepository:
    def __init__(self, db: get_db = Depends()) -> None:
        self.session: Session = db

    def list_trades(self) -> list[Trade]:
        return self.session.query(Trade).all()

    def get_trade(self, id: int) -> Trade:
        trade = self.session.get(Trade, id)
        if trade:
            return trade
        else:
            raise Exception(f"Trade@{id} Not Found")  # TODO: DB Exception

    def exists(self, id: int) -> bool:
        trade = self.session.get(Trade, id)
        return trade is not None

    def create_trade(self, trade: Trade) -> Trade:
        self.session.add(trade)
        self.session.commit()
        self.session.refresh(trade)
        return trade

    def update_trade(self, id: int, updates: dict[str, Any]) -> Trade:
        trade: Trade = self.session.get(Trade, id)
        for key in updates:
            setattr(trade, key, updates[key])
        self.session.commit()
        self.session.refresh(trade)
        return trade

    def delete_trade(self, id: int) -> None:
        trade = self.session.get(Trade, id)
        if trade:
            self.session.delete(trade)
            self.session.commit()
