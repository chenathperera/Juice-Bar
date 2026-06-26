import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { Juice } from '../../models/juice.model';
import { CategoryService } from '../../services/category.service';
import { JuiceService } from '../../services/juice.service';

@Component({
  selector: 'app-add-juice',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-juice.component.html',
  styleUrl: './add-juice.component.css'
})
export class AddJuiceComponent {
  categories: Category[] = [];
  isLoadingCategories = true;
  isSaving = false;
  errorMessage = '';
  backendValidationErrors: string[] = [];

  juiceFormData = {
    name: '',
    description: '',
    price: null as number | null,
    imageUrl: '',
    isMostLiked: false,
    likeRate: '',
    categoryId: null as number | null,
    isAvailable: true
  };

  constructor(
    private categoryService: CategoryService,
    private juiceService: JuiceService,
    private router: Router
  ) {
    this.loadCategories();
  }

  submitForm(form: NgForm): void {
    if (form.invalid || this.juiceFormData.price === null || this.juiceFormData.categoryId === null) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.backendValidationErrors = [];

    const newJuice: Juice = {
      id: 0,
      name: this.juiceFormData.name,
      description: this.juiceFormData.description || null,
      price: this.juiceFormData.price,
      imageUrl: this.juiceFormData.imageUrl || null,
      isMostLiked: this.juiceFormData.isMostLiked,
      likeRate: this.juiceFormData.likeRate || null,
      categoryId: this.juiceFormData.categoryId,
      categoryName: '',
      isAvailable: this.juiceFormData.isAvailable
    };

    this.juiceService.createJuice(newJuice).subscribe({
      next: () => {
        this.router.navigate(['/admin/juices']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.backendValidationErrors = this.extractValidationErrors(error);
        } else {
          this.errorMessage = 'Unable to save the juice right now. Please try again.';
        }

        this.isSaving = false;
      }
    });
  }

  private extractValidationErrors(error: HttpErrorResponse): string[] {
    const errors = error.error?.errors;

    if (!errors) {
      return ['The server rejected the data. Please check the form and try again.'];
    }

    return Object.values(errors).flat() as string[];
  }

  private loadCategories(): void {
    this.errorMessage = '';

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
}
