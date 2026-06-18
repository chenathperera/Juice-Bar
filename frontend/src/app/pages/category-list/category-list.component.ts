import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

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
      error: () => {
        this.errorMessage = 'Unable to delete the category right now. Please try again.';
        this.deletingCategoryId = null;
      }
    });
  }
}
