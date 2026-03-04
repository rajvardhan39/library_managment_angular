import { ApplicationConfig } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { routes } from './app.routes';
import { authInterceptor } from './auth/auth.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    // CRITICAL: withComponentInputBinding maps :id to @Input() id
    provideRouter(routes, withComponentInputBinding()), 
    provideHttpClient(withInterceptors([authInterceptor]))
  ]
};