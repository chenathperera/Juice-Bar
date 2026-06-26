import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountMenuComponent } from '../../components/account-menu/account-menu.component';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';
import {
  DESIGN_CATEGORY_VISUALS,
  FALLBACK_CATALOG_ITEMS,
  DesignCategoryVisual,
  FallbackCatalogItem
} from '../../data/storefront-data';
import { Juice } from '../../models/juice.model';
import { CartStoreService } from '../../services/cart-store.service';
import { JuiceService } from '../../services/juice.service';

interface StorefrontCategory {
  id: string;
  label: string;
  thumb: string;
}

interface StorefrontProduct {
  id: string;
  juiceId: number | null;
  categoryId: string;
  name: string;
  price: number;
  likes: string;
  description: string;
  image: string;
  liked: boolean;
  isAvailable: boolean;
}

@Component({
  selector: 'app-products',
  imports: [CommonModule, FormsModule, RouterLink, AccountMenuComponent, SiteFooterComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent implements OnInit, OnDestroy {
  categories: StorefrontCategory[] = [];
  catalogItems: StorefrontProduct[] = [];
  selectedCategoryId = '';
  searchTerm = '';
  availabilityFilter = 'all';
  sortBy = 'name';
  sortDirection = 'asc';
  modalItem: StorefrontProduct | null = null;
  modalQty = 1;
  cartCount = 0;

  private readonly subscriptions = new Subscription();

  constructor(
    private juiceService: JuiceService,
    private cartStore: CartStoreService,
    private router: Router
  ) {}

  get filteredItems(): StorefrontProduct[] {
    let items = [...this.catalogItems];
    const term = this.searchTerm.trim().toLowerCase();

    if (this.selectedCategoryId) {
      items = items.filter((item) => item.categoryId === this.selectedCategoryId);
    }

    if (this.availabilityFilter === 'available') {
      items = items.filter((item) => item.isAvailable);
    } else if (this.availabilityFilter === 'unavailable') {
      items = items.filter((item) => !item.isAvailable);
    }

    if (!term) {
      return this.sortItems(items);
    }

    const filteredItems = items.filter((item) =>
      item.name.toLowerCase().includes(term) || item.description.toLowerCase().includes(term)
    );

    return this.sortItems(filteredItems);
  }

  get selectedCategoryLabel(): string {
    return this.categories.find((category) => category.id === this.selectedCategoryId)?.label ?? 'All Juices';
  }

  ngOnInit(): void {
    document.body.dataset['route'] = 'products';
    this.cartCount = this.cartStore.getTotalCount();
    this.subscriptions.add(
      this.cartStore.basket$.subscribe(() => {
        this.cartCount = this.cartStore.getTotalCount();
      })
    );
    this.loadProducts();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  selectCategory(categoryId: string): void {
    this.selectedCategoryId = categoryId;
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = '';
    this.availabilityFilter = 'all';
    this.sortBy = 'name';
    this.sortDirection = 'asc';
  }

  getBasketQuantity(itemId: string): number {
    return this.cartStore.getQuantity(itemId);
  }

  addOne(itemId: string): void {
    this.cartStore.add(itemId, 1);
  }

  decreaseOne(itemId: string): void {
    this.cartStore.setQuantity(itemId, this.getBasketQuantity(itemId) - 1);
  }

  openModal(item: StorefrontProduct): void {
    this.modalItem = item;
    this.modalQty = Math.max(1, this.getBasketQuantity(item.id) || 1);
  }

  closeModal(): void {
    this.modalItem = null;
    this.modalQty = 1;
  }

  increaseModalQty(): void {
    this.modalQty++;
  }

  decreaseModalQty(): void {
    this.modalQty = Math.max(1, this.modalQty - 1);
  }

  addModalItemToBasket(): void {
    if (!this.modalItem) {
      return;
    }

    this.cartStore.add(this.modalItem.id, this.modalQty);
    this.closeModal();
  }

  goToCart(): void {
    this.router.navigate(['/cart']);
  }

  formatCurrency(value: number): string {
    return `LKR ${value.toFixed(2)}`;
  }

  private loadProducts(): void {
    this.juiceService.getJuices({
      sortBy: 'name',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 100
    }).subscribe({
      next: (result) => {
        if (result.items.length === 0) {
          this.useFallbackCatalog();
          return;
        }

        this.buildCatalogFromApi(result.items);
      },
      error: () => {
        this.useFallbackCatalog();
      }
    });
  }

  private buildCatalogFromApi(juices: Juice[]): void {
    const categoryNames = Array.from(
      new Set(juices.map((juice) => (juice.categoryName?.trim() || 'Menu')))
    );
    const visualsByCategory = new Map<string, DesignCategoryVisual>();

    categoryNames.forEach((categoryName, index) => {
      visualsByCategory.set(categoryName, DESIGN_CATEGORY_VISUALS[index % DESIGN_CATEGORY_VISUALS.length]);
    });

    this.categories = categoryNames.map((categoryName) => {
      const visual = visualsByCategory.get(categoryName)!;
      return {
        id: this.slugify(categoryName),
        label: categoryName,
        thumb: visual.thumb
      };
    });

    this.catalogItems = juices.map((juice, index) => {
      const categoryName = juice.categoryName?.trim() || 'Menu';
      const visual = visualsByCategory.get(categoryName)!;
      const categoryIndex = juices
        .filter((item) => (item.categoryName?.trim() || 'Menu') === categoryName)
        .findIndex((item) => item.id === juice.id);

      return {
        id: `juice-${juice.id}`,
        juiceId: juice.id,
        categoryId: this.slugify(categoryName),
        name: juice.name,
        price: juice.price,
        likes: juice.likeRate?.trim() || this.buildLikeLabel(index),
        description: juice.description?.trim() || 'Freshly prepared signature item from Juice World.',
        image: visual.catalogImages[categoryIndex % visual.catalogImages.length],
        liked: juice.isMostLiked,
        isAvailable: juice.isAvailable
      };
    });

    this.selectedCategoryId = this.categories[0]?.id ?? '';
  }

  private useFallbackCatalog(): void {
    this.categories = DESIGN_CATEGORY_VISUALS.map((visual) => ({
      id: visual.id,
      label: visual.label,
      thumb: visual.thumb
    }));

    this.catalogItems = FALLBACK_CATALOG_ITEMS.map((item, index) => ({
      ...item,
      juiceId: null,
      isAvailable: index % 5 !== 0
    }));
    this.selectedCategoryId = this.categories[0]?.id ?? '';
  }

  private buildLikeLabel(index: number): string {
    const percent = 88 + (index % 6);
    const count = 40 + index * 3;
    return `${percent}% (${count})`;
  }

  private sortItems(items: StorefrontProduct[]): StorefrontProduct[] {
    return items.sort((left, right) => {
      let comparison = 0;

      if (this.sortBy === 'price') {
        comparison = left.price - right.price;
      } else if (this.sortBy === 'availability') {
        comparison = Number(right.isAvailable) - Number(left.isAvailable);
      } else {
        comparison = left.name.localeCompare(right.name);
      }

      return this.sortDirection === 'desc' ? comparison * -1 : comparison;
    });
  }

  private slugify(value: string): string {
    return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
}
