import { CommonModule } from '@angular/common';
import { Component, Input, OnInit, OnChanges, OnDestroy, SimpleChanges, ChangeDetectionStrategy, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject, Observable, Subject, of } from 'rxjs';
import { catchError, shareReplay, switchMap, takeUntil, tap } from 'rxjs';
import { AuthService } from '../../auth/auth.service';
import { BookService } from '../book.service';
import { IssueService } from '../../my-books/issue.service';
import { LoadingSpinnerComponent } from '../../shared/loading-spinner.component';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, LoadingSpinnerComponent],
  templateUrl: './book-detail.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class BookDetailComponent implements OnInit, OnChanges, OnDestroy {
  @Input() id!: string; // Bound via withComponentInputBinding() in app.config.ts

  private readonly bookService = inject(BookService);
  private readonly issueService = inject(IssueService);
  private readonly auth = inject(AuthService);

  private readonly destroy$ = new Subject<void>();
  private readonly refresh$ = new BehaviorSubject<number | null>(null);

  readonly isLoading$ = new BehaviorSubject<boolean>(true);
  readonly error$ = new BehaviorSubject<string>('');
  readonly isBorrowing$ = new BehaviorSubject<boolean>(false);
  readonly currentUser$ = this.auth.currentUser$;

  // FIXED: Added explicit types to solve the "unknown" error
  readonly book$: Observable<Book | null> = this.refresh$.pipe(
    switchMap((id): Observable<Book | null> => {
      if (!id) return of(null);
      this.isLoading$.next(true);
      this.error$.next('');
      
      return this.bookService.getById(id).pipe(
        tap(() => this.isLoading$.next(false)),
        catchError((err) => {
          this.isLoading$.next(false);
          this.error$.next('Book not found or server error.');
          return of(null);
        })
      );
    }),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  ngOnInit(): void {
    if (this.id) this.refresh$.next(+this.id);
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['id'] && this.id) {
      this.refresh$.next(+this.id);
    }
  }

  onBorrow(book: Book): void {
    if (book.availableCopies <= 0) return;
    
    this.isBorrowing$.next(true);
    this.issueService.borrowBook(book.id).subscribe({
      next: (res) => {
        alert(res.message || 'Borrowed successfully!');
        this.isBorrowing$.next(false);
        this.refresh$.next(book.id); // Refresh data to show updated availableCopies
      },
      error: (err) => {
        alert(err.error?.message || 'Borrow failed');
        this.isBorrowing$.next(false);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}