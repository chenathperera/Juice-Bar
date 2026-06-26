import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, RouterLink, RouterLinkActive],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'FreshSip Juice Bar';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get isAdmin(): boolean {
    return this.authService.getUserRole() === 'Admin';
  }

  get isAdminRoute(): boolean {
    return this.router.url.startsWith('/admin');
  }

  get isImmersiveRoute(): boolean {
    return this.router.url === '/' || this.router.url.startsWith('/products') || this.router.url.startsWith('/cart');
  }

  get showDefaultNav(): boolean {
    return !this.isAdminRoute && !this.isImmersiveRoute;
  }

  get showAdminNav(): boolean {
    return this.isAdminRoute;
  }

  logout(): void {
    this.authService.logout();
  }
}
