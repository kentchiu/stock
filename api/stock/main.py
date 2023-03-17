import logging

# root log config, NOTE: PUT THIS RIGHT AFTER `import logging`
logging.basicConfig(
    level=logging.DEBUG,
    format="%(asctime)s  [%(levelname)s] %(name)s \t%(module)s.%(funcName)s():%(lineno)d - %(message)s",
)

from fastapi import FastAPI
from fastapi.logger import logger as fastapi_logger

from stock.config.database import create_tables
from stock.routers import gain, quote, stock, trade
from stock.utils.app_exceptions import AppException, app_exception_handler

## db logger
logging.getLogger("sqlalchemy.engine").setLevel(logging.INFO)
## system logger
fastapi_logger.setLevel(logging.WARN)

# stock app loggers
app_logger = logging.getLogger("stock")
app_logger.setLevel(logging.DEBUG)
logging.getLogger("stock.quote").setLevel(logging.DEBUG)
logging.getLogger("stock.trade").setLevel(logging.DEBUG)
logging.getLogger("stock.gain").setLevel(logging.DEBUG)


create_tables()

app = FastAPI(title="Stock API", description="The Stock API", version="0.1", debug=True)


@app.exception_handler(AppException)
async def custom_app_exception_handler(request, e):
    return await app_exception_handler(request, e)


app.include_router(trade.router)
app.include_router(quote.router)
app.include_router(gain.router)
app.include_router(stock.router)


@app.get("/")
async def root() -> dict:
    return {"message": "This is the STOCK API"}


@app.get("/health")
def health() -> dict:
    # __debug_logger()

    return {"name": "Stock API", "version": "0.0.1"}


def __debug_logger():
    print("-----> logger start")
    logging.debug("logging debug message")
    logging.info("logging info message")
    logging.warning("logging warning message")
    logging.error("logging error message")
    logging.critical("logging critical message")

    fastapi_logger.debug("FASTAPI debug message")
    fastapi_logger.info("FASTAPI info message")
    fastapi_logger.warning("FASTAPI warning message")
    fastapi_logger.error("FASTAPI error message")
    fastapi_logger.critical("FASTAPI critical message")

    app_logger.debug("DEBUG_LOGGER debug message")
    app_logger.info("DEBUG_LOGGER info message")
    app_logger.warning("DEBUG_LOGGER warning message")
    app_logger.error("DEBUG_LOGGER error message")
    app_logger.critical("DEBUG_LOGGER critical message")
    print("logger end <-------")


if __name__ == "__main__":
    # Use this for debugging purpose only
    import uvicorn

    uvicorn.run(app, host="0.0.0.0", port=8888, log_level="debug")
