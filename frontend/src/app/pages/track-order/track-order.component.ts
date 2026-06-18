import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-track-order',
  imports: [CommonModule, FormsModule],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css'
})
export class TrackOrderComponent {
  orderId: number | null = null;
  order: Order | null = null;
  isLoading = false;
  errorMessage = '';

  constructor(private orderService: OrderService) {}

  trackOrder(form: NgForm): void {
    if (form.invalid || this.orderId === null) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.order = null;

    this.orderService.getOrderById(this.orderId).subscribe({
      next: (order) => {
        this.order = order;
        this.isLoading = false;
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.errorMessage = 'Order not found. Please check the order id and try again.';
        } else {
          this.errorMessage = 'Unable to track the order right now. Please try again.';
        }

        this.isLoading = false;
      }
    });
  }
}
