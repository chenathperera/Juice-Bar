import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';
import { resolveMediaUrl } from '../../utils/media-url';

@Component({
  selector: 'app-edit-category',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-category.component.html',
  styleUrl: './edit-category.component.css'
})
export class EditCategoryComponent implements OnInit {
  categoryId = 0;
  isLoading = true;
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
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.errorMessage = 'Invalid category id.';
      this.isLoading = false;
      return;
    }

    this.categoryId = id;
    this.loadCategory();
  }

  submitForm(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const updatedCategory: Category = {
      id: this.categoryId,
      name: this.categoryFormData.name,
      description: this.categoryFormData.description || null,
      imageUrl: this.categoryFormData.imageUrl || null,
      imageFile: this.categoryFormData.imageFile
    };

    this.categoryService.updateCategory(this.categoryId, updatedCategory).subscribe({
      next: () => {
        this.router.navigate(['/admin/categories']);
      },
      error: (error: HttpErrorResponse) => {
        this.errorMessage = error.error?.message || 'Unable to update the category right now. Please try again.';
        this.isSaving = false;
      }
    });
  }

  private loadCategory(): void {
    this.errorMessage = '';

    this.categoryService.getCategoryById(this.categoryId).subscribe({
      next: (category) => {
        this.categoryFormData = {
          name: category.name,
          description: category.description || '',
          imageUrl: category.imageUrl || '',
          imageFile: null
        };
        this.previewImageUrl = resolveMediaUrl(category.imageUrl);
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the category details right now. Please try again.';
        this.isLoading = false;
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

    this.previewImageUrl = resolveMediaUrl(this.categoryFormData.imageUrl);
  }

  get selectedImageName(): string {
    return this.categoryFormData.imageFile?.name || 'No new file selected';
  }

  private revokePreviewUrl(): void {
    if (this.previewImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewImageUrl);
    }
  }
}
