
import { Component, ChangeDetectionStrategy, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingService } from '../../services/trading.service';
import { TradeSignal } from '../../models/trading.model';

@Component({
  selector: 'app-signals',
  templateUrl: './signals.component.html',
  imports: [CommonModule],
})
export class SignalsComponent {
  tradingService = inject(TradingService);
  activeSignals = this.tradingService.activeSignals;
  connectedBroker = this.tradingService.connectedBroker;
  
  confirmingSignal = signal<TradeSignal | null>(null);
  manualTradeAmount = signal(10); // Default trade amount

  startTrade(signal: TradeSignal) {
    if (this.connectedBroker()) {
      // Set a default trade amount based on risk, but allow user to change it
      const riskPercent = this.tradingService.settings().riskPerTrade;
      const balance = this.tradingService.accountBalance();
      const defaultAmount = parseFloat((balance * (riskPercent / 100)).toFixed(2));
      this.manualTradeAmount.set(defaultAmount > 1 ? defaultAmount : 1);
      
      this.confirmingSignal.set(signal);
    }
  }

  cancelTrade() {
    this.confirmingSignal.set(null);
  }

  confirmTrade() {
    const signalToExecute = this.confirmingSignal();
    if (signalToExecute) {
      this.tradingService.executeTrade(signalToExecute, this.manualTradeAmount());
    }
    this.confirmingSignal.set(null);
  }

  onAmountChange(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.manualTradeAmount.set(isNaN(value) ? 0 : value);
  }
}