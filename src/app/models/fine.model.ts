export interface FineItem {
  issueId: number;
  bookTitle: string;
  fineAmount: number;
  finePaid: boolean;
}

// Shape returned by GET /api/fines/user/:userId
export interface FinesResponse {
  totalFines: number; // lifetime amount ever accrued (paid + unpaid)
  paidFines: number;
  unpaidFines: number; // current outstanding balance
  unpaidIssuesCount: number;
  issuesWithFines: FineItem[];
}

// Shape returned by POST /api/fines/:issueId/pay
export interface PayFineResponse {
  message: string;
  amountPaid: number;
  remainingFines: number;
}

// Shape returned by GET /api/fines/calculate/:issueId (fine preview)
export interface FinePreview {
  issueId: number;
  dueDate: string;
  gracePeriodDays: number;
  overdueDays: number;
  finePerDay: number;
  calculatedFine: number;
  maxFinePerBook: number;
  isOverdue: boolean;
  status: string;
}

