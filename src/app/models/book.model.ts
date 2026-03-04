export interface Book {
  id: number;
  userId: number; // legacy field — used as author placeholder
  title: string;
  body: string; // book description
  isbn: string;
  category: string;
  publishedYear: number; // numeric year e.g. 1984 — NOT a date string
  coverImage?: string; // URL, may be absent
  totalCopies: number;
  availableCopies: number;
  issuedCopies: number;
  addedDate: string; // ISO 8601
  addedBy: string;
}

