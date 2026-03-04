import { Routes } from '@angular/router';

import { authGuard } from './auth/guards/auth.guard';
import { librarianGuard } from './auth/guards/librarian.guard';
import { userGuard } from './auth/guards/user.guard';

export const routes: Routes = [

  // =============================
  // DEFAULT
  // =============================
  {
    path: '',
    redirectTo: '/login',
    pathMatch: 'full'
  },

  // =============================
  // AUTH ROUTES
  // =============================
  {
    path: 'login',
    loadComponent: () =>
      import('./auth/login/login.component')
        .then(m => m.LoginComponent)
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./auth/register/register.component')
        .then(m => m.RegisterComponent)
  },

  // =============================
  // USER SECTION
  // =============================

  {
    path: 'books',
    canActivate: [authGuard, userGuard],
    loadComponent: () =>
      import('./books/books-catalog/books-catalog.component')
        .then(m => m.BooksCatalogComponent)
  },

  {
    path: 'books/:id',
    canActivate: [authGuard, userGuard],
    loadComponent: () =>
      import('./books/book-detail/book-detail.component')
        .then(m => m.BookDetailComponent)
  },

  {
    path: 'my-books',
    canActivate: [authGuard, userGuard],
    loadComponent: () =>
      import('./my-books/my-books.component')
        .then(m => m.MyBooksComponent)
  },

  // =============================
  // LIBRARIAN SECTION
  // =============================

  {
    path: 'librarian',
    canActivate: [authGuard, librarianGuard],
    children: [

      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },

      // DASHBOARD
      {
        path: 'dashboard',
        loadComponent: () =>
          import('./librarian/dashboard/dashboard.component')
            .then(m => m.DashboardComponent)
      },

      // CATALOG VIEW (READ ONLY)
      {
        path: 'catalog',
        loadComponent: () =>
          import('./books/books-catalog/librarian-books-view.component')
            .then(m => m.LibrarianBooksViewComponent)
      },

      // BOOK MANAGEMENT
      {
        path: 'books',
        loadComponent: () =>
          import('./librarian/manage-books/book-list-admin.component')
            .then(m => m.BookListAdminComponent)
      },

      // USER MANAGEMENT
      {
        path: 'users',
        loadComponent: () =>
          import('./librarian/manage-users/user-list.component')
            .then(m => m.UserListComponent)
      },

      // ISSUE MANAGEMENT
      {
        path: 'issues',
        loadComponent: () =>
          import('./librarian/issues/issues.component')
            .then(m => m.IssuesComponent)
      }

    ]
  },

  // =============================
  // FALLBACK
  // =============================
  {
    path: '**',
    redirectTo: '/login'
  }

];