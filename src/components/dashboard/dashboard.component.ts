
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingService } from '../../services/trading.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  imports: [CommonModule],
})
export class DashboardComponent {
  tradingService = inject(TradingService);

  winRate = this.tradingService.winRate;
  winCount = this.tradingService.winCount;
  lossCount = this.tradingService.lossCount;
  accountBalance = this.tradingService.accountBalance;
}
