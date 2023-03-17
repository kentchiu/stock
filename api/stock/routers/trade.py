import logging

from fastapi import APIRouter, Depends

from stock.schemas.trade import TradeCreate, TradeUpdate
from stock.services.trade import TradeService, is_valid_symbol
from stock.utils.app_exceptions import NotFoundException

logger = logging.getLogger("stock.trade")

router = APIRouter(tags=["trades"], responses={404: {"description": "Not found"}})


@router.get("/trades")
async def list_trades(trade_service: TradeService = Depends()):
    return trade_service.list_trades()


@router.get("/trades/{id}")
async def get_trade(id: int, trade_service: TradeService = Depends()):
    try:
        return trade_service.get_trade(id)
    except Exception:
        raise NotFoundException(resource="Trade", id=id)


@router.post("/trades", status_code=201)
async def add_trades(trade: TradeCreate, trade_service: TradeService = Depends()):
    if not is_valid_symbol(trade.symbol):
        raise NotFoundException(
            resource="Symbol",
            id=trade.symbol,
            context={"message": f"[{trade.symbol}] is not valid stock symbol"},
        )
    return trade_service.create_trade(trade)


@router.patch("/trades/{id}")
async def update_trades(
    id: int, trade_update: TradeUpdate, trade_service: TradeService = Depends()
):
    exists = trade_service.exists(id)

    if not exists:
        raise NotFoundException(resource="Trade", id=id)

    logger.debug("trade input %s", trade_update)
    result = trade_service.update_trade(id, trade_update)
    return result


@router.delete("/trades/{id}", status_code=204)
async def delete_trade(id: int, trade_service: TradeService = Depends()):
    logger.info("delete trade by id: [%d]", id)
    trade_service.delete_trade(id)
