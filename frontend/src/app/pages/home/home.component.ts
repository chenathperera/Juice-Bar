import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HealthService } from '../../services/health.service';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  title = 'FreshSip Juice Bar';
  apiStatus = 'Checking API status...';

  constructor(private healthService: HealthService) {}

  ngOnInit(): void {
    this.healthService.getApiStatus().subscribe({
      next: (status) => {
        this.apiStatus = status;
      },
      error: () => {
        this.apiStatus = 'Unable to reach the FreshSip API right now.';
      }
    });
  }
}
