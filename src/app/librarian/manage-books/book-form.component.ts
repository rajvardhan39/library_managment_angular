import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Book } from '../../models/book.model';

@Component({
  selector: 'app-book-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-form.component.html',
  styleUrls: ['./book-form.component.css']
})
export class BookFormComponent {

  @Input() book: Book | null = null;
  @Output() saved = new EventEmitter<any>();
  @Output() cancelled = new EventEmitter<void>();

  constructor(private fb: FormBuilder) {}

  form = this.fb.group({
    title: ['', Validators.required],
    body: ['', Validators.required],
    category: ['General'],
    publishedYear: [2024],
    totalCopies: [1, [Validators.required, Validators.min(1)]],
    coverImage: ['']
  });

  ngOnInit() {
    if (this.book) {
      this.form.patchValue({
        title: this.book.title,
        body: this.book.body,
        category: this.book.category,
        publishedYear: this.book.publishedYear,
        totalCopies: this.book.totalCopies,
        coverImage: this.book.coverImage
      });
    }
  }

  submit() {
    if (this.form.invalid) return;
    this.saved.emit(this.form.value);
  }

  close() {
    this.cancelled.emit();
  }
}