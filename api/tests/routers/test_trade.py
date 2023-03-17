import unittest.mock

import pytest
from fastapi.testclient import TestClient

from stock.main import app
from stock.schemas.trade import TradeInDB
from stock.services.trade import TradeService

client: TestClient = TestClient(app)


@pytest.fixture
def mock_trade_service():
    mock_trade_service = unittest.mock.Mock(spec=TradeService, name="MockTradeService")
    app.dependency_overrides[TradeService] = lambda: mock_trade_service
    return mock_trade_service


def test_create_trade(mock_trade_service):
    trade = TradeInDB(id=1, symbol="AAPL", shares=1, cost=100)
    mock_trade_service.create_trade.return_value = trade

    resp = client.post(
        "/trades",
        json={
            "symbol": "AAPL",
            "tradeDate": "2022-10-10",
            "shares": "1",
            "cost": "100",
        },
    )

    assert resp.status_code == 201
    assert resp.json()["id"] == 1
    assert resp.json()["symbol"] == "AAPL"


def test_list_trades(mock_trade_service):
    trade = TradeInDB(symbol="AAPL", shares=-10, cost=3)
    mock_trade_service.list_trades.return_value = [trade]

    resp = client.get("/trades")

    json = resp.json()
    assert json[0]["symbol"] == "AAPL"


def test_get_trade(mock_trade_service):
    trade = TradeInDB(symbol="AAPL", shares=-10, cost=3)
    mock_trade_service.get_trade.return_value = trade

    resp = client.get("/trades/1")

    mock_trade_service.get_trade.assert_called_with(1)

    assert resp.status_code == 200
    assert resp.json()["symbol"] == "AAPL"


def raise_exception():
    raise Exception("Test")


def test_get_trade_not_found(mock_trade_service):
    mock_trade_service.get_trade.side_effect = raise_exception

    resp = client.get("/trades/1")

    mock_trade_service.get_trade.assert_called_with(1)

    assert resp.status_code == 404
    assert resp.json()["code"] == "NOT_FOUND"


def test_delete_trade(mock_trade_service):
    resp = client.delete("/trades/1")
    mock_trade_service.delete_trade.assert_called_with(1)
    assert resp.status_code == 204


def test_update_trade(mock_trade_service):

    mock_trade_service.exists.return_value = True

    trade = TradeInDB(id=1, symbol="AAPL", shares=1, cost=100)
    mock_trade_service.update_trade.return_value = trade

    resp = client.patch("trades/1", json={"shares": 99, "note": "test update"})

    mock_trade_service.update_trade.assert_called()

    assert resp.status_code == 200
    assert resp.json()["symbol"] == "AAPL"


def test_update_trade_which_not_exists(mock_trade_service):
    mock_trade_service.exists.return_value = False

    resp = client.patch("trades/1", json={"shares": 99, "note": "test update"})

    mock_trade_service.get_trade.assert_not_called()

    assert resp.status_code == 404
    assert resp.json()["code"] == "NOT_FOUND"
