
import { Component, ChangeDetectionStrategy, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TradingService } from '../../services/trading.service';

@Component({
  selector: 'app-brokers',
  templateUrl: './brokers.component.html',
  imports: [CommonModule],
})
export class BrokersComponent {
  tradingService = inject(TradingService);
  connectedBroker = this.tradingService.connectedBroker;
  
  showLoginModal = signal<string | null>(null);

  brokers = [
    { name: 'Quotex', logo: 'https://images.quotex.com/symbols/quotex-white.svg' },
    { name: 'IQ Option', logo: 'https://static.iqoption.com/assets/images/header/logo-black.svg' },
    { name: 'Binomo', logo: 'https://binomo.com/assets/platform/img/logo-white.svg' },
    { name: 'Pocket Option', logo: 'https://pocketoption.com/themes/prestashop/assets/img/logo.svg' },
    { name: 'Nexus', logo: '' } // Placeholder for Nexus
  ];

  handleConnectClick(brokerName: string) {
    if (this.connectedBroker() === brokerName) {
      this.tradingService.disconnectBroker();
    } else {
      this.showLoginModal.set(brokerName);
    }
  }

  cancelBrokerLogin() {
    this.showLoginModal.set(null);
  }
  
  confirmBrokerLogin() {
    const brokerToLogin = this.showLoginModal();
    if (brokerToLogin) {
      this.tradingService.connectBroker(brokerToLogin);
    }
    this.showLoginModal.set(null);
  }
}
