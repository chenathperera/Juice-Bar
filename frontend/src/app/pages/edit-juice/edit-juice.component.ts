import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { FormsModule, NgForm } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { Juice } from '../../models/juice.model';
import { JuiceService } from '../../services/juice.service';

@Component({
  selector: 'app-edit-juice',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './edit-juice.component.html',
  styleUrl: './edit-juice.component.css'
})
export class EditJuiceComponent implements OnInit {
  juiceId = 0;
  isLoading = true;
  isSaving = false;
  errorMessage = '';
  backendValidationErrors: string[] = [];

  juiceFormData = {
    name: '',
    description: '',
    price: null as number | null,
    imageUrl: '',
    isAvailable: true
  };

  constructor(
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
    if (form.invalid || this.juiceFormData.price === null) {
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
      category: 'Fresh Juice',
      isAvailable: this.juiceFormData.isAvailable
    };

    this.juiceService.updateJuice(this.juiceId, updatedJuice).subscribe({
      next: () => {
        this.router.navigate(['/juices']);
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

    this.juiceService.getJuiceById(this.juiceId).subscribe({
      next: (juice) => {
        this.juiceFormData = {
          name: juice.name,
          description: juice.description || '',
          price: juice.price,
          imageUrl: juice.imageUrl || '',
          isAvailable: juice.isAvailable
        };
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load the juice details right now. Please try again.';
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
}
