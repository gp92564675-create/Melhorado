import { Injectable, signal, computed, effect, inject } from '@angular/core';
import { TradeSignal, TradeHistory, RiskSettings } from '../models/trading.model';
import { SupabaseService } from './supabase.service';
import { User } from '@supabase/supabase-js';

@Injectable({ providedIn: 'root' })
export class TradingService {
  private supabase = inject(SupabaseService);
  private nextSignalId = 1;
  private readonly PAYOUT_RATE = 0.87; // 87% payout for a win

  // State Signals
  activeSignals = signal<TradeSignal[]>([]);
  tradeHistory = signal<TradeHistory[]>([]);
  settings = signal<RiskSettings>({ riskPerTrade: 2, dailyStopLoss: 10, dailyStopWin: 8 });
  accountBalance = signal(0);
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

    // React to auth changes
    effect(async () => {
      const user = this.supabase.currentUser();
      if (user) {
        await this.loadUserData(user);
      } else {
        this.clearUserData();
      }
    });
  }
  
  private async loadUserData(user: User) {
    const [profile, history] = await Promise.all([
      this.supabase.getProfile(user),
      this.supabase.getTradeHistory(user)
    ]);

    if (profile) {
      this.accountBalance.set(profile.account_balance);
      this.settings.set({
        riskPerTrade: profile.risk_per_trade,
        dailyStopLoss: profile.daily_stop_loss,
        dailyStopWin: profile.daily_stop_win,
      });
    }
    
    if (history) {
      this.tradeHistory.set(history);
    }
  }

  private clearUserData() {
    this.accountBalance.set(0);
    this.tradeHistory.set([]);
    this.settings.set({ riskPerTrade: 2, dailyStopLoss: 10, dailyStopWin: 8 });
    this.connectedBroker.set(null);
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

  async executeTrade(signal: TradeSignal, amount: number) {
    const user = this.supabase.currentUser();
    if (amount <= 0 || !user) return;

    this.activeSignals.update(signals => signals.filter(s => s.id !== signal.id));

    const isWin = Math.random() * 100 < signal.probability;
    const profit = isWin ? amount * this.PAYOUT_RATE : -amount;
    
    const newBalance = this.accountBalance() + profit;
    this.accountBalance.set(newBalance);

    const historyEntry: Omit<TradeHistory, 'id'> = {
      ...signal,
      result: isWin ? 'WIN' : 'LOSS',
      timestamp: Date.now(),
      amount: amount,
      profit: profit,
    };

    // Persist to Supabase
    const savedTrade = await this.supabase.addTradeToHistory(user, historyEntry);
    if (savedTrade) {
        this.tradeHistory.update(history => [savedTrade, ...history]);
    }
    await this.supabase.updateProfile(user, { account_balance: newBalance });
  }

  async syncWithBroker(brokerName: string) {
    // Simulate API delay to fetch data
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Simulate fetching a new balance from the broker
    const newBalance = Math.random() * (10000 - 500) + 500; // Random balance between $500 and $10,000
    this.accountBalance.set(parseFloat(newBalance.toFixed(2)));

    // Set connected broker status
    this.connectBroker(brokerName);

    // Persist new balance to the user's profile in the database
    const user = this.supabase.currentUser();
    if (user) {
      await this.supabase.updateProfile(user, { account_balance: this.accountBalance() });
    }
  }
  
  connectBroker(brokerName: string) {
    this.connectedBroker.set(brokerName);
  }

  disconnectBroker() {
    this.connectedBroker.set(null);
  }

  async updateSettings(newSettings: RiskSettings) {
    const user = this.supabase.currentUser();
    if (!user) return;
    
    this.settings.set(newSettings);
    await this.supabase.updateProfile(user, {
      risk_per_trade: newSettings.riskPerTrade,
      daily_stop_loss: newSettings.dailyStopLoss,
      daily_stop_win: newSettings.dailyStopWin
    });
  }
}