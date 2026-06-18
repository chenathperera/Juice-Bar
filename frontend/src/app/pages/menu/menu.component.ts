import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Juice } from '../../models/juice.model';
import { CreateOrder, Order } from '../../models/order.model';
import { JuiceService } from '../../services/juice.service';
import { OrderService } from '../../services/order.service';
import { RouterLink } from '@angular/router';

interface CartItem {
  juiceId: number;
  name: string;
  unitPrice: number;
  quantity: number;
}

@Component({
  selector: 'app-menu',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css'
})
export class MenuComponent implements OnInit {
  juices: Juice[] = [];
  cartItems: CartItem[] = [];
  placedOrder: Order | null = null;
  customerName = '';
  customerPhone = '';
  isLoading = true;
  isPlacingOrder = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private juiceService: JuiceService,
    private orderService: OrderService
  ) {}

  ngOnInit(): void {
    this.loadMenu();
  }

  get cartTotal(): number {
    return this.cartItems.reduce((total, item) => total + this.getSubtotal(item), 0);
  }

  private loadMenu(): void {
    this.errorMessage = '';

    this.juiceService.getJuices({
      isAvailable: true,
      sortBy: 'name',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 100
    }).subscribe({
      next: (result) => {
        this.juices = result.items.filter((juice) => juice.isAvailable);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the menu right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  addToCart(juice: Juice): void {
    this.successMessage = '';
    this.placedOrder = null;

    const existingItem = this.cartItems.find((item) => item.juiceId === juice.id);

    if (existingItem) {
      existingItem.quantity++;
      return;
    }

    this.cartItems.push({
      juiceId: juice.id,
      name: juice.name,
      unitPrice: juice.price,
      quantity: 1
    });
  }

  increaseQuantity(item: CartItem): void {
    item.quantity++;
  }

  decreaseQuantity(item: CartItem): void {
    if (item.quantity === 1) {
      this.removeFromCart(item);
      return;
    }

    item.quantity--;
  }

  removeFromCart(item: CartItem): void {
    this.cartItems = this.cartItems.filter((cartItem) => cartItem.juiceId !== item.juiceId);
  }

  getSubtotal(item: CartItem): number {
    return item.unitPrice * item.quantity;
  }

  placeOrder(form: NgForm): void {
    if (form.invalid || this.cartItems.length === 0) {
      form.control.markAllAsTouched();
      if (this.cartItems.length === 0) {
        this.errorMessage = 'Add at least one juice to the cart before placing an order.';
      }
      return;
    }

    this.isPlacingOrder = true;
    this.errorMessage = '';
    this.successMessage = '';
    this.placedOrder = null;

    const order: CreateOrder = {
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      status: 'Pending',
      items: this.cartItems.map((item) => ({
        juiceId: item.juiceId,
        quantity: item.quantity
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        this.successMessage = 'Your order was placed successfully.';
        this.placedOrder = createdOrder;
        this.cartItems = [];
        this.customerName = '';
        this.customerPhone = '';
        this.isPlacingOrder = false;
        form.resetForm();
      },
      error: () => {
        this.errorMessage = 'Unable to place the order right now. Please try again.';
        this.isPlacingOrder = false;
      }
    });
  }
}
