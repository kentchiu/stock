import requests
from fastapi import APIRouter, Depends

from stock.services.stock import StockCRUD, StockService

router = APIRouter(tags=["stock"])


@router.get("/stocks/")
async def list_stocks(prefix: str, stock_crud: StockCRUD = Depends(StockCRUD)):
    url = f"https://query2.finance.yahoo.com/v1/finance/search?q={prefix}&lang=en-US&region=US"
    headers = {
        "user-agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/107.0.0.0 Safari/537.36"
    }
    r = requests.get(url=url, headers=headers)
    json = r.json()["quotes"]

    return json


@router.post("/stocks/")
async def import_stocks(stock_service: StockService = Depends(StockService)):
    count = stock_service.importStocks()
    return {"count": count}
