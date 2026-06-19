import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { RegisterRequest } from '../../models/auth.model';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent {
  registerData: RegisterRequest = {
    userName: '',
    email: '',
    password: '',
    role: 'Customer'
  };

  isLoading = false;
  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  submitForm(form: NgForm): void {
    if (form.invalid) {
      form.control.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.authService.register(this.registerData).subscribe({
      next: () => {
        this.isLoading = false;
        this.successMessage = 'Registration successful. Please log in.';
        form.resetForm({
          role: 'Customer'
        });
        this.registerData = {
          userName: '',
          email: '',
          password: '',
          role: 'Customer'
        };
        setTimeout(() => this.router.navigate(['/login']), 1000);
      },
      error: (error: HttpErrorResponse) => {
        const serverErrors = error.error?.errors;

        if (Array.isArray(serverErrors) && serverErrors.length > 0) {
          this.errorMessage = serverErrors.join(' ');
        } else {
          this.errorMessage = 'Unable to register right now. Please try again.';
        }

        this.isLoading = false;
      }
    });
  }
}
