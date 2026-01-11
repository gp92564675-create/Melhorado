
import { Component, ChangeDetectionStrategy, output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  imports: [CommonModule],
})
export class LoginComponent {
  loggedIn = output<void>();
  navigateToRegister = output<void>();

  login() {
    // Simulate a successful login
    this.loggedIn.emit();
  }

  goToRegister() {
    this.navigateToRegister.emit();
  }
}
