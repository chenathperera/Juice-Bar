import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { Juice } from '../../models/juice.model';
import { JuiceService } from '../../services/juice.service';

@Component({
  selector: 'app-juice-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './juice-list.component.html',
  styleUrl: './juice-list.component.css'
})
export class JuiceListComponent implements OnInit {
  juices: Juice[] = [];
  isLoading = true;
  errorMessage = '';

  constructor(private juiceService: JuiceService) {}

  ngOnInit(): void {
    this.loadJuices();
  }

  private loadJuices(): void {
    this.juiceService.getJuices().subscribe({
      next: (juices) => {
        this.juices = juices;
        this.isLoading = false;
      },
      error: () => {
        this.errorMessage = 'Unable to load juices right now. Please try again.';
        this.isLoading = false;
      }
    });
  }
}
