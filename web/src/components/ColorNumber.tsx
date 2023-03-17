import { decimalFormat } from "../utils/util";

type IProp = {
  /**
   * 數值
   */
  num: number;
  /**
   * 是否顯示成百分比
   */
  percent?: boolean;
  /**
   * 是否隱藏數值,隱藏後會顯示成 ‘-’
   */
  hidden?: boolean;
  /**
   * 匯率轉換
   */
  rate?: number;
  /**
   * 是否在數值外加上括號, ex (-1.23)
   */
  parentheses?: boolean;
  /**
   * 是否顯示顏色,正數: 綠色, 負數: 紅色
   */
  colorful?: boolean;
  /**
   * 正數時是否顯示 ‘+’ 號
   */
  sign?: boolean;
};

export const ColorNumber = ({
  num,
  percent,
  hidden,
  rate,
  parentheses,
  colorful = true,
  sign = true,
}: IProp) => {
  if (hidden) {
    return <span> - </span>;
  } else {
    let display;
    if (rate) {
      display = decimalFormat.format(num * rate);
    } else {
      display = decimalFormat.format(num);
    }

    if (percent) {
      display = display + "%";
    }

    if (sign) {
      if (num >= 0) {
        display = "+" + display;
      }
    }

    if (parentheses) {
      display = `(${display})`;
    }

    if (colorful) {
      let color;
      if (num >= 0) {
        color = "text-green-600";
      } else {
        color = "text-red-600";
      }
      return <span className={color}>{display}</span>;
    } else {
      return <span>{display}</span>;
    }
  }
};
