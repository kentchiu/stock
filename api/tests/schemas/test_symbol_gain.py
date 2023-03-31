import pytest

from stock.schemas.gain import SymbolGain
from tests.schemas import testdata


def test_symbol_gain_trade_1():
    gain = SymbolGain(
        quote=testdata.quote_google, trades=[testdata.trade_google_buy_10]
    )
    assert gain.price == pytest.approx(103.06)
    assert gain.shares == 10
    assert gain.cost == pytest.approx(100, 0.01)
    assert gain.market_value == pytest.approx(1030.60, 0.01)
    assert gain.daily_gain == pytest.approx(-30, 0.01)
    assert gain.daily_gain_percent == pytest.approx(-2.83, 0.01)
    assert gain.total_gain == pytest.approx(30.6, 0.01)
    assert gain.total_gain_percent == pytest.approx(3.06, 0.01)


def test_symbol_gain_trade_2():
    gain = SymbolGain(
        quote=testdata.quote_google,
        trades=[testdata.trade_google_buy_10, testdata.trade_google_buy_15],
    )
    assert gain.price == pytest.approx(103.06)
    assert gain.shares == 25
    assert gain.cost == pytest.approx(106, 0.01)
    assert gain.market_value == pytest.approx(2576.50, 0.01)
    assert gain.daily_gain == pytest.approx(-75, 0.01)
    assert gain.daily_gain_percent == pytest.approx(-2.83, 0.01)
    assert gain.total_gain == pytest.approx(-73.5, 0.01)
    assert gain.total_gain_percent == pytest.approx(-2.77, 0.01)


def test_symbol_gain_trade_3():
    gain = SymbolGain(
        quote=testdata.quote_google,
        trades=[
            testdata.trade_google_buy_10,
            testdata.trade_google_buy_15,
            testdata.trade_google_sell_5,
        ],
    )
    assert gain.price == pytest.approx(103.06)
    assert gain.shares == 20
    assert gain.cost == pytest.approx(102.5, 0.01)
    assert gain.market_value == pytest.approx(2061.20, 0.01)
    assert gain.daily_gain == pytest.approx(-60, 0.01)
    assert gain.daily_gain_percent == pytest.approx(-2.83, 0.01)
    assert gain.total_gain == pytest.approx(11.2, 0.01)
    assert gain.total_gain_percent == pytest.approx(0.55, 0.01)


def test_symbol_gain_trade_4():
    gain = SymbolGain(
        quote=testdata.quote_google,
        trades=[
            testdata.trade_google_buy_10,
            testdata.trade_google_buy_15,
            testdata.trade_google_sell_5,
            testdata.trade_google_sell_1,
        ],
    )
    assert gain.price == pytest.approx(103.06)
    assert gain.shares == 19
    assert gain.cost == pytest.approx(102.5, 0.01)
    assert gain.market_value == pytest.approx(1958.14, 0.01)
    assert gain.daily_gain == pytest.approx(-57, 0.01)
    assert gain.daily_gain_percent == pytest.approx(-2.83, 0.01)
    assert gain.total_gain == pytest.approx(11.2, 0.01)
    assert gain.total_gain_percent == pytest.approx(0.58, 0.01)
