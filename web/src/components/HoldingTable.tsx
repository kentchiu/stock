import {
  ArrowPathIcon,
  ChevronDownIcon,
  ChevronRightIcon,
  TrashIcon,
} from "@heroicons/react/24/outline";
import classNames from "classnames";
import React, { Suspense, useState } from "react";
import { useRecoilCallback, useRecoilState, useRecoilValue } from "recoil";
import { useCurrencyRate } from "../hooks";
import { Atoms, Selectors } from "../recoil";
import { symbolsState } from "../recoil/atoms";
import APIClient from "../utils/api";
import { SymbolGain, TradeGain } from "../utils/types";
import { ColorNumber } from "./ColorNumber";
import { TradeTable } from "./TradeTable";

export const HoldingTable = () => {
  return (
    <table className="w-full text-sm table-auto border-collapse">
      <colgroup>
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
        <col />
      </colgroup>
      <thead className="text-xs  border-b-2 border-solid bg-slate-500 text-white">
        <tr className="border-b ">
          <th className="text-left font-light   p-4 m-4">
            <span className="p-4 ">Symbol</span>
          </th>
          <th className="font-light">
            <span>Change</span>
          </th>
          <th className="font-light">
            <span>Shares</span>
          </th>
          <th className="font-light">
            <span>Avg Cost / Share</span>
          </th>
          <th className="font-light">
            <span>Market Value</span>
          </th>
          <th className="font-light">
            <span>Daily Gain</span>
          </th>
          <th className="font-light">
            <span>Total Gain</span>
          </th>
          <th className="font-light">
            <span>No. of Lots</span>
          </th>
          <th className="font-light">
            <span>Notes</span>
          </th>
          <th></th>
        </tr>
      </thead>
      <Suspense
        fallback={
          <tbody>
            <tr>
              <td>
                <ArrowPathIcon className="animate-spin h-6 w-6" />
              </td>
            </tr>
          </tbody>
        }
      >
        <TBodys></TBodys>
      </Suspense>
    </table>
  );
};

const ShowTradeButton = ({
  opened,
  hidden,
  onClick,
}: {
  opened: boolean;
  hidden: boolean;
  onClick: () => void;
}) => {
  const leftIcon = <ChevronRightIcon className="h-5 w-5 text-blue-600" />;
  const downIcon = <ChevronDownIcon className="h-5 w-5 text-blue-600" />;
  const icon = opened ? downIcon : leftIcon;
  return (
    <div
      onClick={onClick}
      className={classNames("cursor-pointer", { invisible: hidden })}
    >
      {icon}
    </div>
  );
};

const TBodys = () => {
  const gains = useRecoilValue(Atoms.symbolGainsState);
  return (
    <>
      {gains.map((gain) => {
        return <TBody key={gain.symbol} symbol={gain.symbol}></TBody>;
      })}
    </>
  );
};

