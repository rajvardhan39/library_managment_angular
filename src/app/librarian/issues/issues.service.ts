import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';

export interface IssueItem {
  id: number;
  dueDate: string;
  status: string;
  fineAmount?: number;

  book?: {
    id: number;
    title: string;
    isbn: string;
    author?: string;
  };

  user?: {
    id: number;
    username: string;
    fullName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class IssuesService {

  private http = inject(HttpClient);

  private readonly API = 'http://localhost:3001/api/issues';

  /** Get active issues */
  getActiveIssues(): Observable<IssueItem[]> {

    return this.http.get<IssueItem[]>(this.API).pipe(

      map((issues: IssueItem[]) => {

        if (!Array.isArray(issues)) return [];

        // show only currently issued books
        return issues.filter(issue =>
          issue.status === 'issued' &&
          issue.book !== null &&
          issue.user !== null
        );

      })

    );

  }

  /** Get overdue issues */
  getOverdueIssues(): Observable<IssueItem[]> {

    return this.http.get<IssueItem[]>(`${this.API}/overdue/all`).pipe(

      map((issues: IssueItem[]) => {

        if (!Array.isArray(issues)) return [];

        return issues.filter(issue =>
          issue.status === 'issued'
        );

      })

    );

  }

}