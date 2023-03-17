from stock.schemas.main import MyBaseModel


class StockCreate(MyBaseModel):
    symbol: str
    name: str
    country: str
    ipoyear: int | None = None
    industry: str
    sector: str


class StockUpdate(MyBaseModel):
    symbol: str | None = None
    name: str | None = None
    country: str | None = None
    ipoyear: int | None = None
    industry: str | None = None
    sector: str | None = None


class StockInDB(MyBaseModel):
    id: int | None = None
    symbol: str
    name: str
    country: str | None = None
    ipoyear: int | None = None
    industry: str | None = None
    sector: str | None = None

    class Config:
        orm_mode = True
