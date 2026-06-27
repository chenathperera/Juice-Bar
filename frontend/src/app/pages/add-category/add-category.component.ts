import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

@Component({
  selector: 'app-add-category',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-category.component.html',
  styleUrl: './add-category.component.css'
})
export class AddCategoryComponent {
  isSaving = false;
  errorMessage = '';
  previewImageUrl = '';

  categoryFormData = {
    name: '',
    description: '',
    imageUrl: '',
    imageFile: null as File | null
  };

  constructor(
    private categoryService: CategoryService,
    private router: Router
  ) {}

  submitForm(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const newCategory: Category = {
      id: 0,
      name: this.categoryFormData.name,
      description: this.categoryFormData.description || null,
      imageUrl: this.categoryFormData.imageUrl || null,
      imageFile: this.categoryFormData.imageFile
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.router.navigate(['/admin/categories']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Unable to save the category right now. Please try again.';
        this.isSaving = false;
      }
    });
  }

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.revokePreviewUrl();
    this.categoryFormData.imageFile = input.files?.[0] ?? null;

    if (this.categoryFormData.imageFile) {
      this.previewImageUrl = URL.createObjectURL(this.categoryFormData.imageFile);
      return;
    }

    this.previewImageUrl = '';
  }

  get selectedImageName(): string {
    return this.categoryFormData.imageFile?.name || 'No file selected';
  }

  private revokePreviewUrl(): void {
    if (this.previewImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewImageUrl);
    }
  }
}
