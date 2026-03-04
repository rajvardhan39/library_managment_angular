export interface Issue {
  id: number;
  bookId: number;
  userId: number;
  issueDate: string; // ISO 8601
  dueDate: string; // ISO 8601
  returnDate: string | null;
  status: 'issued' | 'overdue' | 'returned'; // NOT 'active'
  renewalCount: number;
  maxRenewals: number;
  fineAmount: number;
  finePaid: boolean;
  issuedBy: string;
  returnedTo: string | null;
  book?: {
    id: number;
    title: string;
    isbn: string;
  };
  user?: {
    id: number;
    username: string;
    fullName: string;
  };
}

// Helper — compute these client-side, they are NOT returned by the server
export function getDaysUntilDue(issue: Issue): number {
  const now = new Date();
  const due = new Date(issue.dueDate);
  return Math.ceil((due.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
}
export function isOverdue(issue: Issue): boolean {
  return issue.status === 'overdue';
}


