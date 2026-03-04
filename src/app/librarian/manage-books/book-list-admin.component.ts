import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import {
  BehaviorSubject,
  Subject,
  combineLatest,
  debounceTime,
  distinctUntilChanged,
  map,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
  catchError,
  of,
  finalize
} from 'rxjs';

import { BookService } from '../../books/book.service';
import { Book } from '../../models/book.model';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';
import { BookFormComponent } from './book-form.component';

@Component({
  selector: 'app-book-list-admin',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    ReactiveFormsModule,
    LoadingSpinnerComponent,
    BookFormComponent
  ],
  templateUrl: './book-list-admin.component.html',
  styleUrls: ['./book-list-admin.component.css']
})
export class BookListAdminComponent implements OnDestroy {

  private readonly bookService = inject(BookService);
  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  searchControl = new FormControl('', { nonNullable: true });
  categoryControl = new FormControl('all', { nonNullable: true });
  stockControl = new FormControl('all', { nonNullable: true });
  sortControl = new FormControl('title-asc', { nonNullable: true });

  readonly isLoading$ = new BehaviorSubject<boolean>(true);
  readonly error$ = new BehaviorSubject<string>('');
  readonly success$ = new BehaviorSubject<string>('');

  isFormOpen = false;
  editingBook: Book | null = null;

  // --- NEW MODAL STATE (DOES NOT HARM PREVIOUS CODE) ---
  isDeleteModalOpen = false;
  bookToDelete: Book | null = null;

  private readonly books$ = this.refresh$.pipe(
    tap(() => {
      this.isLoading$.next(true);
      this.error$.next('');
    }),
    switchMap(() =>
      this.bookService.getAll().pipe(
        catchError(() => {
          this.error$.next('Failed to load books.');
          return of([]);
        }),
        finalize(() => this.isLoading$.next(false))
      )
    ),
    shareReplay(1)
  );

  readonly filteredBooks$ = combineLatest([
    this.books$,
    this.searchControl.valueChanges.pipe(startWith(''), debounceTime(300), distinctUntilChanged()),
    this.categoryControl.valueChanges.pipe(startWith('all')),
    this.stockControl.valueChanges.pipe(startWith('all')),
    this.sortControl.valueChanges.pipe(startWith('title-asc'))
  ]).pipe(
    map(([books, search, category, stock, sort]) => {
      let filtered = [...books];
      const term = search.toLowerCase();
      if (term) {
        filtered = filtered.filter(b =>
          b.title.toLowerCase().includes(term) ||
          (b.category ?? '').toLowerCase().includes(term)
        );
      }
      if (category !== 'all') { filtered = filtered.filter(b => b.category === category); }
      if (stock === 'in') {
        filtered = filtered.filter(b => b.availableCopies > 0);
      } else if (stock === 'low') {
        filtered = filtered.filter(b => b.availableCopies <= 2 && b.availableCopies > 0);
      } else if (stock === 'out') {
        filtered = filtered.filter(b => b.availableCopies === 0);
      }
      switch (sort) {
        case 'title-desc': filtered.sort((a, b) => b.title.localeCompare(a.title)); break;
        case 'stock-asc': filtered.sort((a, b) => a.availableCopies - b.availableCopies); break;
        case 'stock-desc': filtered.sort((a, b) => b.availableCopies - a.availableCopies); break;
        default: filtered.sort((a, b) => a.title.localeCompare(b.title));
      }
      return filtered;
    }),
    takeUntil(this.destroy$)
  );

  openCreate() {
    this.editingBook = null;
    this.isFormOpen = true;
  }

  openEdit(book: Book) {
    this.editingBook = book;
    this.isFormOpen = true;
  }

  closeForm() {
    this.isFormOpen = false;
  }

  onSave(payload: any) {
    const request$ = this.editingBook
      ? this.bookService.update(this.editingBook.id, payload)
      : this.bookService.create(payload);
    this.isLoading$.next(true);
    request$
      .pipe(finalize(() => this.isLoading$.next(false)))
      .subscribe({
        next: () => {
          this.success$.next('Book saved successfully ✔');
          this.refresh$.next();
          this.isFormOpen = false;
          setTimeout(() => this.success$.next(''), 3000);
        },
        error: err => {
          this.error$.next(err?.error?.message || 'Save failed.');
        }
      });
  }

  // --- UPDATED DELETE LOGIC ---
  deleteBook(book: Book) {
    this.bookToDelete = book;
    this.isDeleteModalOpen = true;
  }

  cancelDelete() {
    this.isDeleteModalOpen = false;
    this.bookToDelete = null;
  }

  confirmDelete() {
    if (!this.bookToDelete) return;
    const id = this.bookToDelete.id;
    this.isDeleteModalOpen = false;
    this.isLoading$.next(true);

    this.bookService.delete(id)
      .pipe(finalize(() => {
        this.isLoading$.next(false);
        this.bookToDelete = null;
      }))
      .subscribe({
        next: () => {
          this.success$.next('Book deleted successfully ✔');
          this.refresh$.next();
          setTimeout(() => this.success$.next(''), 3000);
        },
        error: err => {
          this.error$.next(err?.error?.message || 'Delete failed.');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}