import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { Category } from '../../models/category.model';
import { Juice } from '../../models/juice.model';
import { JuiceService } from '../../services/juice.service';

@Component({
  selector: 'app-juice-list',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './juice-list.component.html',
  styleUrl: './juice-list.component.css'
})
export class JuiceListComponent implements OnInit {
  juices: Juice[] = [];
  searchTerm = '';
  selectedCategoryId = 'all';
  availabilityFilter = 'all';
  isLoading = true;
  errorMessage = '';
  deletingJuiceId: number | null = null;

  constructor(private juiceService: JuiceService) {}

  ngOnInit(): void {
    this.loadJuices();
  }

  get categories(): Category[] {
    const uniqueCategories = new Map<number, Category>();

    for (const juice of this.juices) {
      if (!uniqueCategories.has(juice.categoryId)) {
        uniqueCategories.set(juice.categoryId, {
          id: juice.categoryId,
          name: juice.categoryName,
          description: null
        });
      }
    }

    return Array.from(uniqueCategories.values()).sort((first, second) =>
      first.name.localeCompare(second.name)
    );
  }

  get filteredJuices(): Juice[] {
    return this.juices.filter((juice) => {
      const matchesSearch = juice.name.toLowerCase().includes(this.searchTerm.toLowerCase().trim());
      const matchesCategory =
        this.selectedCategoryId === 'all' || juice.categoryId === Number(this.selectedCategoryId);
      const matchesAvailability =
        this.availabilityFilter === 'all' ||
        (this.availabilityFilter === 'available' && juice.isAvailable) ||
        (this.availabilityFilter === 'unavailable' && !juice.isAvailable);

      return matchesSearch && matchesCategory && matchesAvailability;
    });
  }

  private loadJuices(): void {
    this.errorMessage = '';
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

  clearFilters(): void {
    this.searchTerm = '';
    this.selectedCategoryId = 'all';
    this.availabilityFilter = 'all';
  }

  deleteJuice(juice: Juice): void {
    const isConfirmed = window.confirm(`Are you sure you want to delete ${juice.name}?`);

    if (!isConfirmed) {
      return;
    }

    this.deletingJuiceId = juice.id;
    this.errorMessage = '';

    this.juiceService.deleteJuice(juice.id).subscribe({
      next: () => {
        this.juices = this.juices.filter((item) => item.id !== juice.id);
        this.deletingJuiceId = null;
      },
      error: () => {
        this.errorMessage = 'Unable to delete the juice right now. Please try again.';
        this.deletingJuiceId = null;
      }
    });
  }
}
