import { atom } from "recoil";
import { SymbolGain, TradeGain } from "../utils/types";
import { listSymbolGains, listTradeGains } from "./selectors";

const LOCAL_STORAGE_SYMBOLS = "symbols";
const LOCAL_STORAGE_CURRENCY = "currency";

function defaultSymbols(): Promise<string[]> {
  const symbolStr = localStorage.getItem(LOCAL_STORAGE_SYMBOLS);
  if (symbolStr) {
    const symbols = symbolStr?.split(",");
    return Promise.resolve(symbols);
  } else {
    return Promise.resolve([]);
  }
}

export const symbolsState = atom<string[]>({
  key: "atom/symbols",
  default: defaultSymbols(),
  effects: [
    ({ onSet }) => {
      onSet((newValue, oldValue, isReset) => {
        localStorage.setItem(LOCAL_STORAGE_SYMBOLS, newValue.join(","));
      });
    },
  ],
});

export const symbolGainsState = atom<SymbolGain[]>({
  key: "atom/SymbolGains",
  default: listSymbolGains,
});

export const tradeGainsState = atom<TradeGain[]>({
  key: "atom/TradeGains",
  default: listTradeGains,
});

export type EditMode = "NORMAL" | "EDITING";
export const editModeState = atom<EditMode>({
  key: "atom/EditMode",
  default: "NORMAL",
});

export type Currency = "USD" | "TWD";

function defaultCurrency(): Promise<Currency> {
  let result: Currency = "USD";
  if (localStorage.getItem(LOCAL_STORAGE_CURRENCY)) {
    result = localStorage.getItem(LOCAL_STORAGE_CURRENCY) as Currency;
  }
  return Promise.resolve(result);
}

export const currencyState = atom<Currency>({
  key: "atom/CurrencyState",
  default: defaultCurrency(),
  effects: [
    ({ onSet }) => {
      onSet((newValue, oldValue, isReset) => {
        localStorage.setItem(LOCAL_STORAGE_CURRENCY, newValue);
      });
    },
  ],
});
