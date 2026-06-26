import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountMenuComponent } from '../../components/account-menu/account-menu.component';
import { FALLBACK_CATALOG_ITEMS } from '../../data/storefront-data';
import { CreateOrder } from '../../models/order.model';
import { CartStoreService } from '../../services/cart-store.service';
import { JuiceService } from '../../services/juice.service';
import { OrderService } from '../../services/order.service';

interface CartPageItem {
  id: string;
  juiceId: number | null;
  name: string;
  price: number;
  image: string;
  quantity: number;
}

@Component({
  selector: 'app-cart',
  imports: [CommonModule, FormsModule, RouterLink, AccountMenuComponent],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css'
})
export class CartComponent implements OnInit, OnDestroy {
  cartItems: CartPageItem[] = [];
  cartCount = 0;
  isCheckoutOpen = false;
  customerName = '';
  customerPhone = '';
  isPlacingOrder = false;
  checkoutError = '';
  checkoutSuccess = '';

  private readonly subscriptions = new Subscription();

  constructor(
    private cartStore: CartStoreService,
    private juiceService: JuiceService,
    private orderService: OrderService
  ) {}

  get grandTotal(): number {
    return this.cartItems.reduce((total, item) => total + item.price * item.quantity, 0);
  }

  ngOnInit(): void {
    document.body.dataset['route'] = 'cart';
    this.loadCartItems();
    this.subscriptions.add(
      this.cartStore.basket$.subscribe(() => {
        this.loadCartItems();
      })
    );
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  increaseQuantity(item: CartPageItem): void {
    this.cartStore.setQuantity(item.id, item.quantity + 1);
  }

  decreaseQuantity(item: CartPageItem): void {
    this.cartStore.setQuantity(item.id, item.quantity - 1);
  }

  openCheckout(): void {
    if (this.cartItems.length === 0) {
      return;
    }

    this.checkoutError = '';
    this.checkoutSuccess = '';
    this.isCheckoutOpen = true;
  }

  closeCheckout(): void {
    this.isCheckoutOpen = false;
  }

  placeOrder(): void {
    if (!this.customerName.trim() || !this.customerPhone.trim()) {
      this.checkoutError = 'Customer name and phone are required.';
      return;
    }

    const orderItems = this.cartItems.filter((item) => item.juiceId !== null);

    if (orderItems.length === 0) {
      this.checkoutError = 'No backend-linked juices are available to place this order.';
      return;
    }

    const order: CreateOrder = {
      customerName: this.customerName.trim(),
      customerPhone: this.customerPhone.trim(),
      status: 'Pending',
      items: orderItems.map((item) => ({
        juiceId: item.juiceId as number,
        quantity: item.quantity
      }))
    };

    this.isPlacingOrder = true;
    this.checkoutError = '';

    this.orderService.createOrder(order).subscribe({
      next: (createdOrder) => {
        this.checkoutSuccess = `Order #${createdOrder.id} created successfully.`;
        this.isPlacingOrder = false;
        this.customerName = '';
        this.customerPhone = '';
        this.cartStore.clear();
        this.isCheckoutOpen = false;
      },
      error: () => {
        this.checkoutError = 'Unable to place the order right now.';
        this.isPlacingOrder = false;
      }
    });
  }

  formatCurrency(value: number): string {
    return `LKR ${value.toFixed(2)}`;
  }

  private loadCartItems(): void {
    const basket = this.cartStore.getBasket();
    this.cartCount = this.cartStore.getTotalCount();
    const fallbackMap = new Map(FALLBACK_CATALOG_ITEMS.map((item) => [item.id, item]));

    this.juiceService.getJuices({
      sortBy: 'name',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 100
    }).subscribe({
      next: (result) => {
        const juiceMap = new Map(result.items.map((juice) => [`juice-${juice.id}`, juice]));
        this.cartItems = Object.entries(basket)
          .map(([itemId, quantity]) => {
            const juice = juiceMap.get(itemId);
            const fallbackItem = fallbackMap.get(itemId);

            if (!juice && !fallbackItem) {
              return null;
            }

            if (juice) {
              return {
                id: itemId,
                juiceId: juice.id,
                name: juice.name,
                price: juice.price,
                image: this.getCartImage(juice.categoryName, juice.id),
                quantity
              } satisfies CartPageItem;
            }

            return {
              id: itemId,
              juiceId: null,
              name: fallbackItem!.name,
              price: fallbackItem!.price,
              image: fallbackItem!.image,
              quantity
            } satisfies CartPageItem;
          })
          .filter((item): item is CartPageItem => item !== null);
      },
      error: () => {
        this.cartItems = [];
      }
    });
  }

  private getCartImage(categoryName: string, juiceId: number): string {
    const normalizedCategory = categoryName.toLowerCase();

    if (normalizedCategory.includes('coffee')) {
      return 'assets/chco item.png';
    }

    if (normalizedCategory.includes('tea') || normalizedCategory.includes('faluda') || normalizedCategory.includes('bubble')) {
      return 'assets/faluda item.png';
    }

    if (normalizedCategory.includes('ice') || normalizedCategory.includes('sundae') || normalizedCategory.includes('cream')) {
      return 'assets/cream item.png';
    }

    return juiceId % 2 === 0 ? 'assets/Coffe.png' : 'assets/chco item.png';
  }
}
