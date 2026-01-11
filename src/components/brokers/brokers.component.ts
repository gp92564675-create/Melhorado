
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
    { name: 'Quotex', logo: 'https://images.quotex.com/symbols/quotex-white.svg', needsInvert: false },
    { name: 'IQ Option', logo: 'https://static.iqoption.com/assets/images/header/logo-black.svg', needsInvert: true },
    { name: 'Binomo', logo: 'https://binomo.com/assets/platform/img/logo-white.svg', needsInvert: false },
    { name: 'Pocket Option', logo: 'https://pocketoption.com/themes/prestashop/assets/img/logo.svg', needsInvert: false },
    { name: 'Deriv', logo: 'https://deriv.com/static/public-deriv-logo.svg', needsInvert: true },
    { name: 'ExpertOption', logo: 'https://expertoption.com/img/logo-light.svg', needsInvert: false },
    { name: 'Olymp Trade', logo: 'https://olymptrade.com/img/logo-white.svg', needsInvert: false },
    { name: 'Exnova', logo: 'https://exnova.com/themes/exnova/assets/img/logo-white.svg', needsInvert: false },
    { name: 'Nadex', logo: 'https://www.nadex.com/wp-content/uploads/2022/11/Nadex_Logo_Primary_KO-1.svg', needsInvert: false },
    { name: 'Nexus', logo: '', needsInvert: false } // Placeholder for Nexus
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
