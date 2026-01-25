import { Component, EventEmitter, Input, Output, OnInit, OnChanges, SimpleChanges, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Materiale, MaterialeInsert, UnitaMisura } from '../../models/materiale';
import { Fornitore } from '../../models/fornitore';
import { DdtService } from '../../services/ddt.service';

@Component({
  selector: 'app-materiale-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './materiale-modal.html',
  styleUrl: './fornitore-modal.scss',
})
export class MaterialeModal implements OnInit, OnChanges {
  @Input() materiale?: Materiale;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<MaterialeInsert>();

  private fb = inject(FormBuilder);
  private ddtService = inject(DdtService);

  materialeForm!: FormGroup;
  isEditMode = false;

  unitaMisuraOptions: UnitaMisura[] = ['pz', 'kg', 'mt', 'mq', 'mc', 'lt'];
  fornitori: Fornitore[] = [];

  async ngOnInit(): Promise<void> {
    await this.loadFornitori();
    this.initForm();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.isEditMode = !!this.materiale;
      if (this.fornitori.length === 0) {
        await this.loadFornitori();
      }
      this.initForm();
    }
  }

  async loadFornitori(): Promise<void> {
    try {
      this.fornitori = await this.ddtService.getFornitori();
    } catch (err) {
      console.error('Errore nel caricamento fornitori:', err);
    }
  }

  initForm(): void {
    this.materialeForm = this.fb.group({
      nome: [this.materiale?.nome || '', Validators.required],
      codice: [this.materiale?.codice || ''],
      descrizione: [this.materiale?.descrizione || ''],
      unita_misura: [this.materiale?.unita_misura || 'pz', Validators.required],
      prezzo_unitario: [this.materiale?.prezzo_unitario || null, [Validators.min(0)]],
      quantita_giacenza: [this.materiale?.quantita_giacenza || 0, [Validators.min(0)]],
      soglia_minima: [this.materiale?.soglia_minima || null, [Validators.min(0)]],
      fornitore_id: [this.materiale?.fornitore_id || null],
      categoria: [this.materiale?.categoria || ''],
      note: [this.materiale?.note || ''],
      is_attivo: [this.materiale?.is_attivo !== false],
    });
  }

  close(): void {
    this.onClose.emit();
  }

  save(): void {
    if (this.materialeForm.valid) {
      this.onSave.emit(this.materialeForm.value as MaterialeInsert);
    }
  }
}
