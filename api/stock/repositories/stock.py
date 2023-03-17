import logging
from typing import Any

from fastapi import Depends
from sqlalchemy.orm import Session

from stock.config.database import get_db
from stock.models.trade import Stock

logger = logging.getLogger("repositories.stock")


class StockRepository:
    def __init__(self, db: get_db = Depends()) -> None:
        self.session: Session = db

    def list_stocks(self) -> list[Stock]:
        return self.session.query(Stock).all()

    def get_stock(self, id: int) -> Stock:
        stock = self.session.get(Stock, id)
        if stock:
            return stock
        else:
            raise Exception(f"Stock@{id} Not Found")  # TODO: DB Exception

    def exists(self, id: int) -> bool:
        stock = self.session.get(Stock, id)
        return stock is not None

    def create_stock(self, stock: Stock) -> Stock:
        self.session.add(stock)
        self.session.commit()
        self.session.refresh(stock)
        return stock

    def update_stock(self, id: int, updates: dict[str, Any]) -> Stock:
        stock: Stock = self.session.get(Stock, id)
        for key in updates:
            setattr(stock, key, updates[key])
        self.session.commit()
        self.session.refresh(stock)
        return stock

    def delete_stock(self, id: int) -> None:
        stock = self.session.get(Stock, id)
        if stock:
            self.session.delete(stock)
            self.session.commit()
