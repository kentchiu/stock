import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { Suspense } from "react";
import { Link } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { DonutChart, DonutChartData } from "../components/DonutChart";
import { useCurrencyRate } from "../hooks";
import { symbolGainsState } from "../recoil/atoms";
import ErrorBoundary from "../utils/ErrorBoundry";
import { decimalFormat } from "../utils/util";

export const ChartPage = () => {
  return (
    <>
      <div>
        <Link to="/">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="2em"
            height="2em"
            viewBox="0 0 24 24"
          >
            <path
              fill="currentColor"
              d="m12 20l-8-8l8-8l1.425 1.4l-5.6 5.6H20v2H7.825l5.6 5.6Z"
            ></path>
          </svg>
        </Link>
      </div>
      <div className="flex">
        <ErrorBoundary>
          <Suspense
            fallback={<ArrowPathIcon className="animate-spin h-6 w-6" />}
          >
            <DailyGain></DailyGain>
          </Suspense>
        </ErrorBoundary>
      </div>
      <div className="flex">
        <ErrorBoundary>
          <Suspense
            fallback={<ArrowPathIcon className="animate-spin h-6 w-6" />}
          >
            <TotalGain></TotalGain>
          </Suspense>
        </ErrorBoundary>
      </div>
    </>
  );
};
const DailyGain = () => {
  const rate = useCurrencyRate();
  const gains = useRecoilValue(symbolGainsState);

  const dailyProfits = gains
    .filter((g) => g.dailyGain > 0)
    .map((val) => {
      const result: DonutChartData = {
        symbol: val.symbol!,
        value: val.dailyGain,
      };
      return result;
    });

  const dailyProfitSum =
    dailyProfits.length === 0
      ? 0
      : dailyProfits.map((v) => v.value).reduce((p, c) => p + c) * rate;

  const dailyLosses = gains
    .filter((g) => g.dailyGain < 0)
    .map((val) => {
      const result: DonutChartData = {
        symbol: val.symbol!,
        value: -val.dailyGain,
      };
      return result;
    });
  const dailyLossSum =
    dailyLosses.length === 0
      ? 0
      : dailyLosses.map((v) => v.value).reduce((p, c) => p + c) * rate;

  return (
    <>
      <div>
        <DonutChart
          data={dailyProfits}
          title={`Daily Profit`}
          subTitle={decimalFormat.format(dailyProfitSum)}
          width={400}
          height={400}
          rate={rate}
        ></DonutChart>
      </div>
      <div>
        <DonutChart
          data={dailyLosses}
          title={`Daily Loss`}
          subTitle={decimalFormat.format(dailyLossSum)}
          width={400}
          height={400}
          rate={rate}
        ></DonutChart>
      </div>
    </>
  );
};

const TotalGain = () => {
  const rate = useCurrencyRate();
  const gains = useRecoilValue(symbolGainsState);

  const totalProfits = gains
    .filter((g) => g.totalGain > 0)
    .map((val) => {
      const result: DonutChartData = {
        symbol: val.symbol!,
        value: val.totalGain,
      };
      return result;
    });

  const totalProfitSum =
    totalProfits.length === 0
      ? 0
      : totalProfits.map((v) => v.value).reduce((p, c) => p + c) * rate;

  const totalLosses = gains
    .filter((g) => g.totalGain < 0)
    .map((val) => {
      const result: DonutChartData = {
        symbol: val.symbol!,
        value: -val.totalGain,
      };
      return result;
    });

  const totalLossSum =
    totalLosses.length === 0
      ? 0
      : totalLosses.map((v) => v.value).reduce((p, c) => p + c) * rate;

  const marketValues = gains.map((val) => {
    const result: DonutChartData = {
      symbol: val.symbol!,
      value: val.marketValue,
    };
    return result;
  });

  const markValueSum =
    marketValues.length === 0
      ? 0
      : marketValues.map((v) => v.value).reduce((p, c) => p + c) * rate;
  return (
    <>
      <div>
        <DonutChart
          data={totalProfits}
          title={`Total Profit`}
          subTitle={decimalFormat.format(totalProfitSum)}
          width={400}
          height={400}
          rate={rate}
        ></DonutChart>
      </div>
      <div>
        <DonutChart
          data={totalLosses}
          title={`Total Loss`}
          subTitle={decimalFormat.format(totalLossSum)}
          width={400}
          height={400}
          rate={rate}
        ></DonutChart>
      </div>
      <div>
        <DonutChart
          data={marketValues}
          title="Market Value"
          subTitle={decimalFormat.format(markValueSum)}
          width={400}
          height={400}
          rate={rate}
        ></DonutChart>
      </div>
    </>
  );
};
