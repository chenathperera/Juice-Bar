import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Juice } from '../../models/juice.model';
import { JuiceService } from '../../services/juice.service';

@Component({
  selector: 'app-add-juice',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './add-juice.component.html',
  styleUrl: './add-juice.component.css'
})
export class AddJuiceComponent {
  isSaving = false;
  errorMessage = '';

  juiceFormData = {
    name: '',
    description: '',
    price: null as number | null,
    imageUrl: '',
    isAvailable: true
  };

  constructor(
    private juiceService: JuiceService,
    private router: Router
  ) {}

  submitForm(form: NgForm): void {
    if (form.invalid || this.juiceFormData.price === null) {
      form.control.markAllAsTouched();
      return;
    }

    this.isSaving = true;
    this.errorMessage = '';

    const newJuice: Juice = {
      id: 0,
      name: this.juiceFormData.name,
      description: this.juiceFormData.description || null,
      price: this.juiceFormData.price,
      imageUrl: this.juiceFormData.imageUrl || null,
      category: 'Fresh Juice',
      isAvailable: this.juiceFormData.isAvailable
    };

    this.juiceService.createJuice(newJuice).subscribe({
      next: () => {
        this.router.navigate(['/juices']);
      },
      error: () => {
        this.errorMessage = 'Unable to save the juice right now. Please try again.';
        this.isSaving = false;
      }
    });
  }
}
