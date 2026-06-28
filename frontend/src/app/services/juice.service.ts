import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Juice } from '../models/juice.model';
import { environment } from '../../environments/environment';

export interface JuiceFilters {
  search?: string;
  categoryId?: number;
  isAvailable?: boolean;
  sortBy?: string;
  sortDirection?: string;
  pageNumber?: number;
  pageSize?: number;
}

export interface PagedJuiceResult {
  items: Juice[];
  totalCount: number;
  pageNumber: number;
  pageSize: number;
  totalPages: number;
}

@Injectable({
  providedIn: 'root'
})
export class JuiceService {
  private readonly apiUrl = `${environment.apiUrl}/juices`;

  constructor(private http: HttpClient) {}

  getJuices(filters?: JuiceFilters): Observable<PagedJuiceResult> {
    let params = new HttpParams();

    if (filters?.search) {
      params = params.set('search', filters.search);
    }

    if (filters?.categoryId !== undefined) {
      params = params.set('categoryId', filters.categoryId);
    }

    if (filters?.isAvailable !== undefined) {
      params = params.set('isAvailable', filters.isAvailable);
    }

    if (filters?.sortBy) {
      params = params.set('sortBy', filters.sortBy);
    }

    if (filters?.sortDirection) {
      params = params.set('sortDirection', filters.sortDirection);
    }

    if (filters?.pageNumber !== undefined) {
      params = params.set('pageNumber', filters.pageNumber);
    }

    if (filters?.pageSize !== undefined) {
      params = params.set('pageSize', filters.pageSize);
    }

    return this.http.get<PagedJuiceResult>(this.apiUrl, { params });
  }

  getJuiceById(id: number): Observable<Juice> {
    return this.http.get<Juice>(`${this.apiUrl}/${id}`);
  }

  createJuice(juice: Juice): Observable<Juice> {
    return this.http.post<Juice>(this.apiUrl, this.buildJuiceFormData(juice));
  }

  updateJuice(id: number, juice: Juice): Observable<void> {
    return this.http.put<void>(`${this.apiUrl}/${id}`, this.buildJuiceFormData(juice));
  }

  deleteJuice(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  private buildJuiceFormData(juice: Juice): FormData {
    const formData = new FormData();

    formData.append('name', juice.name);
    formData.append('description', juice.description ?? '');
    formData.append('price', juice.price.toString());
    formData.append('imageUrl', juice.imageUrl ?? '');
    formData.append('isMostLiked', String(juice.isMostLiked));
    formData.append('likeRate', juice.likeRate ?? '');
    formData.append('categoryId', juice.categoryId.toString());
    formData.append('isAvailable', String(juice.isAvailable));

    if (juice.imageFile) {
      formData.append('imageFile', juice.imageFile);
    }

    return formData;
  }
}
