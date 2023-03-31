from datetime import date

import pytest

from stock.schemas.gain import Gain, SymbolGain
from tests.schemas.testdata import quote_apple, trade_apple_1, trade_apple_2


def test_gain_unrealized():
    gain = Gain(quote=quote_apple, trade=trade_apple_1)

    assert gain.price == pytest.approx(15.0, 0.01)
    assert gain.symbol == "AAPL"
    assert gain.quote_date == date(2022, 9, 14)
    assert gain.trade_date == date(2021, 11, 1)
    assert gain.market_value == pytest.approx(150.0, 0.01)
    assert gain.daily_gain == pytest.approx(
        quote_apple.change * trade_apple_1.shares, 0.01
    )
    assert gain.daily_gain_percent == pytest.approx(quote_apple.change_percent, 0.01)
    assert gain.total_gain == pytest.approx(25.0, 0.01)
    assert gain.total_gain_percent == pytest.approx(20.0, 0.01)


# def test_gain_partial_realized():
#     trade = trade_apple_1.copy()  # testdata 是 global variable , 不能直接改,要想做副本
#     trade.take = 1
#     gain = Gain(quote=quote_apple, trade=trade)
#
#     assert gain.price == pytest.approx(15.0, 0.01)
#     assert gain.symbol == "AAPL"
#     assert gain.quote_date == date(2022, 9, 14)
#     assert gain.trade_date == date(2021, 11, 1)
#     assert gain.market_value == pytest.approx(150.0 - 15, 0.01)
#     assert gain.daily_gain == pytest.approx(
#         quote_apple.change * (trade.shares - trade.take), 0.01
#     )
#     assert gain.daily_gain_percent == pytest.approx(quote_apple.change_percent, 0.01)
#     assert gain.total_gain == pytest.approx(22.5, 0.01)
#     assert gain.total_gain_percent == pytest.approx(20.0, 0.01)


# def test_gain_all_realized():
#     trade = trade_apple_1.copy()  # testdata 是 global variable , 不能直接改,要想做副本
#     trade.take = trade.shares  # make all shares realized
#     gain = Gain(quote=quote_apple, trade=trade)
#
#     assert gain.price == pytest.approx(15.0, 0.01)
#     assert gain.symbol == "AAPL"
#     assert gain.quote_date == date(2022, 9, 14)
#     assert gain.trade_date == date(2021, 11, 1)
#     assert gain.market_value == 0
#     assert gain.daily_gain == 0
#     assert gain.daily_gain_percent == 0
#     assert gain.total_gain == 0
#     assert gain.total_gain_percent == 0


def test_symbol_gain():
    gain = SymbolGain(quote=quote_apple, trades=[trade_apple_1, trade_apple_2])
    total_shares = trade_apple_1.shares + trade_apple_2.shares
    trad1_cost = trade_apple_1.shares * trade_apple_1.cost
    trad2_cost = trade_apple_2.shares * trade_apple_2.cost
    avg_cost = (trad1_cost + trad2_cost) / (trade_apple_1.shares + trade_apple_2.shares)
    assert gain.price == pytest.approx(15.0, 0.01)
    assert gain.symbol == "AAPL"
    assert gain.shares == total_shares
    assert gain.cost == avg_cost
    assert gain.market_value == pytest.approx(quote_apple.close * total_shares, 0.01)
    assert gain.change == pytest.approx(quote_apple.change, 0.01)
    assert gain.change_percent == pytest.approx(quote_apple.change_percent, 0.01)
    daily_gain = total_shares * quote_apple.change
    assert gain.daily_gain == pytest.approx(daily_gain, 0.01)
    assert gain.daily_gain_percent == pytest.approx(50.0, 0.01)
    assert gain.total_gain == pytest.approx(-12.5, 0.01)
    assert gain.total_gain_percent == pytest.approx(-3.23, 0.01)


# def test_symbol_gain_all_realized():
#     trade = trade_apple_1.copy()  # testdata 是 global variable , 不能直接改,要想做副本
#     #trade.take = trade.shares  # make all shares realized
#     gain = SymbolGain(quote=quote_apple, trades=[trade])
#     assert gain.price == pytest.approx(15.0, 0.01)
#     assert gain.symbol == "AAPL"
#     assert gain.shares == 0
#     assert gain.cost == 0
#     assert gain.market_value == 0
#     assert gain.change == pytest.approx(quote_apple.change, 0.01)
#     assert gain.change_percent == pytest.approx(quote_apple.change_percent, 0.01)
#     assert gain.daily_gain == 0
#     assert gain.daily_gain_percent == 0
#     assert gain.total_gain == 0
#     assert gain.total_gain_percent == 0
