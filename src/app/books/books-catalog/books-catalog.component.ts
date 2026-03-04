import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, OnDestroy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormControl, ReactiveFormsModule } from '@angular/forms';

import {
  BehaviorSubject,
  Observable,
  Subject,
  combineLatest,
  of,
  timer
} from 'rxjs';

import {
  catchError,
  finalize,
  shareReplay,
  startWith,
  switchMap,
  takeUntil,
  tap,
  debounceTime,
  distinctUntilChanged,
  map
} from 'rxjs/operators';

import { Book } from '../../models/book.model';
import { AuthService } from '../../auth/auth.service';
import { BookService } from '../book.service';
import { IssueService } from '../../my-books/issue.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';

// FIX: Added 'author' property to the ViewModel to match your template/logic
interface BookViewModel extends Book {
  author: string; 
  isBorrowed: boolean;
  isOutOfStock: boolean;
}

@Component({
  selector: 'app-books-catalog',
  standalone: true,
  imports: [CommonModule, RouterLink, ReactiveFormsModule, LoadingSpinnerComponent],
  templateUrl: './books-catalog.component.html',
  styleUrls: ['./books-catalog.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class BooksCatalogComponent implements OnDestroy {

  private readonly bookService = inject(BookService);
  private readonly issueService = inject(IssueService);
  readonly auth = inject(AuthService);

  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new BehaviorSubject<void>(undefined);

  private readonly isLoadingSubject = new BehaviorSubject<boolean>(true);
  private readonly errorSubject = new BehaviorSubject<string>('');
  private readonly successSubject = new BehaviorSubject<string>('');

  readonly isLoading$ = this.isLoadingSubject.asObservable();
  readonly errorMessage$ = this.errorSubject.asObservable();
  readonly successMessage$ = this.successSubject.asObservable();

  readonly currentUser$ = this.auth.currentUser$;

  searchControl = new FormControl('', { nonNullable: true });
  categoryControl = new FormControl('', { nonNullable: true });
  filterControl = new FormControl('all', { nonNullable: true });

  readonly borrowingBookId$ = new BehaviorSubject<number | null>(null);

  readonly isLimitReached$: Observable<boolean> = this.currentUser$.pipe(
    map(user => !!user && user.currentBooksCount >= user.maxBooksAllowed),
    startWith(false),
    shareReplay(1)
  );

  readonly categories$ = this.bookService.getCategories().pipe(
    catchError(() => of([])),
    shareReplay(1)
  );

  readonly activeIssues$ = this.refresh$.pipe(
    switchMap(() =>
      this.issueService.getMyIssues().pipe(
        map(issues => issues.filter(i => i.status === 'issued')),
        catchError(() => of([]))
      )
    ),
    shareReplay(1)
  );

  readonly books$: Observable<BookViewModel[]> = combineLatest([
    this.searchControl.valueChanges.pipe(
      startWith(''),
      debounceTime(300),
      distinctUntilChanged()
    ),
    this.categoryControl.valueChanges.pipe(
      startWith(''),
      distinctUntilChanged()
    ),
    this.filterControl.valueChanges.pipe(
      startWith('all'),
      distinctUntilChanged()
    ),
    this.refresh$,
    this.activeIssues$
  ]).pipe(
    tap(() => this.isLoadingSubject.next(true)),
    switchMap(([query, category, filterStatus, _, activeIssues]) =>
      this.bookService.getAll().pipe(
        map((books: Book[]) => {
          const borrowedIds = new Set(
            activeIssues.map(i => Number(i.bookId))
          );

          // FIX: Map the legacy userId field to the author property
          let mapped: BookViewModel[] = books.map(book => ({
            ...book,
            author: book.addedBy || `Author ID: ${book.userId}`, 
            isBorrowed: borrowedIds.has(book.id),
            isOutOfStock: book.availableCopies <= 0
          }));

          if (query) {
            const q = query.toLowerCase();
            mapped = mapped.filter(b =>
              (b.title?.toLowerCase().includes(q)) ||
              (b.isbn?.toLowerCase().includes(q)) ||
              (b.author?.toLowerCase().includes(q))
            );
          }

          if (category) {
            mapped = mapped.filter(b => b.category === category);
          }

          if (filterStatus === 'available') {
            mapped = mapped.filter(b => b.availableCopies > 0);
          }

          return mapped;
        }),
        catchError(() => {
          this.errorSubject.next('Failed to load books.');
          return of([]);
        }),
        finalize(() => this.isLoadingSubject.next(false))
      )
    ),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  onBorrow(event: Event, book: BookViewModel): void {
    event.preventDefault();

    if (this.hasReachedLimit() || book.isOutOfStock || book.isBorrowed) return;

    this.borrowingBookId$.next(book.id);

    this.issueService.borrowBook(book.id).pipe(
      finalize(() => this.borrowingBookId$.next(null)),
      takeUntil(this.destroy$)
    ).subscribe({
      next: () => {
        this.refresh$.next();
        this.auth.refreshProfile();
        this.successSubject.next(`"${book.title}" borrowed successfully 🎉`);
        timer(3500).subscribe(() => this.successSubject.next(''));
      },
      error: err => {
        this.errorSubject.next(err?.error?.error || 'Borrowing failed.');
      }
    });
  }

  private hasReachedLimit(): boolean {
    const user = this.auth.currentUserSnapshot;
    return !!user && user.currentBooksCount >= user.maxBooksAllowed;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}