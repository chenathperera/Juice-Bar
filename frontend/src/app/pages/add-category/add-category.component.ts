import { CommonModule } from '@angular/common';
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

  categoryFormData = {
    name: '',
    description: ''
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
      description: this.categoryFormData.description || null
    };

    this.categoryService.createCategory(newCategory).subscribe({
      next: () => {
        this.router.navigate(['/categories']);
      },
      error: () => {
        this.errorMessage = 'Unable to save the category right now. Please try again.';
        this.isSaving = false;
      }
    });
  }
}
