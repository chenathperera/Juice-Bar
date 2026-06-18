import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { Juice } from '../../models/juice.model';
import { CategoryService } from '../../services/category.service';
import { JuiceFilters, JuiceService } from '../../services/juice.service';

@Component({
  selector: 'app-juice-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './juice-list.component.html',
  styleUrl: './juice-list.component.css'
})
export class JuiceListComponent implements OnInit {
  juices: Juice[] = [];
  categories: Category[] = [];
  searchTerm = '';
  selectedCategoryId = 'all';
  availabilityFilter = 'all';
  sortBy = 'name';
  sortDirection = 'asc';
  pageNumber = 1;
  pageSize = 5;
  totalCount = 0;
  totalPages = 0;
  isLoading = true;
  isLoadingCategories = true;
  errorMessage = '';
  deletingJuiceId: number | null = null;

  constructor(
    private categoryService: CategoryService,
    private juiceService: JuiceService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
    this.loadJuices();
  }

  get hasActiveFilters(): boolean {
    return this.searchTerm.trim() !== '' ||
      this.selectedCategoryId !== 'all' ||
      this.availabilityFilter !== 'all';
  }

  private loadCategories(): void {
    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoadingCategories = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load categories right now. Please try again.';
        this.isLoadingCategories = false;
      }
    });
  }

  private loadJuices(): void {
    this.errorMessage = '';

    const filters: JuiceFilters = {};

    if (this.searchTerm.trim()) {
      filters.search = this.searchTerm.trim();
    }

    if (this.selectedCategoryId !== 'all') {
      filters.categoryId = Number(this.selectedCategoryId);
    }

    if (this.availabilityFilter === 'available') {
      filters.isAvailable = true;
    } else if (this.availabilityFilter === 'unavailable') {
      filters.isAvailable = false;
    }

    filters.sortBy = this.sortBy;
    filters.sortDirection = this.sortDirection;
    filters.pageNumber = this.pageNumber;
    filters.pageSize = this.pageSize;

    this.isLoading = true;

    this.juiceService.getJuices(filters).subscribe({
      next: (result) => {
        this.juices = result.items;
        this.totalCount = result.totalCount;
        this.pageNumber = result.pageNumber;
        this.pageSize = result.pageSize;
        this.totalPages = result.totalPages;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load juices right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  applyFilters(): void {
    this.pageNumber = 1;
    this.loadJuices();
  }

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = 'all';
    this.availabilityFilter = 'all';
    this.sortBy = 'name';
    this.sortDirection = 'asc';
    this.pageNumber = 1;
    this.loadJuices();
  }

  applySorting(): void {
    this.pageNumber = 1;
    this.loadJuices();
  }

  goToPreviousPage(): void {
    if (this.pageNumber <= 1) {
      return;
    }

    this.pageNumber--;
    this.loadJuices();
  }

  goToNextPage(): void {
    if (this.pageNumber >= this.totalPages) {
      return;
    }

    this.pageNumber++;
    this.loadJuices();
  }

  deleteJuice(juice: Juice): void {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${juice.name}?`);

    if (!isConfirmed) {
      return;
    }

    this.deletingJuiceId = juice.id;
    this.errorMessage = '';

    this.juiceService.deleteJuice(juice.id).subscribe({
      next: () => {
        this.deletingJuiceId = null;
        this.loadJuices();
      },
      error: () => {
        this.errorMessage = 'Unable to delete the juice right now. Please try again.';
        this.deletingJuiceId = null;
      }
    });
  }
}
