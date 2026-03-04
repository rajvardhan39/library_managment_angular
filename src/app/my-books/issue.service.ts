import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { Issue } from '../models/issue.model';

@Injectable({ providedIn: 'root' })
export class IssueService {
  private readonly http = inject(HttpClient);
  private readonly issueUrl = 'http://localhost:3001/api/issues';
  private readonly fineUrl = 'http://localhost:3001/api/fines';

  // User: Borrow
  borrowBook(bookId: number): Observable<any> {
    return this.http.post(this.issueUrl, { bookId });
  }

  // User: List my issues
  getMyIssues(): Observable<Issue[]> {
    return this.http.get<Issue[]>(this.issueUrl);
  }

  // User: Return (using Issue ID)
  returnIssue(issueId: number): Observable<any> {
    return this.http.put(`${this.issueUrl}/${issueId}/return`, {});
  }

  // User: Renew (using Issue ID)
  renewIssue(issueId: number): Observable<any> {
    return this.http.put(`${this.issueUrl}/${issueId}/renew`, {});
  }

  // User: My Fines (using User ID)
  getFinesByUserId(userId: number): Observable<any> {
    return this.http.get(`${this.fineUrl}/user/${userId}`);
  }

  // User: Pay Fine (using Issue ID)
  payFine(issueId: number): Observable<any> {
    return this.http.post(`${this.fineUrl}/${issueId}/pay`, {});
  }

  // Librarian: Overdue Report
  getOverdueReport(): Observable<Issue[]> {
    return this.http.get<Issue[]>(`${this.issueUrl}/overdue/all`);
  }
}