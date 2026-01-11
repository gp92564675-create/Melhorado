
import { Component, ChangeDetectionStrategy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingService } from '../../services/trading.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  imports: [CommonModule],
})
export class HistoryComponent {
  tradingService = inject(TradingService);
  tradeHistory = this.tradingService.tradeHistory;
}
