import { Pipe, PipeTransform } from '@angular/core';
import { Issue } from '../models/issue.model';

@Pipe({ name: 'overdueStatus', standalone: true })
export class OverdueStatusPipe implements PipeTransform {
  transform(issue: Issue | null | undefined): string {
    if (!issue) return '—';
    if (issue.status === 'returned') return 'Returned';
    if (issue.status === 'overdue') return 'Overdue';
    return 'Issued';
  }
}
