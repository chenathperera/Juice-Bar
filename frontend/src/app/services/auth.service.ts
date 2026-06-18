import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;
  private readonly tokenStorageKey = 'freshsip_token';

  constructor(
    private http: HttpClient,
    private router: Router
  ) {}

  login(loginRequest: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, loginRequest).pipe(
      tap((response) => this.storeToken(response.token))
    );
  }

  storeToken(token: string): void {
    localStorage.setItem(this.tokenStorageKey, token);
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenStorageKey);
  }

  getDecodedToken(): Record<string, unknown> | null {
    const token = this.getToken();

    if (!token) {
      return null;
    }

    const tokenParts = token.split('.');

    if (tokenParts.length !== 3) {
      return null;
    }

    try {
      const payload = tokenParts[1]
        .replace(/-/g, '+')
        .replace(/_/g, '/');

      const paddedPayload = payload.padEnd(payload.length + (4 - payload.length % 4) % 4, '=');
      const decodedPayload = atob(paddedPayload);

      return JSON.parse(decodedPayload) as Record<string, unknown>;
    } catch {
      return null;
    }
  }

  getUserRole(): string | null {
    const decodedToken = this.getDecodedToken();

    if (!decodedToken) {
      return null;
    }

    const roleClaim = decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'];

    return typeof roleClaim === 'string' ? roleClaim : null;
  }

  logout(): void {
    localStorage.removeItem(this.tokenStorageKey);
    this.router.navigate(['/login']);
  }

  isLoggedIn(): boolean {
    return this.getToken() !== null;
  }
}
