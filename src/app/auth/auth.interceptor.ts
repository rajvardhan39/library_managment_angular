import { HttpHandlerFn, HttpInterceptorFn, HttpRequest } from '@angular/common/http';

const TOKEN_KEY = 'library_token';

export function authInterceptor(req: HttpRequest<unknown>, next: HttpHandlerFn) {
  const token = localStorage.getItem(TOKEN_KEY);
  if (token) {
    const cloned = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${token}`),
    });
    return next(cloned);
  }
  return next(req);
}

export { TOKEN_KEY };
