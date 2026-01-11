
import { Injectable, signal, computed, effect } from '@angular/core';
import { TradeSignal, TradeHistory, RiskSettings } from '../models/trading.model';

@Injectable({ providedIn: 'root' })
export class TradingService {
  private nextSignalId = 1;
  private readonly PAYOUT_RATE = 0.87; // 87% payout for a win

  // State Signals
  activeSignals = signal<TradeSignal[]>([]);
  tradeHistory = signal<TradeHistory[]>([]);
  settings = signal<RiskSettings>({
    riskPerTrade: 2,
    dailyStopLoss: 10,
    dailyStopWin: 8,
  });
  accountBalance = signal(10000); // Starting with a $10,000 mock balance
  connectedBroker = signal<string | null>(null);

  // Computed Signals for Stats
  winCount = computed(() => this.tradeHistory().filter(t => t.result === 'WIN').length);
  lossCount = computed(() => this.tradeHistory().filter(t => t.result === 'LOSS').length);
  totalTrades = computed(() => this.tradeHistory().length);
  winRate = computed(() => {
    const total = this.totalTrades();
    return total > 0 ? (this.winCount() / total) * 100 : 0;
  });

  constructor() {
    this.generateMockSignal();
    setInterval(() => this.generateMockSignal(), 15000);
  }

  private generateMockSignal() {
    if (this.activeSignals().length >= 5) return;
    const assets = ['EUR/USD', 'GBP/USD', 'USD/JPY', 'AUD/CAD', 'EUR/JPY'];
    const strategies = ['Confluência de Tendência', 'Reversão em Zona Extrema', 'Horário e Volatilidade'];

    const newSignal: TradeSignal = {
      id: this.nextSignalId++,
      asset: assets[Math.floor(Math.random() * assets.length)],
      type: Math.random() > 0.5 ? 'CALL' : 'PUT',
      timeframe: Math.random() > 0.5 ? 'M1' : 'M5',
      expiration: Date.now() + 60000 * (Math.random() > 0.5 ? 1 : 5),
      probability: Math.floor(Math.random() * 11) + 90,
      strategy: strategies[Math.floor(Math.random() * strategies.length)],
    };

    this.activeSignals.update(signals => [...signals, newSignal]);
  }

  executeTrade(signal: TradeSignal, amount: number) {
    if (amount <= 0) return;

    this.activeSignals.update(signals => signals.filter(s => s.id !== signal.id));

    const isWin = Math.random() * 100 < signal.probability;
    const profit = isWin ? amount * this.PAYOUT_RATE : -amount;

    this.accountBalance.update(balance => balance + profit);

    const historyEntry: TradeHistory = {
      ...signal,
      result: isWin ? 'WIN' : 'LOSS',
      timestamp: Date.now(),
      amount: amount,
      profit: profit,
    };

    this.tradeHistory.update(history => [historyEntry, ...history]);
  }
  
  connectBroker(brokerName: string) {
    this.connectedBroker.set(brokerName);
    // Simulate fetching account balance from the connected broker
    const simulatedBalance = Math.random() * (20000 - 500) + 500;
    this.accountBalance.set(simulatedBalance);
  }

  disconnectBroker() {
    this.connectedBroker.set(null);
  }

  updateSettings(newSettings: RiskSettings) {
    this.settings.set(newSettings);
  }
}