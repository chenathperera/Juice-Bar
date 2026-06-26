import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartStoreService {
  private readonly storageKey = 'juice-world-store-v1';
  private readonly basketSubject = new BehaviorSubject<Record<string, number>>(this.loadBasket());

  readonly basket$ = this.basketSubject.asObservable();

  getBasket(): Record<string, number> {
    return this.basketSubject.value;
  }

  getQuantity(itemId: string): number {
    return this.getBasket()[itemId] ?? 0;
  }

  getTotalCount(): number {
    return Object.values(this.getBasket()).reduce((sum, quantity) => sum + quantity, 0);
  }

  setQuantity(itemId: string, quantity: number): void {
    const nextBasket = { ...this.getBasket() };

    if (quantity <= 0) {
      delete nextBasket[itemId];
    } else {
      nextBasket[itemId] = quantity;
    }

    this.saveBasket(nextBasket);
  }

  add(itemId: string, quantity: number): void {
    this.setQuantity(itemId, this.getQuantity(itemId) + quantity);
  }

  clear(): void {
    this.saveBasket({});
  }

  private loadBasket(): Record<string, number> {
    try {
      const rawState = localStorage.getItem(this.storageKey);

      if (!rawState) {
        return {};
      }

      const parsedState = JSON.parse(rawState) as { basket?: Record<string, number> };
      return parsedState.basket ?? {};
    } catch {
      return {};
    }
  }

  private saveBasket(basket: Record<string, number>): void {
    const nextState = { basket };
    localStorage.setItem(this.storageKey, JSON.stringify(nextState));
    this.basketSubject.next(basket);
  }
}
