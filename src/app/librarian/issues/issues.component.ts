import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { IssuesService, IssueItem } from './issues.service';
import { catchError, of } from 'rxjs';

@Component({
  selector: 'app-issues',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './issues.component.html',
  styleUrls: ['./issues.component.css']
})
export class IssuesComponent {

  private service = inject(IssuesService);

  searchTerm = '';
  filter = 'all';

  issues$ = this.service.getActiveIssues().pipe(
    catchError(() => of([]))
  );

  isOverdue(date: string) {
    return new Date(date) < new Date();
  }

  filterIssues(issues: IssueItem[]) {

    return issues.filter(issue => {

      const matchesSearch =
        issue.book?.title?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        issue.user?.fullName?.toLowerCase().includes(this.searchTerm.toLowerCase());

      if (this.filter === 'overdue') {
        return this.isOverdue(issue.dueDate) && matchesSearch;
      }

      if (this.filter === 'active') {
        return !this.isOverdue(issue.dueDate) && matchesSearch;
      }

      return matchesSearch;

    });

  }

}