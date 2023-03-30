import { ArrowPathIcon, TrashIcon } from "@heroicons/react/24/outline";
import React, { ChangeEvent, useState } from "react";
import { useRecoilCallback, useRecoilValue } from "recoil";
import { useCurrencyRate } from "../hooks";
import { symbolsState, tradeGainsState } from "../recoil/atoms";
import {
  findSymbolGainBySymbol,
  findTradeGainByTradeId,
  findTradeGainsBySymbol,
} from "../recoil/selectors";
import APIClient from "../utils/api";
import { TradeGain } from "../utils/types";
import { decimalFormat } from "../utils/util";
import { ColorNumber } from "./ColorNumber";

export const TradeTable = ({ symbol }: { symbol: string }) => {
  const gain = useRecoilValue(findSymbolGainBySymbol(symbol));
  const trades: TradeGain[] = useRecoilValue(findTradeGainsBySymbol(symbol));

  if (trades.length == 0) {
    return <></>;
  } else {
    return (
      <table className="table-auto w-full bg-white">
        <colgroup>
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
          <col />
        </colgroup>
        <thead className="text-xs text-slate-600">
          <tr>
            <th className="font-light text-left pl-2">
              <span>Trade Date</span>
            </th>
            <th className="font-light">
              <span>Shares</span>
            </th>
            <th className="font-light">
              <span>Cost / Share</span>
            </th>
            <th className="font-light">
              <span>Market Value</span>
            </th>
            <th className="font-light">
              <span>Day Gain</span>
            </th>
            <th className="font-light">
              <span>Total Gain</span>
            </th>
            <th className="font-light">
              <span>Annualized Gain</span>
            </th>
            <th className="font-light text-left">
              <span>Notes</span>
            </th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {trades.map((trade, index) => {
            return (
              <React.Fragment key={trade.tradeId}>
                <React.Suspense
                  fallback={<ArrowPathIcon className="animate-spin h-6 w-6" />}
                >
                  <TradeRecord
                    tradeId={trade.tradeId}
                    close={gain?.shares === 0}
                  />
                </React.Suspense>
              </React.Fragment>
            );
          })}
        </tbody>
      </table>
    );
  }
};

const TradeRecord = ({
  tradeId,
  close = false,
}: {
  tradeId?: number;
  close: boolean;
}) => {
  const rate = useCurrencyRate();
  const tradeGain = useRecoilValue(findTradeGainByTradeId(tradeId!));
  const hidden = close;
  const [shares, setShares] = useState(tradeGain?.shares);
  const [date, setDate] = useState(tradeGain?.tradeDate);
  const [cost, setCost] = useState(tradeGain?.cost);
  const [note, setNote] = useState(tradeGain?.note);
  const symbols = useRecoilValue(symbolsState);

  const updateTradeCallback = useRecoilCallback(
    ({ set }) =>
      async (val: TradeGain) => {
        await new APIClient().updateTradeGain(val);
        const tradeGains2 = await new APIClient().listTradeGains(
          symbols.join(",")
        );
        set(tradeGainsState, (val) => {
          return tradeGains2;
        });
      }
  );

  const deleteTradeCallback = useRecoilCallback(
    ({ set }) =>
      async (tradeId: number) => {
        new APIClient().deleteTrade(tradeId);
        const tradeGains2 = await new APIClient().listTradeGains(
          symbols.join(",")
        );
        set(tradeGainsState, (val) => {
          return tradeGains2;
        });
      }
  );

  const handleSharesChange = async (
    event: ChangeEvent<HTMLInputElement>,
    tradeGain: TradeGain
  ) => {
    const shares = parseInt(event.target.value);
    setShares(shares);
    const tg: TradeGain = { ...tradeGain, shares };
    updateTradeCallback(tg);
  };

  const handleDateChange = async (
    event: ChangeEvent<HTMLInputElement>,
    tradeGain: TradeGain
  ) => {
    const date = event.target.value;
    setDate(date);
    const tg: TradeGain = { ...tradeGain, tradeDate: date };
    updateTradeCallback(tg);
  };

  const handleCostChange = async (
    event: ChangeEvent<HTMLInputElement>,
    tradeGain: TradeGain
  ) => {
    const cost = parseFloat(event.target.value);
    setCost(cost);
    const tg: TradeGain = { ...tradeGain, cost: cost };
    updateTradeCallback(tg);
  };


  const handleNoteChange = async (
    event: ChangeEvent<HTMLInputElement>,
    tradeGain: TradeGain
  ) => {
    const note = event.target.value;
    setNote(note);
    const tg: TradeGain = { ...tradeGain, note: note };
    updateTradeCallback(tg);
  };

  if (!tradeGain) {
    return <></>;
  } else {
    return (
      <>
        <tr>
          <td className="pl-2">
            <input
              type="date"
              className="p-0 text-sm border-slate-300 w-32"
              value={date}
              onChange={(e) => handleDateChange(e, tradeGain)}
            />
          </td>
          <td>
            <input
              type="number"
              className="p-0 text-sm border-slate-300 w-24 text-right"
              value={shares}
              onChange={(e) => handleSharesChange(e, tradeGain)}
            />
          </td>
          <td>
            <input
              type="number"
              className="p-0 text-sm border-slate-300 w-24 text-right"
              value={decimalFormat.format(cost ?? 0)}
              onChange={(e) => handleCostChange(e, tradeGain)}
            />
          </td>
          <td className="text-center">
            <ColorNumber
              num={tradeGain.marketValue}
              colorful={false}
              sign={false}
            />
          </td>
          <td className="text-center">
            <div>
              <div className="font-bold">
                <ColorNumber
                  num={tradeGain.dailyGainPercent}
                  percent
                  hidden={hidden}
                ></ColorNumber>
              </div>
              <div>
                <ColorNumber
                  num={tradeGain.dailyGain}
                  rate={rate}
                  hidden={hidden}
                ></ColorNumber>
              </div>
            </div>
          </td>
          <td className="text-center">
            <div>
              <div className="font-bold">
                <ColorNumber
                  num={tradeGain.totalGainPercent}
                  percent
                  hidden={hidden}
                ></ColorNumber>
              </div>
              <div>
                <ColorNumber
                  num={tradeGain.totalGain}
                  rate={rate}
                  hidden={hidden}
                ></ColorNumber>
              </div>
            </div>
          </td>
          <td className="text-center">-</td>
          <td>
            <input
              type="text"
              className="p-0 text-sm border-slate-300 w-80"
              value={note ?? ""}
              onChange={(e) => handleNoteChange(e, tradeGain)}
            />
          </td>
          <td>
            <TrashIcon
              className="w-6 h-6 hover:text-red-600 inline-block"
              onClick={() => deleteTradeCallback(tradeGain.tradeId!)}
            ></TrashIcon>
          </td>
        </tr>
      </>
    );
  }
};

