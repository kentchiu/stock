import datetime
from unittest.mock import Mock

import pytest
from sqlalchemy.orm import Session

from stock.main import app
from stock.models.trade import Trade
from stock.repositories.trade import TradeRepository
from stock.schemas.trade import TradeCreate, TradeInDB, TradeUpdate
from stock.services.trade import TradeService


@pytest.fixture
def mock_trade_repository() -> Session:
    mock_trade_repository = Mock(spec=TradeRepository, name="MockTradeRepository")
    app.dependency_overrides[TradeRepository] = lambda: mock_trade_repository
    return mock_trade_repository


def test_list_trades(mock_trade_repository):
    test_trades = [
        Trade(id=1, symbol="AAPL", cost=1.23, shares=1),
        Trade(id=2, symbol="AAPL", cost=2.34, shares=3),
    ]
    mock_trade_repository.list_trades.return_value = test_trades

    trade_service = TradeService(mock_trade_repository)
    results = trade_service.list_trades()

    assert len(results) == 2
    assert type(results[0]) == TradeInDB


def test_get_trade(mock_trade_repository):
    test_trade = Trade(id=1, symbol="AAPL", cost=1.23, shares=1)
    mock_trade_repository.get_trade.return_value = test_trade

    trade_service = TradeService(mock_trade_repository)
    trade = trade_service.get_trade(1)

    mock_trade_repository.get_trade.expect_called_with(1)

    assert trade.id == 1
    assert trade.symbol == "AAPL"
    assert type(trade) == TradeInDB


def not_found_exception():
    raise Exception()


def test_get_trade_not_exists(mock_trade_repository):
    mock_trade_repository.get_trade.side_effect = not_found_exception

    trade_service = TradeService(mock_trade_repository)
    try:
        trade_service.get_trade(1)
        assert False  # should not reach here
    except:
        assert True


def test_create_trade(mock_trade_repository):
    test_trade = Trade(id=1, symbol="AAPL", cost=1.23, shares=1)
    mock_trade_repository.create_trade.return_value = test_trade

    trade_service = TradeService(mock_trade_repository)
    trade = trade_service.create_trade(
        TradeCreate(
            trade_date=datetime.date(2022, 10, 16), symbol="AAPL", cost=1.23, shares=1
        )
    )

    assert trade.id == 1
    assert type(trade) == TradeInDB


def test_update_trade(mock_trade_repository):
    test_trade = Trade(id=1, symbol="AAPL", cost=1.23, shares=1)
    mock_trade_repository.update_trade.return_value = test_trade

    trade_service = TradeService(mock_trade_repository)
    trade = trade_service.update_trade(1, TradeUpdate(note="test node"))

    mock_trade_repository.update_trade.assert_called()

    assert type(trade) == TradeInDB


def test_delete_trade(mock_trade_repository):
    trade_service = TradeService(mock_trade_repository)

    trade_service.delete_trade(1)

    mock_trade_repository.delete_trade.assert_called_with(1)
