import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Juice } from '../models/juice.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class JuiceService {
  private readonly apiUrl = `${environment.apiUrl}/juices`;

  constructor(private http: HttpClient) {}

  getJuices(): Observable<Juice[]> {
    return this.http.get<Juice[]>(this.apiUrl);
  }

  getJuiceById(id: number): Observable<Juice> {
    return this.http.get<Juice>(`${this.apiUrl}/${id}`);
  }

  createJuice(juice: Juice): Observable<Juice> {
    return this.http.post<Juice>(this.apiUrl, juice);
  }

  updateJuice(id: number, juice: Juice): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, juice);
  }

  deleteJuice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}
