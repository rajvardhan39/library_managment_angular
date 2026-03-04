import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Book } from '../models/book.model';

export interface CreateBookPayload {
  title: string;
  body: string;
  userId?: number;
}

export interface BookUpsertPayload {
  title: string;
  body: string;
  isbn?: string;
  category?: string;
  publishedYear?: number;
  totalCopies?: number;
  coverImage?: string;
}

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly http = inject(HttpClient);

  // ❌ REMOVE PUBLIC_BASE usage for UI
  private readonly PUBLIC_BASE = 'http://localhost:3001/books';

  // ✅ Always use API_BASE for application
  private readonly API_BASE = 'http://localhost:3001/api/books';

  // =========================================
  // USER CATALOG (ALWAYS DETAILED DATA)
  // =========================================

  getAll(): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.API_BASE}/detailed`);
  }

  getById(id: number): Observable<Book> {
    return this.http.get<Book>(`${this.API_BASE}/detailed/${id}`);
  }

  search(query: string = '', category: string = ''): Observable<Book[]> {

    const trimmedQuery = query?.trim() ?? '';
    const trimmedCategory = category?.trim() ?? '';

    let params = new HttpParams();

    if (trimmedQuery) {
      params = params.set('q', trimmedQuery);
    }

    if (trimmedCategory) {
      params = params.set('category', trimmedCategory);
    }

    return this.http.get<Book[]>(`${this.API_BASE}/detailed`, { params });
  }

  getCategories(): Observable<string[]> {
    return this.http.get<string[]>(`${this.API_BASE}/categories/list`);
  }

  // =========================================
  // LIBRARIAN METHODS
  // =========================================

  create(payload: CreateBookPayload): Observable<Book> {
    return this.http.post<Book>(`${this.API_BASE}/create`, payload);
  }

update(id: number, payload: BookUpsertPayload): Observable<Book> {
  return this.http.put<Book>(`${this.API_BASE}/${id}/update`, payload);
}

delete(id: number): Observable<{ message: string }> {
  return this.http.delete<{ message: string }>(`${this.API_BASE}/${id}/delete`);
}
}