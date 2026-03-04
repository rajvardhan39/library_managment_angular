import { Component, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, CommonModule } from '@angular/common';
import { map } from 'rxjs';
import { AuthService } from './auth/auth.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    AsyncPipe
  ],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  private auth = inject(AuthService);

  currentUser$ = this.auth.currentUser$;

  isLibrarian$ = this.auth.currentUser$.pipe(
    map(u => u?.role === 'librarian')
  );

  isNormalUser$ = this.auth.currentUser$.pipe(
    map(u => !!u && u.role !== 'librarian')
  );

  logout() {
    this.auth.logout();
  }

}