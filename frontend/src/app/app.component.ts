import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { HealthService } from './services/health.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
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
