import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

export interface DashboardStatsResponse {
  totalBooks: number;
  uniqueTitles?: number;
  totalUsers: number;
  activeUsers?: number;
  totalIssues: number;
  overdueCount: number;
  utilizationRate?: string;
  overdueRate?: string;
  totalFines?: number;
  popularBooks?: Array<{ title: string; issueCount: number }>;
}

export interface IssueItem {
  id: number;
  dueDate: string;
  status:string;
  fineAmount?: number;
book?: {
  id: number;
  title: string;
  isbn: string;
  coverImage?: string;
};
  user?: {
    id: number;
    username: string;
    fullName: string;
  };
}

@Injectable({ providedIn: 'root' })
export class DashboardService {

  private readonly api = 'http://localhost:3001/api';

  constructor(private http: HttpClient) {}

  /** Dashboard KPI stats */
  getDashboardStats(): Observable<any> {
    return this.http.get(`${this.api}/stats/dashboard`);
  }

  /** All active issues (who borrowed what) */
  getActiveIssues(): Observable<IssueItem[]> {
    return this.http.get<IssueItem[]>(`${this.api}/issues`);
  }

  /** Overdue issues report */
  getOverdueReport(): Observable<IssueItem[]> {
    return this.http.get<IssueItem[]>(`${this.api}/issues/overdue/all`);
  }
}