import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RistrutturazioneWithCover } from '../../services/ristrutturazione.service';

@Component({
  selector: 'app-ristrutturazione-card',
  imports: [CommonModule],
  templateUrl: './ristrutturazione-card.html',
  styleUrl: './ristrutturazione-card.scss',
})
export class RistrutturazioneCard {
  @Input({ required: true }) ristrutturazione!: RistrutturazioneWithCover;
  @Output() onView = new EventEmitter<RistrutturazioneWithCover>();
  @Output() onDelete = new EventEmitter<RistrutturazioneWithCover>();

  get truncatedDescription(): string {
    const desc = this.ristrutturazione.description || '';
    return desc.length > 125 ? desc.slice(0, 125) + '...' : desc;
  }

  get beforeCount(): number {
    return this.ristrutturazione.beforeImages?.length || 0;
  }

  get afterCount(): number {
    return this.ristrutturazione.afterImages?.length || 0;
  }

  viewDetails(): void {
    this.onView.emit(this.ristrutturazione);
  }

  delete(): void {
    this.onDelete.emit(this.ristrutturazione);
  }
}
