import { useRecoilValue } from "recoil";
import { currencyState } from "../recoil/atoms";

export const useCurrencyRate = () => {
  const currency = useRecoilValue(currencyState);
  let rate = 1.0;
  if (currency === "TWD") {
    rate = 28.5;
  }
  return rate;
};
