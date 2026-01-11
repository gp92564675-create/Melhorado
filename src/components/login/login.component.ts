
import { Component, ChangeDetectionStrategy, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule, FormsModule],
})
export class LoginComponent {
  supabase = inject(SupabaseService);
  loggedIn = output<void>();
  navigateToRegister = output<void>();
  
  email = '';
  password = '';
  errorMessage = signal<string | null>(null);

  async login() {
    this.errorMessage.set(null);
    try {
      const { error } = await this.supabase.signIn(this.email, this.password);
      if (error) {
        throw error;
      }
      this.loggedIn.emit();
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Ocorreu um erro ao fazer login.');
    }
  }

  goToRegister() {
    this.navigateToRegister.emit();
  }
}
