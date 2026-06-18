import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-list',
  imports: [CommonModule, FormsModule],
  templateUrl: './order-list.component.html',
  styleUrl: './order-list.component.css'
})
export class OrderListComponent implements OnInit {
  readonly orderStatuses = ['Pending', 'Preparing', 'Ready', 'Completed', 'Cancelled'];
  orders: Order[] = [];
  isLoading = true;
  errorMessage = '';
  updatingOrderId: number | null = null;

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  private loadOrders(): void {
    this.errorMessage = '';

    this.orderService.getOrders().subscribe({
      next: (orders) => {
        this.orders = orders;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load orders right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  updateOrderStatus(order: Order, newStatus: string): void {
    if (order.status === newStatus) {
      return;
    }

    this.updatingOrderId = order.id;
    this.errorMessage = '';

    this.orderService.updateOrderStatus(order.id, newStatus).subscribe({
      next: (updatedOrder) => {
        order.status = updatedOrder.status;
        this.updatingOrderId = null;
      },
      error: () => {
        this.errorMessage = 'Unable to update the order status right now. Please try again.';
        this.updatingOrderId = null;
      }
    });
  }
}
