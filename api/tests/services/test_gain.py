from unittest.mock import Mock

import pytest

from stock.schemas.quote import QuoteRealTime
from stock.schemas.trade import TradeInDB
from stock.services.gain import GainService


def test_realized_gain():

    mock_trade_service = Mock()
    mock_quote_service = Mock()

    trade = TradeInDB(symbol="AAPL", shares=-10, cost=3)
    mock_trade_service.list_trades.return_value = [trade]

    gain_service = GainService(
        trade_service=mock_trade_service, quote_service=mock_quote_service
    )
    assert gain_service.realized_gain() == pytest.approx(30.0, 0.01)


def test_list_gain_of_symbol():
    mock_trade_service = Mock()
    mock_quote_service = Mock()

    trade = TradeInDB(symbol="AAPL", shares=-10, cost=3)
    mock_trade_service.list_trades.return_value = [trade]

    quote_aapl = QuoteRealTime(symbol="AAPL", close=10.0)
    mock_quote_service.list_realtime_quotes.return_value = [quote_aapl]

    gain_service = GainService(
        trade_service=mock_trade_service, quote_service=mock_quote_service
    )

    gains = gain_service.list_gain_of_symbols(["AAPL"])

    assert len(gains) == 1
