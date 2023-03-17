from datetime import date

from stock.schemas.main import MyBaseModel


class TradeCreate(MyBaseModel):
    trade_date: date
    symbol: str
    shares: float
    cost: float


class TradeUpdate(MyBaseModel):
    note: str | None = None
    shares: float | None = None
    cost: float | None = None
    relative_trade_id: int | None = None
    take: float | None = None


class TradeInDB(MyBaseModel):
    """
    交易
    Current trade recode
    - symbol: 股票名稱
    - trade_date: 成交日期
    - shares: 股數
    - cost: 成交價
    - note: 註解
    - taking: 獲利了結股數
    - relative_trade_id: 對獲利了結應的 trade_id
    """

    id: int | None = None
    trade_date: date | None = None
    note: str | None = None
    symbol: str = ""
    shares: float = 0
    cost: float = 0
    fee: float | None = 0
    tax: float | None = 0
    relative_trade_id: int | None = None
    take: float | None = None

    class Config:
        orm_mode = True
