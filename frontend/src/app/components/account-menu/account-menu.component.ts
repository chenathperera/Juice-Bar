import { CommonModule } from '@angular/common';
import { Component, ElementRef, HostListener } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-account-menu',
  imports: [CommonModule],
  templateUrl: './account-menu.component.html',
  styleUrl: './account-menu.component.css'
})
export class AccountMenuComponent {
  isOpen = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private elementRef: ElementRef<HTMLElement>
  ) {}

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

  navigateTo(path: string): void {
    this.isOpen = false;
    this.router.navigate([path]);
  }

  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    const targetNode = event.target as Node | null;

    if (targetNode && this.elementRef.nativeElement.contains(targetNode)) {
      return;
    }

    this.isOpen = false;
  }
}
