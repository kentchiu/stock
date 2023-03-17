from sqlalchemy import Column, Date, Float, Integer, String

from stock.config.database import Base


class Trade(Base):
    __tablename__ = "trade"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    trade_date = Column(Date)
    shares = Column(Float)
    cost = Column(Float)
    note = Column(String)
    fee = Column(Float)
    tax = Column(Float)
    relative_trade_id = Column(Integer)
    take = Column(Float)


class Stock(Base):
    __tablename__ = "stock"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    name = Column(String)
    country = Column(String)
    ipoyear = Column(Integer)
    industry = Column(String)
    sector = Column(String)


class Quote(Base):
    __tablename__ = "quote"

    id = Column(Integer, primary_key=True, index=True)
    symbol = Column(String, index=True)
    date = Column(Date)
    open = Column(Float)
    high = Column(Float)
    low = Column(Float)
    close = Column(Float)
    volume = Column(Integer)
    dividends = Column(Integer)
    splits = Column(Float)
