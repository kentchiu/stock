import { Stock, SymbolGain, TotalGain, Trade, TradeGain } from "./types";

export default class APIClient {
  async listSymbolGains(symbols: string): Promise<SymbolGain[]> {
    // const symbols =  'QS,AAPL,TSLA,INTC,META,VOO,DIS,MSFT,GOOG,GOOGL,AMZN,NVDA,AMD,TSM,BRK-B,NFLX,BABA,JNJ';
    const response = await fetch(`/api/gains?symbols=${symbols}`);
    const json: any[] = await response.json();
    const symbolGains: SymbolGain[] = json.map((s) => {
      const gain: SymbolGain = {
        change: s.change,
        changePercent: s.changePercent,
        cost: s.cost,
        dailyGain: s.dailyGain,
        dailyGainPercent: s.dailyGainPercent,
        marketValue: s.marketValue,
        price: s.price,
        quoteDate: s.quoteDate,
        shares: s.shares,
        symbol: s.symbol,
        totalGain: s.totalGain,
        totalGainPercent: s.totalGainPercent,
      };
      return gain;
    });
    return symbolGains;
  }

  async listTradeGains(symbols: string): Promise<TradeGain[]> {
    // const symbols =  'QS,AAPL,TSLA,INTC,META,VOO,DIS,MSFT,GOOG,GOOGL,AMZN,NVDA,AMD,TSM,BRK-B,NFLX,BABA,JNJ';
    const response = await fetch(`/api/gains?symbols=${symbols}`);
    const json = await response.json();
    const tradeGains: TradeGain[] = json
      .map((symbol: any) => {
        return symbol.trades as TradeGain;
      })
      .flatMap((val: TradeGain) => val);
    return tradeGains;
  }

  async getTotalGain(): Promise<TotalGain> {
    let json: TotalGain;
    try {
      const response = await fetch("/api/gains/total");
      json = await response.json();
    } catch (e) {
      console.warn(e);
      json = {} as TotalGain;
    }
    return json;
  }

  async listTrades(): Promise<Trade[]> {
    const response = await fetch("/api/trades");
    const json: Trade[] = await response.json();
    return json;
  }

  async createTradeGain(tradeGain: TradeGain): Promise<TradeGain> {
    const response = await fetch("/api/trades", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tradeGain),
    });
    const newTrade: TradeGain = await response.json();
    console.log("newTrade", newTrade);
    return newTrade;
  }

  async updateTradeGain(tradeGain: TradeGain): Promise<TradeGain> {
    const response = await fetch(`/api/trades/${tradeGain.tradeId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(tradeGain),
    });

    const newTrade: TradeGain = await response.json();
    return newTrade;
  }

  async deleteTrade(id: number) {
    const response = await fetch(`/api/trades/${id}`, {
      method: "DELETE",
    });
  }

  async listStocks(q: string): Promise<Stock[]> {
    const response = await fetch(`/api/stocks/?prefix=${q}`);
    const json: Stock[] = await response.json();
    return json;
  }
}
