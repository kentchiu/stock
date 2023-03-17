import { ArrowPathIcon, ChartPieIcon } from "@heroicons/react/24/outline";
import classNames from "classnames";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { ColorNumber } from "../components/ColorNumber";
import { HoldingTable } from "../components/HoldingTable";
import SymbolCombobox from "../components/SymbolCombobox";
import { useCurrencyRate } from "../hooks";
import {
  Currency,
  currencyState,
  symbolGainsState,
  symbolsState,
} from "../recoil/atoms";
import { getTotalGain, listTrades } from "../recoil/selectors";
import ErrorBoundary from "../utils/ErrorBoundry";
import { Stock, Trade } from "../utils/types";

export const PortfolioPage = () => {
  return (
    <>
      <div className="w-full p-4">
        <ErrorBoundary>
          <Suspense
            fallback={<ArrowPathIcon className="animate-spin h-6 w-6" />}
          >
            <Header></Header>
          </Suspense>
        </ErrorBoundary>
        <div className="p-2"></div>
        <ErrorBoundary>
          <div className="flex ">
            <Suspense
              fallback={<ArrowPathIcon className="animate-spin h-6 w-6" />}
            >
              <AddSymbolInput></AddSymbolInput>
              <DefaultPortfolioButton></DefaultPortfolioButton>
            </Suspense>
          </div>
        </ErrorBoundary>
        <ErrorBoundary>
          <HoldingTable />
        </ErrorBoundary>
      </div>
    </>
  );
};

const DefaultPortfolioButton = () => {
  const gains = useRecoilValue(symbolGainsState);
  const trades: Trade[] = useRecoilValue(listTrades);
  const setSymbols = useSetRecoilState(symbolsState);
  let show = gains.length === 0 && trades.length !== 0;
  const handleCreateDefaultPortfolio = async () => {
    const symbols = Array.from(new Set(trades.map((v) => v.symbol)));
    setSymbols(symbols);
  };

  return (
    <>
      {show && (
        <button
          className="text-indigo-500 border-2 rounded-md p-1 border-indigo-400 hover:border-indigo-600"
          onClick={handleCreateDefaultPortfolio}
        >
          Import Portfolio
        </button>
      )}
    </>
  );
};

const AddSymbolInput = () => {
  const [symbols, setSymbols] = useRecoilState(symbolsState);
  const handleAddSymbol = (stock: Stock) => {
    setSymbols([...symbols, stock.symbol]);
  };
  return (
    <>
      <div>
        <SymbolCombobox
          className="flex flex-row items-center"
          onSelect={handleAddSymbol}
        ></SymbolCombobox>
      </div>
    </>
  );
};

const Header = () => {
  return (
    <>
      <div className="h-32 shadow-md p-4 flex justify-between">
        <div>
          <div className="text-gray-400">Market Value</div>
          <MarketValue />
        </div>
        <div>
          <div className="text-gray-400">Unrealized Profit</div>
          <UnrealizedProfit />
        </div>
        <div>
          <div className="text-gray-400">Realized Profit</div>
          <RealizedProfit />
        </div>
        <Chart />
        <div className="flex flex-col justify-between">
          <CurrencySwitch />
          {/* <div>{quotes[0]?.date}</div> */}
        </div>
      </div>
    </>
  );
};

const MarketValue = () => {
  const rate = useCurrencyRate();
  const currency = useRecoilValue(currencyState);
  const gain = useRecoilValue(getTotalGain)!;

  return (
    <div>
      <div className="text-3xl font-extrabold">
        $
        <ColorNumber
          num={gain.marketValue}
          colorful={false}
          sign={false}
          rate={rate}
        />
        <span className="text-lg">{currency}</span>
      </div>
    </div>
  );
};

const UnrealizedProfit = () => {
  const gain = useRecoilValue(getTotalGain)!;
  const rate = useCurrencyRate();
  return (
    <div className="font-semibold">
      <div className="flex justify-around w-64">
        <div>Day Gain </div>
        <div>
          <ColorNumber num={gain.dailyGain} rate={rate} />
          <ColorNumber num={gain.dailyGainPercent} percent parentheses />
        </div>
      </div>
      <div className="flex justify-around w-64">
        <div>Total Gain </div>
        <div>
          <ColorNumber num={gain.totalGain} rate={rate} />
          <ColorNumber num={gain.totalGainPercent} percent parentheses />
        </div>
      </div>
    </div>
  );
};

const RealizedProfit = () => {
  const gain = useRecoilValue(getTotalGain)!;
  const percent = 0;
  const rate = useCurrencyRate();
  return (
    <div>
      <ColorNumber num={gain.realized} rate={rate} />
      <ColorNumber num={percent} percent parentheses />
    </div>
  );
};

const CurrencySwitch = () => {
  const [currency, setCurrency] = useRecoilState(currencyState);
  const handleSetCurrency = (c: Currency) => {
    setCurrency(c);
  };
  const twd = classNames("tw w-6 h-6 rounded-full", {
    "ring-2": currency === "TWD",
    "cursor-pointer": currency !== "TWD",
  });
  const usd = classNames("us w-6 h-6 rounded-full", {
    "ring-2": currency === "USD",
    "cursor-pointer": currency !== "USD",
  });
  return (
    <div className="flex">
      <div className={twd} onClick={() => handleSetCurrency("TWD")}></div>
      <div className={usd} onClick={() => handleSetCurrency("USD")}></div>
    </div>
  );
};

const Chart = () => {
  return (
    <div className="flex">
      <Link to="/chart">
        <ChartPieIcon className="h-16 w-16 fill-green-500" />
      </Link>
    </div>
  );
};
