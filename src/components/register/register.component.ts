
import { Component, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  imports: [CommonModule],
})
export class RegisterComponent {
  registered = output<void>();
  navigateToLogin = output<void>();

  register() {
    // Simulate a successful registration and login
    this.registered.emit();
  }

  goToLogin() {
    this.navigateToLogin.emit();
  }
}
