import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RistrutturazioneWithCover } from '../../services/ristrutturazione.service';
import { RistrutturazioneCard } from '../ristrutturazione-card/ristrutturazione-card';

@Component({
  selector: 'app-ristrutturazione-list',
  imports: [CommonModule, RistrutturazioneCard],
  templateUrl: './ristrutturazione-list.html',
  styleUrl: './ristrutturazione-list.scss',
})
export class RistrutturazioneList {
  @Input() ristrutturazioni: RistrutturazioneWithCover[] = [];
  @Input() loading = false;
  @Output() onView = new EventEmitter<RistrutturazioneWithCover>();
  @Output() onDelete = new EventEmitter<RistrutturazioneWithCover>();
  @Output() onCreate = new EventEmitter<void>();

  get isEmpty(): boolean {
    return !this.loading && this.ristrutturazioni.length === 0;
  }

  viewRistrutturazione(r: RistrutturazioneWithCover): void {
    this.onView.emit(r);
  }

  deleteRistrutturazione(r: RistrutturazioneWithCover): void {
    this.onDelete.emit(r);
  }

  createNew(): void {
    this.onCreate.emit();
  }
}
