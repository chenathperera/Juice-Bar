import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-menu',
  imports: [CommonModule, RouterLink],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.css'
})
export class AccountMenuComponent {
  isOpen = false;

  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  toggleMenu(event: MouseEvent): void {
    event.stopPropagation();
    this.isOpen = !this.isOpen;
  }

  closeMenu(): void {
    this.isOpen = false;
  }

  logout(): void {
    this.isOpen = false;
    this.authService.logout();
  }

  @HostListener('document:click')
  onDocumentClick(): void {
    this.isOpen = false;
  }
}
