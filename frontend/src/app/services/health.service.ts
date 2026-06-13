import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class HealthService {
  constructor(private http: HttpClient) {}

  getApiStatus(): Observable<string> {
    return this.http.get('/api/health', { responseType: 'text' });
  }
}
