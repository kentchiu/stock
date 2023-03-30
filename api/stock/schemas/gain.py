import datetime

from stock.schemas.main import MyBaseModel
from stock.schemas.quote import QuoteRealTime
from stock.schemas.trade import TradeInDB


class Gain(MyBaseModel):
    """全部損益
    - symbol: 股票名稱
    - date: 日期
    - cost: 均價
    - shares: 股數
    - marketValue: 市值
    - dailyGain: 漲跌(日)
    - dailyGainPercent: 漲跌幅(日)
    - totalGain: 漲跌
    - totalGainPercent: 漲跌幅
    """

    symbol: str = ""
    price: float = 0
    quote_date: datetime.date | None = None
    market_value: float = 0
    daily_gain: float = 0
    daily_gain_percent: float = 0
    total_gain: float = 0
    total_gain_percent: float = 0
    trade_id: int | None = None
    trade_date: datetime.date | None = None
    cost: float = 0
    shares: float = 0
    note: str | None = None
    take: float = 0

    def __init__(self, quote: QuoteRealTime, trade: TradeInDB | None = None, **kwargs):
        super().__init__(**kwargs)
        self.symbol = quote.symbol
        self.price = quote.close
        self.quote_date = quote.date
        if trade:
            self.trade_id = trade.id
            self.trade_date = trade.trade_date
            self.cost = trade.cost
            self.shares = trade.shares
            self.take = trade.take or 0
            self.note = trade.note
            unrealized_shares = trade.shares - self.take
            if unrealized_shares > 0:
                self.market_value = quote.close * unrealized_shares
                self.daily_gain = quote.change * unrealized_shares
                self.daily_gain_percent = quote.change_percent
                self.total_gain = (quote.close - trade.cost) * unrealized_shares
                try:
                    self.total_gain_percent = (
                        (quote.close - trade.cost) / trade.cost
                    ) * 100
                except:
                    self.total_gain_percent = 0


class SymbolGain(MyBaseModel):
    """個股損益
    - symbol: 股票名稱
    - date: 日期
    - cost: 價格
    - shares: 股數
    - marketValue: 市值
    - dailyGain: 漲跌(日)
    - dailyGainPercent: 漲跌幅(日)
    - totalGain: 漲跌
    - totalGainPercent: 漲跌幅
    """

    symbol: str = ""
    price: float = 0
    quote_date: datetime.date | None = None
    cost: float = 0
    shares: float = 0
    market_value: float = 0
    change: float = 0
    change_percent: float = 0
    daily_gain: float = 0
    daily_gain_percent: float = 0
    total_gain: float = 0
    total_gain_percent: float = 0
    trades: list[Gain] = []

    def __init__(self, quote: QuoteRealTime, trades: list[TradeInDB], **kwargs):
        super().__init__(**kwargs)
        self.symbol = quote.symbol
        self.price = quote.close
        self.quote_date = quote.date
        self.change = quote.change
        self.change_percent = quote.change_percent

        self.trades = [Gain(quote=quote, trade=trade) for trade in trades]

        unrealized_trades = [
            Gain(quote=quote, trade=trade)
            for trade in trades
            if (trade.shares - (trade.take or 0) > 0)
        ]

        if len(unrealized_trades) > 0:
            total_shares = sum(
                [trade.shares - trade.take for trade in unrealized_trades]
            )
            avg_cost = (
                sum([trade.cost * trade.shares for trade in trades]) / total_shares
            )

            self.cost = avg_cost
            self.shares = total_shares
            self.market_value = quote.close * total_shares
            self.daily_gain = quote.change * total_shares
            self.daily_gain_percent = quote.change_percent
            self.total_gain = (quote.close - avg_cost) * total_shares
            try:
                self.total_gain_percent = (quote.close - avg_cost) / avg_cost * 100
            except:
                self.total_gain_percent = 0


class TotalGain(MyBaseModel):
    """總損益
    - market_value: 市值
    - realized: 已實現損益
    - unrealized: 未實現損益
    - dailyGain: 漲跌(日)
    - dailyGainPercent: 漲跌幅(日)
    - totalGain: 漲跌
    - totalGainPercent: 漲跌幅
    """

    market_value: float = 0
    realized: float = 0
    unrealized: float = 0
    daily_gain: float = 0
    daily_gain_percent: float = 0
    total_gain: float = 0
    total_gain_percent: float = 0
