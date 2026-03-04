import { Component, OnInit, OnDestroy, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IssueService } from './issue.service';
import { Issue } from '../models/issue.model';
import { AuthService } from '../auth/auth.service';
import { combineLatest, Subject, timer } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';

@Component({
  selector: 'app-my-books',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './my-books.component.html',
  styleUrls: ['./my-books.component.css']
})
export class MyBooksComponent implements OnInit, OnDestroy {
  private issueService = inject(IssueService);
  private authService = inject(AuthService);
  private destroy$ = new Subject<void>();

  // Data State
  issues: Issue[] = [];
  returnedIssues: Issue[] = [];
  activeIssues: Issue[] = [];
  fines: any = null;

  // Counters
  activeCount = 0;
  overdueCount = 0;
  today = new Date();

  // UI State
  isLoading = false;
  activeTab: 'active' | 'history' = 'active';
  toast: { message: string; type: 'success' | 'error' | 'info' } | null = null;

  ngOnInit(): void {
    this.loadData();
  }

  loadData(isSilent: boolean = false): void {
    const user = this.authService.currentUserSnapshot;
    if (!user) return;

    if (!isSilent) this.isLoading = true;

    combineLatest([
      this.issueService.getMyIssues(),
      this.issueService.getFinesByUserId(user.id)
    ])
    .pipe(
      takeUntil(this.destroy$),
      finalize(() => this.isLoading = false)
    )
    .subscribe({
      next: ([issues, fines]) => {
        this.issues = issues ?? [];
        this.fines = fines ?? null;

        // Categorize issues for the tabs
        this.activeIssues = this.issues.filter(i => i.status === 'issued');
        this.returnedIssues = this.issues.filter(i => i.status === 'returned');
        
        this.activeCount = this.activeIssues.length;
        this.overdueCount = this.activeIssues.filter(i => this.isOverdue(i)).length;
      },
      error: (err) => {
        console.error('Failed to load dashboard data', err);
        this.showToast('Failed to sync library data', 'error');
      }
    });
  }

  isOverdue(issue: Issue): boolean {
    if (!issue?.dueDate || issue.status !== 'issued') return false;
    return new Date(issue.dueDate) < this.today;
  }

  showToast(message: string, type: 'success' | 'error' | 'info' = 'success'): void {
    this.toast = { message, type };
    timer(4000).pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.toast = null;
    });
  }

  switchTab(tab: 'active' | 'history'): void {
    this.activeTab = tab;
  }

  onReturn(id: number): void {
    this.isLoading = true;
    this.issueService.returnIssue(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToast('Book returned successfully!');
          this.loadData(true);
          this.authService.refreshProfile();
        },
        error: (err) => {
          this.isLoading = false;
          this.showToast('Return failed. Please try again.', 'error');
        }
      });
  }

  onRenew(id: number): void {
    this.isLoading = true;
    this.issueService.renewIssue(id)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToast('Renewal successful! Due date extended.', 'info');
          this.loadData(true);
        },
        error: (err) => {
          this.isLoading = false;
          this.showToast('Renewal limit reached or error occurred.', 'error');
        }
      });
  }

  onPayFine(issueId: number): void {
    this.isLoading = true;
    this.issueService.payFine(issueId)
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: () => {
          this.showToast('Fine paid successfully. Account cleared.', 'success');
          this.loadData(true);
        },
        error: (err) => {
          this.isLoading = false;
          this.showToast('Payment processing failed.', 'error');
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}