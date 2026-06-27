import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { CheckoutSessionResponse, CreateCheckoutSessionRequest, Order } from '../models/order.model';

@Injectable({
  providedIn: 'root'
})
export class PaymentService {
  private readonly apiUrl = `${environment.apiUrl}/payments`;

  constructor(private http: HttpClient) {}

  createCheckoutSession(request: CreateCheckoutSessionRequest): Observable<CheckoutSessionResponse> {
    return this.http.post<CheckoutSessionResponse>(`${this.apiUrl}/create-checkout-session`, request);
  }

  verifySuccessfulPayment(sessionId: string): Observable<Order> {
    const params = new HttpParams().set('session_id', sessionId);
    return this.http.get<Order>(`${this.apiUrl}/success`, { params });
  }
}
