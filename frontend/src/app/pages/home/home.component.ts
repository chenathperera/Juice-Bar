import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { AccountMenuComponent } from '../../components/account-menu/account-menu.component';
import { SiteFooterComponent } from '../../components/site-footer/site-footer.component';
import { HERO_DESIGN_PRODUCTS, HeroDesignProduct } from '../../data/storefront-data';
import { Juice } from '../../models/juice.model';
import { CartStoreService } from '../../services/cart-store.service';
import { JuiceService } from '../../services/juice.service';

interface BestSellingCard {
  image: string;
  title: string;
  priceLabel: string;
}

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, AccountMenuComponent, SiteFooterComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit, OnDestroy {
  readonly homeProducts = HERO_DESIGN_PRODUCTS;
  bestSellingCards: BestSellingCard[] = [];
  activeIndex = 0;
  isAnimating = false;
  queuedTargetId: string | null = null;
  isWheelIn = false;
  isSplashAnimating = false;
  ghostProduct: HeroDesignProduct | null = null;
  cartCount = 0;

  private readonly stepDuration = 600;
  private readonly subscriptions = new Subscription();
  private readonly resizeListener = () => this.updateWheelMotionVars();

  constructor(
    private juiceService: JuiceService,
    private cartStore: CartStoreService
  ) {}

  get selectedProduct(): HeroDesignProduct {
    return this.homeProducts[this.activeIndex];
  }

  ngOnInit(): void {
    document.body.dataset['route'] = 'home';
    this.updateWheelMotionVars();
    this.updateTheme(this.selectedProduct);
    this.loadBestSellingCards();
    this.cartCount = this.cartStore.getTotalCount();
    window.addEventListener('resize', this.resizeListener);
    this.subscriptions.add(
      this.cartStore.basket$.subscribe(() => {
        this.cartCount = this.cartStore.getTotalCount();
      })
    );
  }

  ngOnDestroy(): void {
    window.removeEventListener('resize', this.resizeListener);
    this.subscriptions.unsubscribe();
  }

  rotateToProduct(productId: string): void {
    const targetIndex = this.homeProducts.findIndex((product) => product.id === productId);

    if (targetIndex === -1 || targetIndex === this.activeIndex) {
      return;
    }

    this.queuedTargetId = productId;

    if (this.isAnimating) {
      return;
    }

    this.isAnimating = true;
    this.rotateClockwiseSteps(this.getClockwiseSteps(targetIndex), productId);
  }

  private rotateClockwiseSteps(stepsLeft: number, targetId: string): void {
    if (stepsLeft <= 0) {
      this.finishAnimation();
      return;
    }

    const nextIndex = (this.activeIndex + 1) % this.homeProducts.length;
    this.playStep(nextIndex);

    window.setTimeout(() => {
      if (stepsLeft === 1 && targetId === this.homeProducts[this.activeIndex].id) {
        this.finishAnimation();
        return;
      }

      this.rotateClockwiseSteps(stepsLeft - 1, targetId);
    }, this.stepDuration);
  }

  private playStep(nextIndex: number): void {
    const currentProduct = this.homeProducts[this.activeIndex];
    const nextProduct = this.homeProducts[nextIndex];

    this.ghostProduct = currentProduct;
    this.activeIndex = nextIndex;
    this.updateTheme(nextProduct);
    this.triggerSplashAnimation();
    this.triggerWheelAnimation();

    window.setTimeout(() => {
      this.ghostProduct = null;
    }, this.stepDuration);
  }

  private finishAnimation(): void {
    this.isWheelIn = false;
    this.isAnimating = false;

    if (this.queuedTargetId && this.queuedTargetId !== this.homeProducts[this.activeIndex].id) {
      const nextTargetId = this.queuedTargetId;
      this.queuedTargetId = null;
      this.rotateToProduct(nextTargetId);
      return;
    }

    this.queuedTargetId = null;
  }

  private getClockwiseSteps(targetIndex: number): number {
    return (targetIndex - this.activeIndex + this.homeProducts.length) % this.homeProducts.length;
  }

  private triggerSplashAnimation(): void {
    this.isSplashAnimating = false;

    window.setTimeout(() => {
      this.isSplashAnimating = true;
    });

    window.setTimeout(() => {
      this.isSplashAnimating = false;
    }, this.stepDuration);
  }

  private triggerWheelAnimation(): void {
    this.isWheelIn = false;

    window.setTimeout(() => {
      this.isWheelIn = true;
    });
  }

  private updateTheme(product: HeroDesignProduct): void {
    const root = document.documentElement;
    root.style.setProperty('--bg', product.bg);
    root.style.setProperty('--bg-strong', product.strong);
    root.style.setProperty('--bg-soft', product.soft);
    root.style.setProperty(
      '--section-gradient',
      `linear-gradient(135deg, ${product.strong} 0%, ${product.soft} 26%, ${product.soft} 71%, ${product.strong} 100%)`
    );
  }

  private updateWheelMotionVars(): void {
    const hero = document.getElementById('hero');

    if (!hero) {
      return;
    }

    const viewportScale = window.innerWidth <= 640 ? 0.42 : window.innerWidth <= 920 ? 0.62 : 1;
    hero.style.setProperty('--wheel-out-mid-x', `${128 * viewportScale}px`);
    hero.style.setProperty('--wheel-out-mid-y', `${-54 * viewportScale}px`);
    hero.style.setProperty('--wheel-out-x', `${296 * viewportScale}px`);
    hero.style.setProperty('--wheel-out-y', `${72 * viewportScale}px`);
    hero.style.setProperty('--wheel-out-spin', `${88 * viewportScale}deg`);
    hero.style.setProperty('--wheel-in-x', `${-36 * viewportScale}px`);
    hero.style.setProperty('--wheel-in-y', `${310 * viewportScale}px`);
    hero.style.setProperty('--wheel-in-spin', `${-92 * viewportScale}deg`);
    hero.style.setProperty('--wheel-in-low-x', `${-12 * viewportScale}px`);
    hero.style.setProperty('--wheel-in-low-y', `${212 * viewportScale}px`);
    hero.style.setProperty('--wheel-in-low-spin', `${-62 * viewportScale}deg`);
    hero.style.setProperty('--wheel-in-mid-x', `${-18 * viewportScale}px`);
    hero.style.setProperty('--wheel-in-mid-y', `${92 * viewportScale}px`);
    hero.style.setProperty('--wheel-in-mid-spin', `${-26 * viewportScale}deg`);
  }

  private loadBestSellingCards(): void {
    this.juiceService.getJuices({
      isAvailable: true,
      sortBy: 'name',
      sortDirection: 'asc',
      pageNumber: 1,
      pageSize: 4
    }).subscribe({
      next: (result) => {
        const juices = result.items.slice(0, 4);

        if (juices.length === 0) {
          this.bestSellingCards = this.buildFallbackBestSellingCards();
          return;
        }

        this.bestSellingCards = juices.map((juice, index) => this.mapJuiceToBestSellingCard(juice, index));
      },
      error: () => {
        this.bestSellingCards = this.buildFallbackBestSellingCards();
      }
    });
  }

  private mapJuiceToBestSellingCard(juice: Juice, index: number): BestSellingCard {
    const visual = this.homeProducts[index % this.homeProducts.length];

    return {
      image: visual.cardImage,
      title: juice.name,
      priceLabel: `Rs.${juice.price.toFixed(2)}/=`
    };
  }

  private buildFallbackBestSellingCards(): BestSellingCard[] {
    return this.homeProducts.map((product) => ({
      image: product.cardImage,
      title: product.cardTitle,
      priceLabel: product.cardPrice
    }));
  }
}
