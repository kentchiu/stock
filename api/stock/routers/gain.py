from fastapi import APIRouter, Depends

from stock.services.gain import GainService

router = APIRouter(tags=["gains"], responses={404: {"description": "Not found"}})


@router.get("/gains")
async def list_gains(
    symbols: str = "", gain_service: GainService = Depends(GainService)
):
    if not symbols:
        return []
    return gain_service.list_gain_of_symbols(symbols=symbols.split(","))


@router.get("/gains/total")
async def list_summary(gain_service: GainService = Depends(GainService)):
    return gain_service.list_total()
