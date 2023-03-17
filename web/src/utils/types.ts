/**
 * 成交
 */
export type Trade = {
  /**
   * id
   */
  id: number;
  /**
   * 股票名稱
   */
  symbol: string;
  /**
   * 成交日期
   */
  tradeDate: string;
  /**
   * 股數
   */
  shares: number;
  /**
   * 成交價
   */
  cost: number;
  /**
   * 註解
   */
  note?: string;
  /**
   * 手續費
   */
  fee: number;
  /**
   * 稅
   */
  tax: number;
};

/**
 * 損益
 */
export type GainBase = {
  /**
   * symbol
   */
  symbol: string;
  /**
   * 價格
   */
  price: number;
  /**
   * 報價日期
   */
  quoteDate: string;
  /**
   * 持有成本
   */
  cost: number;
  /**
   * 股數
   */
  shares: number;
  /**
   * 市值
   */
  marketValue: number;
  /**
   * 漲跌(日)
   */
  dailyGain: number;
  /**
   * 漲跌幅(日)
   */
  dailyGainPercent: number;
  /**
   * 漲跌
   */
  totalGain: number;
  /**
   * 漲跌幅
   */
  totalGainPercent: number;
};

/**
 * 交易損益. 以單筆交易為單位的損益
 */
export type TradeGain = GainBase & {
  /**
   * trade primary key
   */
  tradeId?: number;
  /**
   * 交易時間
   */
  tradeDate: string;
  /**
   * note
   */
  note: string;
};

/**
 * 股票損益. 以單一股票為單位的損益
 */
export type SymbolGain = GainBase & {
  // /**
  //  * 交易
  //  */
  // trades?: TradeGain[];
  /**
   * 漲跌
   */
  change: number;
  /**
   * 漲跌(%)
   */
  changePercent: number;
};

/**
 * 總和損益
 */
export type TotalGain = {
  /**
   * 市值
   */
  marketValue: number;
  /**
   * 已實現損益
   */
  realized: number;
  /**
   * 未實現損益
   */
  unrealized: number;
  /**
   * 漲跌(日)
   */
  dailyGain: number;
  /**
   * 漲跌幅(日)
   */
  dailyGainPercent: number;
  /**
   * 漲跌
   */
  totalGain: number;
  /**
   * 漲跌幅
   */
  totalGainPercent: number;
};

/**
 * 行情信息
 */
export type Quote = {
  /**
   * 報價時間
   */
  date: string;
  /**
   * 股票代碼
   */
  symbol: string;
  /**
   * 前收盤價
   */
  previousClose: number;
  /**
   * 最新價
   */
  close: number;
  /**
   * 量
   */
  volume: number;
  /**
   * 當日最高價
   */
  high: number;
  /**
   * 當日最低價
   */
  low: number;
  /**
   * 開盤價
   */
  open: number;
  /**
   * 漲跌
   */
  change: number;
  /**
   * 漲跌幅
   */
  changePercent: number;
};

/**
 * 股票
 */
export type Stock = {
  quoteType: string;
  /**
   * 股票代號
   */
  symbol: string;
  /**
   * 公司名稱
   */
  shortname: string;
  /**
   * 國家
   */
  country: string;
  /**
   *
   */
  industry: string;
  /**
   *
   */
  sector: string;
};
