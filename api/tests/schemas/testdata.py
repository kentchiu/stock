from datetime import date

from stock.schemas.quote import QuoteRealTime
from stock.schemas.trade import TradeInDB

quote_apple = QuoteRealTime(
    symbol="AAPL", date=date(2022, 9, 14), previous_close=10, close=15
)
quote_apple.update()

quote_tesla = QuoteRealTime(
    symbol="TSLA", date=date(2022, 9, 14), previous_close=23.45, close=21.09
)
quote_tesla.update()

quote_microsoft = QuoteRealTime(
    symbol="MSFT", date=date(2022, 9, 14), previous_close=154.32, close=154.32
)
quote_microsoft.update()

trade_apple_1 = TradeInDB(
    trade_date=date(2021, 11, 1), symbol="AAPL", shares=10, cost=12.5
)

trade_apple_2 = TradeInDB(
    trade_date=date(2022, 1, 16), symbol="AAPL", shares=15, cost=17.5
)
