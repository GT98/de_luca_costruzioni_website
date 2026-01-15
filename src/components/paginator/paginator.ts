import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-paginator',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './paginator.html',
  styleUrl: './paginator.scss',
})
export class Paginator {
  @Input() currentPage = 1;
  @Input() totalItems = 0;
  @Input() itemsPerPage = 9;
  @Output() pageChange = new EventEmitter<number>();

  get totalPages(): number {
    return Math.ceil(this.totalItems / this.itemsPerPage);
  }

  get pages(): number[] {
    const total = this.totalPages;
    const current = this.currentPage;
    const delta = 2; // Numero di pagine da mostrare prima e dopo la pagina corrente
    const range: number[] = [];

    // Logica per mostrare pagine intelligentemente
    // Es: 1 ... 4 5 [6] 7 8 ... 20
    for (let i = 1; i <= total; i++) {
      if (
        i === 1 || // Prima pagina
        i === total || // Ultima pagina
        (i >= current - delta && i <= current + delta) // Pagine vicine alla corrente
      ) {
        range.push(i);
      }
    }

    return range;
  }

  get showEllipsisStart(): boolean {
    return this.currentPage > 4;
  }

  get showEllipsisEnd(): boolean {
    return this.currentPage < this.totalPages - 3;
  }

  goToPage(page: number): void {
    if (page >= 1 && page <= this.totalPages && page !== this.currentPage) {
      this.pageChange.emit(page);
    }
  }

  previousPage(): void {
    if (this.currentPage > 1) {
      this.goToPage(this.currentPage - 1);
    }
  }

  nextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.goToPage(this.currentPage + 1);
    }
  }

  get hasPreviousPage(): boolean {
    return this.currentPage > 1;
  }

  get hasNextPage(): boolean {
    return this.currentPage < this.totalPages;
  }

  // Helper per il template
  get minValue(): number {
    return Math.min(this.currentPage * this.itemsPerPage, this.totalItems);
  }
}
