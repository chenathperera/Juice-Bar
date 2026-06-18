import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { CategoryService } from '../../services/category.service';

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

  categoryFormData = {
    name: '',
    description: ''
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
      description: this.categoryFormData.description || null
    };

    this.categoryService.updateCategory(this.categoryId, updatedCategory).subscribe({
      next: () => {
        this.router.navigate(['/admin/categories']);
      },
      error: () => {
        this.errorMessage = 'Unable to update the category right now. Please try again.';
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
          description: category.description || ''
        };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the category details right now. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
