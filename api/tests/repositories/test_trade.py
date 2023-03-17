from unittest.mock import Mock

import pytest
from sqlalchemy.orm import Session

from stock.config.database import get_db
from stock.main import app
from stock.models.trade import Trade
from stock.repositories.trade import TradeRepository


@pytest.fixture
def mock_db_session() -> Session:
    mock_session = Mock()
    app.dependency_overrides[get_db] = mock_session
    return mock_session


def test_delete_trade(mock_db_session):
    service = TradeRepository(db=mock_db_session)
    mock_db_session.get.return_value = Trade(id=1)
    service.delete_trade(1)
    mock_db_session.delete.assert_called()
    mock_db_session.commit.assert_called()


def test_delete_trade_not_exists(mock_db_session):
    service = TradeRepository(db=mock_db_session)
    mock_db_session.get.return_value = None
    service.delete_trade(1)
    mock_db_session.delete.assert_not_called()
    mock_db_session.commit.assert_not_called()


def teardown_module(module):
    """teardown any state that was previously setup with a setup_module
    method.
    """
    app.dependency_overrides = {}
