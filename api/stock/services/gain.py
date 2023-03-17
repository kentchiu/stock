from fastapi import Depends

from stock.schemas.gain import Gain, SymbolGain, TotalGain
from stock.services.quote import QuoteService
from stock.services.trade import TradeService


class GainService:
    def __init__(
        self,
        trade_service: TradeService = Depends(),
        quote_service: QuoteService = Depends(),
    ) -> None:
        self.trade_service: TradeService = trade_service
        self.quote_service = quote_service

    def list_gain_of_symbols(self, symbols: list[str]) -> list[SymbolGain]:
        quotes = self.quote_service.list_realtime_quotes(list(symbols))

        results: list[SymbolGain] = []
        for symbol in symbols:
            quotes_of_symbol = [quote for quote in quotes if quote.symbol == symbol]
            trades_of_symbol = [
                trade
                for trade in self.trade_service.list_trades()
                if trade.symbol == symbol
            ]
            if len(quotes_of_symbol) == 1:
                gain = SymbolGain(quote=quotes_of_symbol[0], trades=trades_of_symbol)
                results.append(gain)

        return results

    def list_total(self) -> TotalGain:
        symbols = {
            trade.symbol for trade in self.trade_service.list_trades()
        }  # using Set to reduce duplicates
        gain_of_symbols = self.list_gain_of_symbols(symbols=symbols)

        all_gains: list[Gain] = []
        for gain in gain_of_symbols:
            for trade in gain.trades:
                all_gains.append(trade)

        market_value = sum([g.market_value for g in all_gains])
        daily_gain = sum([g.daily_gain for g in all_gains])
        total_gain = sum([g.total_gain for g in all_gains])

        try:
            daily_gain_percent = daily_gain / (market_value - daily_gain) * 100
        except:
            daily_gain_percent = 0

        try:
            total_gain_percent = total_gain / (market_value - total_gain) * 100
        except:
            total_gain_percent = 0

        unrealized = total_gain
        realize = self.realized_gain()
        result = TotalGain(
            market_value=market_value,
            daily_gain=daily_gain,
            daily_gain_percent=daily_gain_percent,
            total_gain=total_gain,
            total_gain_percent=total_gain_percent,
            realized=realize,
            unrealized=unrealized,
        )

        return result

    def realized_gain(self):
        all_trades = self.trade_service.list_trades()
        realized = sum(
            [trade.cost * trade.shares for trade in all_trades if trade.shares < 0]
        )
        return 0 - realized
