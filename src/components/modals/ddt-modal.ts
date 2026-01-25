import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnInit,
  OnChanges,
  SimpleChanges,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormArray,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { DDT, DDTInsert, TipoDDT } from '../../models/ddt';
import { DDTMaterialeInsert } from '../../models/ddt-materiale';
import { Fornitore } from '../../models/fornitore';
import { Cantiere } from '../../models/cantiere';
import { Materiale } from '../../models/materiale';
import { DdtService } from '../../services/ddt.service';

export interface DdtSaveData {
  ddt: DDTInsert;
  materiali: DDTMaterialeInsert[];
}

@Component({
  selector: 'app-ddt-modal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './ddt-modal.html',
  styleUrl: './ddt-modal.scss',
})
export class DdtModal implements OnInit, OnChanges {
  @Input() ddt?: DDT;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<DdtSaveData>();

  private fb = inject(FormBuilder);
  private ddtService = inject(DdtService);

  ddtForm!: FormGroup;
  isEditMode = false;

  tipoOptions: TipoDDT[] = ['carico', 'scarico', 'reso'];
  fornitori: Fornitore[] = [];
  cantieri: Cantiere[] = [];
  materiali: Materiale[] = [];

  async ngOnInit(): Promise<void> {
    await this.loadData();
    this.initForm();
  }

  async ngOnChanges(changes: SimpleChanges): Promise<void> {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.isEditMode = !!this.ddt;
      if (this.fornitori.length === 0) {
        await this.loadData();
      }
      this.initForm();
    }
  }

  async loadData(): Promise<void> {
    try {
      const [fornitori, cantieri, materiali] = await Promise.all([
        this.ddtService.getFornitori(),
        this.ddtService.getCantieri(),
        this.ddtService.getMateriali(),
      ]);
      this.fornitori = fornitori.filter((f) => f.is_attivo);
      this.cantieri = cantieri.filter((c) => c.is_attivo);
      this.materiali = materiali.filter((m) => m.is_attivo);
    } catch (err) {
      console.error('Errore nel caricamento dati:', err);
    }
  }

  initForm(): void {
    const today = new Date().toISOString().split('T')[0];

    this.ddtForm = this.fb.group({
      numero_ddt: [this.ddt?.numero_ddt || '', Validators.required],
      data_ddt: [this.ddt?.data_ddt || today, Validators.required],
      tipo: [this.ddt?.tipo || 'carico', Validators.required],
      fornitore_id: [this.ddt?.fornitore_id || null],
      cantiere_id: [this.ddt?.cantiere_id || null],
      note: [this.ddt?.note || ''],
      materiali: this.fb.array([]),
    });

    if (this.ddt?.ddt_materiali && this.ddt.ddt_materiali.length > 0) {
      this.ddt.ddt_materiali.forEach((dm) => {
        this.addMaterialeRow(dm.materiale_id, dm.quantita, dm.prezzo_unitario, dm.note);
      });
    } else {
      this.addMaterialeRow();
    }
  }

  get materialiArray(): FormArray {
    return this.ddtForm.get('materiali') as FormArray;
  }

  addMaterialeRow(
    materiale_id: number | null = null,
    quantita: number = 1,
    prezzo_unitario: number | null = null,
    note: string = ''
  ): void {
    const row = this.fb.group({
      materiale_id: [materiale_id, Validators.required],
      quantita: [quantita, [Validators.required, Validators.min(0.01)]],
      prezzo_unitario: [prezzo_unitario, [Validators.min(0)]],
      note: [note],
    });

    this.materialiArray.push(row);
  }

  removeMaterialeRow(index: number): void {
    if (this.materialiArray.length > 1) {
      this.materialiArray.removeAt(index);
    }
  }

  onMaterialeChange(index: number): void {
    const row = this.materialiArray.at(index);
    const materialeId = row.get('materiale_id')?.value;
    const materiale = this.materiali.find((m) => m.id === Number(materialeId));

    if (materiale && materiale.prezzo_unitario) {
      row.get('prezzo_unitario')?.setValue(materiale.prezzo_unitario);
    }
  }

  getMaterialeUnita(materialeId: number | null): string {
    if (!materialeId) return '';
    const materiale = this.materiali.find((m) => m.id === Number(materialeId));
    return materiale?.unita_misura || '';
  }

  getSubtotale(index: number): number {
    const row = this.materialiArray.at(index);
    const quantita = row.get('quantita')?.value || 0;
    const prezzo = row.get('prezzo_unitario')?.value || 0;
    return quantita * prezzo;
  }

  getTotaleComplessivo(): number {
    let totale = 0;
    for (let i = 0; i < this.materialiArray.length; i++) {
      totale += this.getSubtotale(i);
    }
    return totale;
  }

  getTipoLabel(tipo: TipoDDT): string {
    const labels: Record<TipoDDT, string> = {
      carico: 'Carico',
      scarico: 'Scarico',
      reso: 'Reso',
    };
    return labels[tipo];
  }

  close(): void {
    this.onClose.emit();
  }

  save(): void {
    if (this.ddtForm.valid && this.materialiArray.length > 0) {
      const formValue = this.ddtForm.value;

      const ddtData: DDTInsert = {
        numero_ddt: formValue.numero_ddt,
        data_ddt: formValue.data_ddt,
        tipo: formValue.tipo,
        fornitore_id: formValue.fornitore_id ? Number(formValue.fornitore_id) : undefined,
        cantiere_id: formValue.cantiere_id ? Number(formValue.cantiere_id) : undefined,
        note: formValue.note || undefined,
        importo_totale: this.getTotaleComplessivo(),
      };

      const materialiData: DDTMaterialeInsert[] = formValue.materiali.map(
        (m: { materiale_id: number; quantita: number; prezzo_unitario: number; note: string }) => ({
          ddt_id: 0,
          materiale_id: Number(m.materiale_id),
          quantita: Number(m.quantita),
          prezzo_unitario: m.prezzo_unitario ? Number(m.prezzo_unitario) : undefined,
          note: m.note || undefined,
        })
      );

      this.onSave.emit({ ddt: ddtData, materiali: materialiData });
    }
  }
}
