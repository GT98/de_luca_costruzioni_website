import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Fornitore, FornitoreInsert } from '../../models/fornitore';

@Component({
  selector: 'app-fornitore-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './fornitore-modal.html',
  styleUrl: './fornitore-modal.scss',
})
export class FornitoreModal implements OnInit, OnChanges {
  @Input() fornitore?: Fornitore;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<FornitoreInsert>();

  private fb = inject(FormBuilder);

  fornitoreForm!: FormGroup;
  isEditMode = false;

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.isEditMode = !!this.fornitore;
      this.initForm();
    }
  }

  initForm(): void {
    this.fornitoreForm = this.fb.group({
      nome: [this.fornitore?.nome || '', Validators.required],
      ragione_sociale: [this.fornitore?.ragione_sociale || ''],
      partita_iva: [this.fornitore?.partita_iva || ''],
      codice_fiscale: [this.fornitore?.codice_fiscale || ''],
      email: [this.fornitore?.email || '', Validators.email],
      telefono: [this.fornitore?.telefono || ''],
      indirizzo: [this.fornitore?.indirizzo || ''],
      citta: [this.fornitore?.citta || ''],
      cap: [this.fornitore?.cap || ''],
      provincia: [this.fornitore?.provincia || ''],
      pec: [this.fornitore?.pec || '', Validators.email],
      note: [this.fornitore?.note || ''],
      categoria_principale: [this.fornitore?.categoria_principale || ''],
      is_attivo: [this.fornitore?.is_attivo !== false],
    });
  }

  close(): void {
    this.onClose.emit();
  }

  save(): void {
    if (this.fornitoreForm.valid) {
      this.onSave.emit(this.fornitoreForm.value as FornitoreInsert);
    }
  }
}
