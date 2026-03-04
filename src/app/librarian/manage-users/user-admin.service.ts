import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { User } from '../../models/user.model';

@Injectable({ providedIn: 'root' })
export class UserAdminService {
  private readonly http = inject(HttpClient);
  private readonly API_USERS = 'http://localhost:3001/api/users';

  getAllUsers(): Observable<User[]> {
    return this.http.get<User[]>(this.API_USERS);
  }

  // ALIGNED: PUT for Role/Status updates
  updateUser(id: number, payload: any): Observable<User> {
    return this.http.put<User>(`${this.API_USERS}/${id}`, payload);
  }

  deleteUser(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.API_USERS}/${id}`);
  }
}