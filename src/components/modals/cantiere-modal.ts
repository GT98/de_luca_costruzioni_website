import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Cantiere, CantiereInsert, StatoCantiere } from '../../models/cantiere';

@Component({
  selector: 'app-cantiere-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cantiere-modal.html',
  styleUrl: './fornitore-modal.scss',
})
export class CantiereModal implements OnInit, OnChanges {
  @Input() cantiere?: Cantiere;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<CantiereInsert>();

  private fb = inject(FormBuilder);

  cantiereForm!: FormGroup;
  isEditMode = false;

  statoOptions: StatoCantiere[] = ['pianificato', 'in_corso', 'sospeso', 'completato', 'annullato'];

  ngOnInit(): void {
    this.initForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.isEditMode = !!this.cantiere;
      this.initForm();
    }
  }

  initForm(): void {
    this.cantiereForm = this.fb.group({
      nome: [this.cantiere?.nome || '', Validators.required],
      ristrutturazione_id: [this.cantiere?.ristrutturazione_id || null],
      indirizzo: [this.cantiere?.indirizzo || '', Validators.required],
      citta: [this.cantiere?.citta || '', Validators.required],
      cap: [this.cantiere?.cap || ''],
      provincia: [this.cantiere?.provincia || ''],
      cliente_nome: [this.cantiere?.cliente_nome || ''],
      cliente_cognome: [this.cantiere?.cliente_cognome || ''],
      cliente_telefono: [this.cantiere?.cliente_telefono || ''],
      cliente_email: [this.cantiere?.cliente_email || '', Validators.email],
      data_inizio: [this.cantiere?.data_inizio || ''],
      data_fine_prevista: [this.cantiere?.data_fine_prevista || ''],
      data_fine_effettiva: [this.cantiere?.data_fine_effettiva || ''],
      stato: [this.cantiere?.stato || 'pianificato', Validators.required],
      budget: [this.cantiere?.budget || null, [Validators.min(0)]],
      costo_effettivo: [this.cantiere?.costo_effettivo || null, [Validators.min(0)]],
      note: [this.cantiere?.note || ''],
      is_attivo: [this.cantiere?.is_attivo !== false],
    });
  }

  close(): void {
    this.onClose.emit();
  }

  save(): void {
    if (this.cantiereForm.valid) {
      this.onSave.emit(this.cantiereForm.value as CantiereInsert);
    }
  }

  getStatoLabel(stato: StatoCantiere): string {
    const labels: Record<StatoCantiere, string> = {
      'pianificato': 'Pianificato',
      'in_corso': 'In Corso',
      'sospeso': 'Sospeso',
      'completato': 'Completato',
      'annullato': 'Annullato'
    };
    return labels[stato];
  }
}
