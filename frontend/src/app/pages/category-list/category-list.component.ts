import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { resolveMediaUrl } from '../../utils/media-url';

@Component({
  selector: 'app-category-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './category-list.component.html',
  styleUrl: './category-list.component.css'
})
export class CategoryListComponent implements OnInit {
  categories: Category[] = [];
  isLoading = true;
  errorMessage = '';
  deletingCategoryId: number | null = null;

  constructor(private categoryService: CategoryService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  private loadCategories(): void {
    this.errorMessage = '';

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load categories right now. Please try again.';
        this.isLoading = false;
      }
    });
  }

  deleteCategory(category: Category): void {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${category.name}?`);

    if (!isConfirmed) {
      return;
    }

    this.deletingCategoryId = category.id;
    this.errorMessage = '';

    this.categoryService.deleteCategory(category.id).subscribe({
      next: () => {
        this.categories = this.categories.filter((item) => item.id !== category.id);
        this.deletingCategoryId = null;
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Unable to delete the category right now. Please try again.';
        this.deletingCategoryId = null;
      }
    });
  }

  getCategoryImageUrl(category: Category): string {
    return resolveMediaUrl(category.imageUrl);
  }
}
