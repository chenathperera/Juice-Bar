import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountMenuComponent } from '../../components/account-menu/account-menu.component';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';
import { Order } from '../../models/order.model';
import { CartStoreService } from '../../services/cart-store.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-track-order',
  imports: [CommonModule, FormsModule, RouterLink, RouterLinkActive, AccountMenuComponent, SiteFooterComponent],
  templateUrl: './track-order.component.html',
  styleUrl: './track-order.component.css'
})
export class TrackOrderComponent implements OnInit, OnDestroy {
  readonly statusSteps = ['Pending', 'Preparing', 'Ready', 'Completed'];
  orderId: number | null = null;
  order: Order | null = null;
  isLoading = false;
  errorMessage = '';
  cartCount = 0;

  private readonly subscriptions = new Subscription();

  constructor(
    private orderService: OrderService,
    private cartStore: CartStoreService
  ) {}

  ngOnInit(): void {
    document.body.dataset['route'] = 'track-order';
    this.cartCount = this.cartStore.getTotalCount();
    this.subscriptions.add(
      this.cartStore.basket$.subscribe(() => {
        this.cartCount = this.cartStore.getTotalCount();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

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

  formatCurrency(value: number): string {
    return `LKR ${value.toFixed(2)}`;
  }

  getStatusClass(status: string): string {
    const normalizedStatus = status.trim().toLowerCase();

    if (normalizedStatus === 'completed') {
      return 'status-completed';
    }

    if (normalizedStatus === 'ready') {
      return 'status-ready';
    }

    if (normalizedStatus === 'preparing') {
      return 'status-preparing';
    }

    if (normalizedStatus === 'cancelled') {
      return 'status-cancelled';
    }

    return 'status-pending';
  }

  isStepActive(step: string, currentStatus: string): boolean {
    const currentIndex = this.statusSteps.indexOf(currentStatus);
    const stepIndex = this.statusSteps.indexOf(step);

    if (currentStatus === 'Cancelled') {
      return false;
    }

    return currentIndex >= 0 && stepIndex <= currentIndex;
  }

  isStepCurrent(step: string, currentStatus: string): boolean {
    return step === currentStatus;
  }
}
