
import { Component, ChangeDetectionStrategy, inject, signal, effect } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingService } from '../../services/trading.service';
import { RiskSettings } from '../../models/trading.model';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  imports: [CommonModule],
})
export class SettingsComponent {
  tradingService = inject(TradingService);
  
  settings = signal<RiskSettings>({ riskPerTrade: 0, dailyStopLoss: 0, dailyStopWin: 0 });
  savedMessageVisible = signal(false);

  constructor() {
    // Initialize component signal with service state
    this.settings.set(this.tradingService.settings());
  }

  updateRiskPerTrade(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.settings.update(s => ({ ...s, riskPerTrade: value }));
  }

  updateStopLoss(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.settings.update(s => ({ ...s, dailyStopLoss: value }));
  }

  updateStopWin(event: Event) {
    const value = (event.target as HTMLInputElement).valueAsNumber;
    this.settings.update(s => ({ ...s, dailyStopWin: value }));
  }

  saveSettings() {
    this.tradingService.updateSettings(this.settings());
    this.savedMessageVisible.set(true);
    setTimeout(() => this.savedMessageVisible.set(false), 3000);
  }
}
