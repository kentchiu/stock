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

quote_google = QuoteRealTime(
    symbol="GOOGL",
    date=date(2023, 3, 27),
    previous_close=106.06,
    close=103.06,
    change=-3,
    change_percent=-2.83,
)

trade_google_buy_10 = TradeInDB(
    trade_date=date(2023, 3, 20), symbol="GOOGL", shares=10, cost=100
)

trade_google_buy_15 = TradeInDB(
    trade_date=date(2023, 3, 21), symbol="GOOGL", shares=15, cost=110
)

trade_google_sell_5 = TradeInDB(
    trade_date=date(2023, 3, 22), symbol="GOOGL", shares=-5, cost=120
)

trade_google_sell_1 = TradeInDB(
    trade_date=date(2023, 3, 23), symbol="GOOGL", shares=-1, cost=103.06
)
