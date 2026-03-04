import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { FinesResponse, PayFineResponse } from '../models/fine.model';
import { AuthService } from '../auth/auth.service';

@Injectable({ providedIn: 'root' })
export class FineService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly apiUrl = 'http://localhost:3001/api/fines';

  getMyFines(): Observable<FinesResponse> {
    const userId = this.auth.currentUserSnapshot?.id;
    // Verified: GET /api/fines/user/:userId
    return this.http.get<FinesResponse>(`${this.apiUrl}/user/${userId}`);
  }

  payFine(issueId: number): Observable<PayFineResponse> {
    return this.http.post<PayFineResponse>(`${this.apiUrl}/${issueId}/pay`, {});
  }
}