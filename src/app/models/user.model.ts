export interface User {
  id: number;
  username: string;
  email: string;
  fullName: string;
  role: 'user' | 'librarian';
  phone?: string;
  address?: string;
  maxBooksAllowed: number;
  currentBooksCount: number;
  totalFines: number;
  paidFines: number;
  isActive: boolean;
  joinDate: string; // ISO 8601
}

