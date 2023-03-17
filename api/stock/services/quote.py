import logging
from datetime import datetime

import yfinance as yf
from fastapi import Depends
from sqlalchemy import text
from sqlalchemy.orm import Session

from stock.config.database import get_db
from stock.models.trade import Quote
from stock.schemas.quote import QuoteCreate, QuoteInDBBase, QuoteRealTime

logger = logging.getLogger("stock.quote")


class QuoteCRUD:
    def __init__(self, db: get_db = Depends()) -> None:
        self.db: Session = db

    def create_quote(self, quote_create: QuoteCreate) -> QuoteInDBBase:
        quote: Quote = Quote(**quote_create.dict())
        self.db.add(quote)
        self.db.commit()
        self.db.refresh(quote)
        return quote

    def create_quotes(self, creates: list[QuoteCreate]) -> None:
        for each in creates:
            quote: Quote = Quote(**each.dict())
            self.db.add(quote)
        self.db.commit()

    def list_quotes(self) -> list[QuoteInDBBase]:
        statement = text("SELECT * FROM QUOTE")
        quotes = self.db.execute(statement).all()
        results: list[QuoteInDBBase] = [QuoteInDBBase(**quote) for quote in quotes]
        return results


class QuoteService:
    def __init__(self, quote_curd: QuoteCRUD = Depends()) -> None:
        self.quote_crud: QuoteCRUD = quote_curd

    def list_realtime_quotes(self, symbols: list[str]) -> list[QuoteRealTime]:
        if len(symbols) == 0:
            return []
        tickers = " ".join(symbols)

        # 需要取得前一個交易日的收盤價跟當日的最新價，所以需要 兩日的期間， 但是因為 timezone 不同的關係， 可能會只有抓到單日的資料
        # 所以改抓最近的3個交易日，取最後兩筆， 可以保證在任何時區都能取到最近兩日的交易資料
        df2 = yf.download(tickers=tickers, period="3d", interval="1d")
        df = df2.tail(2)

        logger.debug(df2)

        # example:
        #
        #                  Adj Close                 Close                   High                    Low                    Open                  Volume
        #               AAPL        TSLA        AAPL        TSLA        AAPL        TSLA        AAPL        TSLA        AAPL        TSLA       AAPL      TSLA
        # Date
        # 2022-09-09  157.369995  299.679993  157.369995  299.679993  157.820007  299.850006  154.750000  291.250000  155.470001  291.670013   68028800  54338100
        # 2022-09-12  163.429993  304.420013  163.429993  304.420013  164.259995  305.489990  159.300003  300.399994  159.589996  300.720001  104956000  48674600
        # 2022-09-13  153.839996  292.130005  153.839996  292.130005  160.539993  297.399994  153.369995  290.399994  159.899994  292.899994  122493100  68061600

        if df2.count(axis=1).count() != 0:
            quote_date: datetime.date = df.index[1].strftime("%Y-%m-%d")  # type: ignore
        else:
            quote_date = None

        #
        quotes = []
        for symbol in symbols:
            CURRENT_DAY = 1
            PREVIOUS_DAY = 0
            try:
                q: QuoteRealTime = QuoteRealTime(
                    date=quote_date,
                    symbol=symbol,
                    previous_close=float(df["Close"][symbol].iloc[PREVIOUS_DAY]),
                    close=float(df["Close"][symbol].iloc[CURRENT_DAY]),
                    high=float(df["High"][symbol].iloc[CURRENT_DAY]),
                    low=float(df["Low"][symbol].iloc[CURRENT_DAY]),
                    open=float(df["Open"][symbol].iloc[CURRENT_DAY]),
                    volume=int(df["Volume"][symbol].iloc[CURRENT_DAY]),
                )
                q.update()
                quotes.append(q)
            except Exception:
                try:
                    q: QuoteRealTime = QuoteRealTime(
                        date=quote_date,
                        symbol=symbol,
                        previous_close=float(df["Close"].iloc[PREVIOUS_DAY]),
                        close=float(df["Close"].iloc[CURRENT_DAY]),
                        high=float(df["High"].iloc[CURRENT_DAY]),
                        low=float(df["Low"].iloc[CURRENT_DAY]),
                        open=float(df["Open"].iloc[CURRENT_DAY]),
                        volume=int(df["Volume"].iloc[CURRENT_DAY]),
                    )
                    q.update()
                    quotes.append(q)
                except Exception:
                    logger.error("Quote [%s] Error", symbol, exc_info=True)

        return quotes

    def list_realtime_quotes2(self, symbols: list[str]) -> list[QuoteRealTime]:
        if len(symbols) == 0:
            return []
        tickers = " ".join(symbols)

        df = yf.download(tickers=tickers, group_by="Ticker", period="2d")
        df = df.stack(level=0).rename_axis(["Date", "Ticker"]).reset_index(level=1)

        logger.debug(df)

        return []

    def update_quote(self, symbol: str):
        # Open, High, Low,Close,Volume, Dividends,Stock,Splits
        histories = yf.Ticker(symbol).history(period="max")
        dates = histories.index.values.tolist()
        values = histories.values.tolist()
        all = zip(dates, values)

        quotes = [
            QuoteCreate(
                symbol=symbol,
                date=each[0],
                open=each[1][0],
                high=each[1][1],
                low=each[1][2],
                close=each[1][3],
                volume=each[1][4],
            )
            for each in all
        ]

        logger.info(f"Fetch {symbol} {len(quotes)} rows")
        self.quote_crud.create_quotes(quotes)
        return quotes
