import { Directive, Input, TemplateRef, ViewContainerRef, inject, OnInit, OnDestroy } from '@angular/core';
import { AuthService } from '../auth/auth.service';
import { Subject, takeUntil } from 'rxjs';

@Directive({
  selector: '[appRole]',
  standalone: true
})
export class RoleDirective implements OnInit, OnDestroy {
  private auth = inject(AuthService);
  private templateRef = inject(TemplateRef<any>);
  private vcr = inject(ViewContainerRef);
  private destroy$ = new Subject<void>();

  @Input('appRole') targetRole!: string;

  ngOnInit(): void {
    this.auth.currentUser$.pipe(takeUntil(this.destroy$)).subscribe(user => {
      this.vcr.clear();
      if (user?.role === this.targetRole) {
        this.vcr.createEmbeddedView(this.templateRef);
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}