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
    return this.currentPath.startsWith('/admin');
  }

  get isImmersiveRoute(): boolean {
    return this.currentPath === '/' || this.currentPath.startsWith('/products') || this.currentPath.startsWith('/cart');
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

  private get currentPath(): string {
    return this.router.url.split('#')[0].split('?')[0] || '/';
  }
}
