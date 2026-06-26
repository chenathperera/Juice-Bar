import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile',
  imports: [CommonModule, RouterLink, SiteFooterComponent],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.css'
})
export class ProfileComponent {
  constructor(private authService: AuthService) {}

  get isLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  get userRole(): string {
    return this.authService.getUserRole() ?? 'Guest';
  }

  get userName(): string {
    const token = this.authService.getDecodedToken();
    const possibleName =
      token?.['unique_name'] ??
      token?.['name'] ??
      token?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'];

    return typeof possibleName === 'string' ? possibleName : 'Not available';
  }

  get userEmail(): string {
    const token = this.authService.getDecodedToken();
    const possibleEmail =
      token?.['email'] ??
      token?.['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'] ??
      token?.['sub'];

    return typeof possibleEmail === 'string' ? possibleEmail : 'Not available';
  }
}
