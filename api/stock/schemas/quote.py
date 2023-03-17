import datetime

from stock.schemas.main import MyBaseModel


class QuoteBase(MyBaseModel):
    r"""
    股價 Current trade record.
    - symbol: 股票名稱
    - date: 日期
    """
    symbol: str = ""
    date: datetime.date | None = None


class QuoteCreate(QuoteBase):
    open: float = 0
    high: float = 0
    low: float = 0
    close: float = 0
    volume: int = 0


class QuoteRealTime(QuoteBase):
    """當日(最新)股價
    - previous_close: 昨收價
    - high:           當日最高價
    - low:            當日最低價
    - open:           當日開盤價
    - close:          當日最新價
    - volume:         當日最新量
    - change:         當日異動
    - change_percent: 當日異動百分比
    """

    previous_close: float = 0
    high: float = 0
    low: float = 0
    open: float = 0
    close: float = 0
    volume: int = 0
    change: float = 0
    change_percent: float = 0

    def update(self):
        # super().__init__(**kwargs)
        self.change = self.close - self.previous_close
        if self.change != 0 and self.previous_close != 0:
            self.change_percent = (self.change / self.previous_close) * 100


class QuoteInDBBase(QuoteBase):
    id: int | None
    open: float = 0
    high: float = 0
    low: float = 0
    close: float = 0
    volume: int = 0
    dividends: int = 0
    splits: float = 0
