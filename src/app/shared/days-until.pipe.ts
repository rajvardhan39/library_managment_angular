import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'daysUntil',
  standalone: true
})
export class DaysUntilPipe implements PipeTransform {
  transform(value: string | Date | undefined | null): string {
    if (!value) return '—';

    const targetDate = new Date(value);
    const today = new Date();
    
    // Set both to midnight to compare full days accurately
    targetDate.setHours(0, 0, 0, 0);
    today.setHours(0, 0, 0, 0);

    const diffTime = targetDate.getTime() - today.getTime();
    const diffDays = Math.round(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'Due Today';
    if (diffDays > 0) return `Due in ${diffDays} day${diffDays > 1 ? 's' : ''}`;
    
    // Negative number means it's in the past
    const overdueDays = Math.abs(diffDays);
    return `${overdueDays} day${overdueDays > 1 ? 's' : ''} overdue`;
  }
}