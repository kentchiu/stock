import pytest

from stock.schemas.quote import QuoteRealTime


def test_change():
    quote_apple = QuoteRealTime(symbol="AAPL", previous_close=10, close=15)
    quote_apple.update()

    assert quote_apple.change == pytest.approx(5.0, 0.01)
    assert quote_apple.change_percent == pytest.approx(50.0, 0.01)

    quote_tesla = QuoteRealTime(symbol="TSLA", previous_close=23.45, close=21.09)
    quote_tesla.update()

    assert quote_tesla.change == pytest.approx(-2.36, 0.01)
    assert quote_tesla.change_percent == pytest.approx(-10.06, 0.01)

    quote_microsoft = QuoteRealTime(symbol="MSFT", previous_close=154.32, close=154.32)
    quote_microsoft.update()

    assert quote_microsoft.change == pytest.approx(0, 0.01)
    assert quote_microsoft.change_percent == pytest.approx(0, 0.01)
