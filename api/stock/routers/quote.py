from fastapi import APIRouter, Depends

from stock.services.quote import QuoteService

router = APIRouter(tags=["quotes"])


@router.get("/quotes/")
async def list_quotes(symbols: str = "", quote_service: QuoteService = Depends()):
    if not symbols:
        return []
    result = quote_service.list_realtime_quotes(symbols.split(","))
    return result


@router.patch("/quotes/{symbol}")
async def sync_quotes(symbol: str, quote_service: QuoteService = Depends()):
    result = quote_service.update_quote(symbol)
    return result
