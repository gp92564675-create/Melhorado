
import { Component, ChangeDetectionStrategy, signal, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { SignalsComponent } from './components/signals/signals.component';
import { HistoryComponent } from './components/history/history.component';
import { SettingsComponent } from './components/settings/settings.component';
import { BrokersComponent } from './components/brokers/brokers.component';
import { SupabaseService } from './services/supabase.service';

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
export class AppComponent implements OnInit {
  supabase = inject(SupabaseService);
  isLoggedIn = signal(false);
  currentView = signal<View>('dashboard');
  authView = signal<AuthView>('login');

  async ngOnInit() {
    const { data } = await this.supabase.getSession();
    this.isLoggedIn.set(!!data.session);

    this.supabase.authChanges((_event, session) => {
      this.isLoggedIn.set(!!session);
    });
  }

  loginSuccess() {
    this.isLoggedIn.set(true);
    this.currentView.set('dashboard');
  }

  async logout() {
    await this.supabase.signOut();
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
