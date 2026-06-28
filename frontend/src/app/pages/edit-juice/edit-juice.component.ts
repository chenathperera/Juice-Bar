import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { Juice } from '../../models/juice.model';
import { CategoryService } from '../../services/category.service';
import { JuiceService } from '../../services/juice.service';
import { resolveMediaUrl } from '../../utils/media-url';

@Component({
  selector: 'app-edit-juice',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-juice.component.html',
  styleUrl: './edit-juice.component.css'
})
export class EditJuiceComponent implements OnInit {
  juiceId = 0;
  categories: Category[] = [];
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  backendValidationErrors: string[] = [];
  previewImageUrl = '';

  juiceFormData = {
    name: '',
    description: '',
    price: null as number | null,
    imageUrl: '',
    imageFile: null as File | null,
    isMostLiked: false,
    likeRate: '',
    categoryId: null as number | null,
    isAvailable: true
  };

  constructor(
    private categoryService: CategoryService,
    private route: ActivatedRoute,
    private router: Router,
    private juiceService: JuiceService
  ) {}

  ngOnInit(): void {
    const idParam = this.route.snapshot.paramMap.get('id');
    const id = Number(idParam);

    if (!idParam || Number.isNaN(id) || id <= 0) {
      this.errorMessage = 'Invalid juice id.';
      this.isLoading = false;
      return;
    }

    this.juiceId = id;
    this.loadJuice();
  }

  submitForm(form: NgForm): void {
    if (form.invalid || this.juiceFormData.price === null || this.juiceFormData.categoryId === null) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';
    this.backendValidationErrors = [];

    const updatedJuice: Juice = {
      id: this.juiceId,
      name: this.juiceFormData.name,
      description: this.juiceFormData.description || null,
      price: this.juiceFormData.price,
      imageUrl: this.juiceFormData.imageUrl || null,
      imageFile: this.juiceFormData.imageFile,
      isMostLiked: this.juiceFormData.isMostLiked,
      likeRate: this.juiceFormData.likeRate || null,
      categoryId: this.juiceFormData.categoryId,
      categoryName: '',
      isAvailable: this.juiceFormData.isAvailable
    };

    this.juiceService.updateJuice(this.juiceId, updatedJuice).subscribe({
      next: () => {
        this.router.navigate(['/admin/juices']);
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.backendValidationErrors = this.extractValidationErrors(error);
        } else {
          this.errorMessage = 'Unable to update the juice right now. Please try again.';
        }

        this.isSaving = false;
      }
    });
  }

  private loadJuice(): void {
    this.errorMessage = '';
    this.backendValidationErrors = [];

    this.categoryService.getCategories().subscribe({
      next: (categories) => {
        this.categories = categories;

        this.juiceService.getJuiceById(this.juiceId).subscribe({
          next: (juice) => {
            this.juiceFormData = {
              name: juice.name,
              description: juice.description || '',
              price: juice.price,
              imageUrl: juice.imageUrl || '',
              imageFile: null,
              isMostLiked: juice.isMostLiked,
              likeRate: juice.likeRate || '',
              categoryId: juice.categoryId,
              isAvailable: juice.isAvailable
            };
            this.previewImageUrl = resolveMediaUrl(juice.imageUrl);
            this.isLoading = false;
          },
          error: () => {
            this.errorMessage = 'Unable to load the juice details right now. Please try again.';
            this.isLoading = false;
          }
        });
      },
      error: () => {
        this.errorMessage = 'Unable to load categories right now. Please try again.';
        this.isLoading = false;
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

  onImageSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.revokePreviewUrl();
    this.juiceFormData.imageFile = input.files?.[0] ?? null;

    if (this.juiceFormData.imageFile) {
      this.previewImageUrl = URL.createObjectURL(this.juiceFormData.imageFile);
      return;
    }

    this.previewImageUrl = resolveMediaUrl(this.juiceFormData.imageUrl);
  }

  get selectedImageName(): string {
    return this.juiceFormData.imageFile?.name || 'No new file selected';
  }

  private revokePreviewUrl(): void {
    if (this.previewImageUrl.startsWith('blob:')) {
      URL.revokeObjectURL(this.previewImageUrl);
    }
  }
}
