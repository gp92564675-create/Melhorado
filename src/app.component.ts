
import { Component, ChangeDetectionStrategy, signal } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignalsComponent } from './components/signals/signals.component';
import { HistoryComponent } from './components/history/history.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BrokersComponent } from './components/brokers/brokers.component';

type View = 'dashboard' | 'signals' | 'history' | 'settings' | 'brokers';
type AuthView = 'login' | 'register';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    LoginComponent,
    RegisterComponent,
    DashboardComponent,
    SignalsComponent,
    HistoryComponent,
    SettingsComponent,
    BrokersComponent,
  ],
})
export class AppComponent {
  isLoggedIn = signal(false);
  currentView = signal<View>('dashboard');
  authView = signal<AuthView>('login');

  loginSuccess() {
    this.isLoggedIn.set(true);
    this.currentView.set('dashboard');
  }

  logout() {
    this.isLoggedIn.set(false);
    this.authView.set('login');
  }

  changeView(view: View) {
    this.currentView.set(view);
  }

  setAuthView(view: AuthView) {
    this.authView.set(view);
  }
}
