import { CommonModule } from '@angular/common';
import { Component, ChangeDetectionStrategy, OnDestroy, inject } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { BehaviorSubject, Subject, combineLatest, of } from 'rxjs';
import { catchError, shareReplay, takeUntil, map } from 'rxjs';

import { Book } from '../../models/book.model';
import { Issue } from '../../models/issue.model';
import { BookService } from '../book.service';
import { IssueService } from '../../my-books/issue.service';
import { AuthService } from '../../auth/auth.service';

interface LibrarianBookView extends Book {
  borrowedBy?: string;
  dueDate?: string;
}

@Component({
  selector: 'app-librarian-books-view',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './librarian-books-view.component.html',
  styleUrls: ['./librarian-books-view.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class LibrarianBooksViewComponent implements OnDestroy {

  private bookService = inject(BookService);
  private issueService = inject(IssueService);
  private auth = inject(AuthService);
  private router = inject(Router);

  private destroy$ = new Subject<void>();

  logout(): void {
    this.auth.logout();
  }

  readonly books$ = combineLatest([
    this.bookService.getAll(),
    this.issueService.getOverdueReport().pipe(
      catchError(() => of([] as Issue[]))
    )
  ]).pipe(
    map(([books, issues]) => {

      return books.map(book => {

        const activeIssue = issues.find(
          i => Number(i.book?.id || i.bookId) === book.id &&
               i.status === 'issued'
        );

        return {
          ...book,
          borrowedBy: activeIssue?.user?.fullName,
          dueDate: activeIssue?.dueDate
        };
      });

    }),
    shareReplay(1),
    takeUntil(this.destroy$)
  );

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}