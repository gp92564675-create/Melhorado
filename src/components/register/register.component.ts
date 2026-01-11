
import { Component, output, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SupabaseService } from '../../services/supabase.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule, FormsModule],
})
export class RegisterComponent {
  supabase = inject(SupabaseService);
  registered = output<void>();
  navigateToLogin = output<void>();

  fullName = '';
  email = '';
  password = '';
  errorMessage = signal<string | null>(null);

  async register() {
    this.errorMessage.set(null);
    try {
      const { error } = await this.supabase.signUp(this.email, this.password, this.fullName);
      if (error) {
        throw error;
      }
      this.registered.emit();
    } catch (error: any) {
      this.errorMessage.set(error.message || 'Ocorreu um erro ao criar a conta.');
    }
  }

  goToLogin() {
    this.navigateToLogin.emit();
  }
}
