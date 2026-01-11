
export interface TradeSignal {
  id: number;
  asset: string;
  type: 'CALL' | 'PUT';
  timeframe: 'M1' | 'M5';
  expiration: number;
  probability: number;
  strategy: string;
}

export interface TradeHistory extends TradeSignal {
  result: 'WIN' | 'LOSS';
  timestamp: number;
  amount: number;
  profit: number;
}

export interface RiskSettings {
  riskPerTrade: number;
  dailyStopLoss: number;
  dailyStopWin: number;
}
