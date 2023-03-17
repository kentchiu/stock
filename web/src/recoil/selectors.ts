import { selector, selectorFamily } from "recoil";
import APIClient from "../utils/api";
import { SymbolGain, TotalGain, Trade, TradeGain } from "../utils/types";
import { symbolGainsState, symbolsState, tradeGainsState } from "./atoms";

const client = new APIClient();

export const listSymbolGains = selector<SymbolGain[]>({
  key: "ListSymbolGains",
  get: async ({ get }) => {
    try {
      const symbols = get(symbolsState).join(",");
      return new APIClient().listSymbolGains(symbols!);
    } catch (e) {
      console.warn(e);
      return [];
    }
  },
});

export const listTradeGains = selector<TradeGain[]>({
  key: "API/ListTradeGains",
  get: async ({ get }) => {
    try {
      const symbols = get(symbolsState).join(",");
      return new APIClient().listTradeGains(symbols!);
    } catch (e) {
      console.warn(e);
      return [];
    }
  },
});

export const getTotalGain = selector<TotalGain>({
  key: "API/GetTotalGainQuery",
  get: async ({ get }) => {
    let json = {};
    try {
      return client.getTotalGain();
    } catch (e) {
      console.warn(e);
    }
    return json as TotalGain;
  },
});

export const listTrades = selector<Trade[]>({
  key: "API/trades/listTrades",
  get: async ({ get, getCallback }) => {
    let json: Trade[] = [];
    try {
      return client.listTrades();
    } catch (e) {
      console.warn(e);
    }

    return json as Trade[];
  },
});

export const findSymbolGainBySymbol = selectorFamily<
  SymbolGain | undefined,
  string
>({
  key: "FindGainBySymbolQuery",
  get:
    (symbol) =>
    ({ get }) => {
      const gains = get(symbolGainsState);
      const gain = gains.find((val) => val.symbol === symbol);
      return gain;
    },
});

export const findTradeGainByTradeId = selectorFamily<
  TradeGain | undefined,
  number
>({
  key: "FindGainByTradeIdQuery",
  get:
    (tradeId) =>
    ({ get, getCallback }) => {
      const trades = get(tradeGainsState);
      const tradeGain = trades.find((v) => v.tradeId === tradeId);
      return tradeGain;
    },
});

export const findTradeGainsBySymbol = selectorFamily<TradeGain[], string>({
  key: "tradeGainsQuery",
  get:
    (symbol) =>
    ({ get }) => {
      return get(tradeGainsState).filter((v) => v.symbol === symbol);
    },
});