const TBody = ({ symbol }: { symbol: string }) => {
  const [showTrade, setShowTrade] = useState(false);
  const gain = useRecoilValue(Selectors.findSymbolGainBySymbol(symbol))!;
  const hiddenGain = false;
  const rate = useCurrencyRate();
  const [mode, setMode] = useRecoilState(Atoms.editModeState);
  const [symbols, setSymbols] = useRecoilState(symbolsState);
  const handleDeleteSymbol = (symbol: string) => {
    const symbols2 = symbols.filter((val) => val !== symbol);
    setSymbols(symbols2);
  };
  return (
    <tbody className="bg-slate-100">
      <tr className="h-16 text-center">
        <td>
          <div className="flex items-center text-center">
            <ShowTradeButton
              opened={showTrade}
              hidden={hiddenGain}
              onClick={() => setShowTrade(!showTrade)}
            ></ShowTradeButton>
            <div>
              <div className="text-blue-600 font-bold">{gain.symbol}</div>
              <div className="font-light">
                <ColorNumber num={gain.price} colorful={false} sign={false} />
              </div>
            </div>
          </div>
        </td>
        <td className="text-center">
          <div>
            <div className="font-bold">
              <ColorNumber num={gain.changePercent} percent></ColorNumber>
            </div>
            <div>
              <ColorNumber num={gain.change}></ColorNumber>
            </div>
          </div>
        </td>
        <td className="text-center">
          <span className="font-bold">
            <ColorNumber
              num={gain.shares}
              hidden={hiddenGain}
              colorful={false}
              sign={false}
            />
          </span>
        </td>
        <td className="text-center">
          <span className="font-bold">
            <ColorNumber
              num={gain.cost}
              hidden={hiddenGain}
              colorful={false}
              sign={false}
            />
          </span>
        </td>
        <td className="text-center">
          <span className="font-bold">
            <ColorNumber
              num={gain.marketValue}
              hidden={hiddenGain}
              colorful={false}
              sign={false}
              rate={rate}
            />
          </span>
        </td>
        <td className="text-center">
          <div>
            <div className="font-bold">
              <ColorNumber
                num={gain.dailyGainPercent}
                percent
                hidden={gain.shares === 0}
              ></ColorNumber>
            </div>
            <div>
              <ColorNumber
                num={gain.dailyGain}
                hidden={gain.shares === 0}
                rate={rate}
              ></ColorNumber>
            </div>
          </div>
        </td>
        <td className="text-center">
          <div>
            <div className="font-bold">
              <ColorNumber
                num={gain.totalGainPercent}
                percent
                hidden={gain.shares === 0}
              ></ColorNumber>
            </div>
            <div>
              <ColorNumber
                num={gain.totalGain}
                hidden={gain.shares === 0}
                rate={rate}
              ></ColorNumber>
            </div>
          </div>
        </td>
        <td className="text-center">
          {mode === "NORMAL" && <LotCount symbol={gain.symbol}></LotCount>}
        </td>
        <td className="text-center">
          <span>
            {/* {sum.notes} */}
            <span>Note</span>
          </span>
        </td>
        <td>
          <div onClick={() => handleDeleteSymbol(gain.symbol)}>
            <TrashIcon className="w-6 h-6 hover:text-red-600 inline-block"></TrashIcon>
          </div>
        </td>
      </tr>
      <tr className="border-b-2 border-white">
        {showTrade && (
          <td colSpan={10} className="p-2 pl-6">
            <TradeTable symbol={gain.symbol}></TradeTable>
            <React.Suspense
              fallback={<ArrowPathIcon className="animate-spin h-6 w-6" />}
            >
              {mode === "NORMAL" && <AddLot symbol={gain.symbol}></AddLot>}
            </React.Suspense>
          </td>
        )}
      </tr>
    </tbody>
  );
};

const AddLot = ({ symbol }: { symbol: string }) => {
  const symbolGain = useRecoilValue(Selectors.findSymbolGainBySymbol(symbol))!;

  const handleNewTrade = useRecoilCallback(
    ({ set, snapshot }) =>
      async (symbolGain: SymbolGain) => {
        set(Atoms.editModeState, (val) => "EDITING" as Atoms.EditMode);
        let now = new Date();
        const tradeGain: TradeGain = {
          symbol: symbolGain.symbol,
          cost: symbolGain.price,
          dailyGain: 0,
          price: 0,
          quoteDate: symbolGain.quoteDate,
          note: "",
          shares: 1,
          marketValue: symbolGain.price,
          totalGain: 0,
          totalGainPercent: 0,
          dailyGainPercent: 0,
          tradeDate: now.toISOString().split("T")[0],
        };

        try {
          await new APIClient().createTradeGain(tradeGain);
        } catch (error) {
          console.log("API Error", error);
        }

        const symbols = (await snapshot.getPromise(Atoms.symbolsState)).join(
          ","
        );
        const tradeGains = await new APIClient().listTradeGains(symbols);

        set(Atoms.tradeGainsState, (val) => {
          return tradeGains;
        });
        set(Atoms.editModeState, () => "NORMAL" as Atoms.EditMode);
      }
  );

  return (
    <div
      className="text-blue-600 font-bold cursor-pointer"
      onClick={() => handleNewTrade(symbolGain)}
    >
      Add Lot
    </div>
  );
};

const LotCount = ({ symbol }: { symbol: string }) => {
  const trades = useRecoilValue(Selectors.findTradeGainsBySymbol(symbol));

  return (
    <>
      {trades.length > 0 && (
        <span>
          {trades.length}
          <span>Lots</span>
        </span>
      )}
    </>
  );
};
