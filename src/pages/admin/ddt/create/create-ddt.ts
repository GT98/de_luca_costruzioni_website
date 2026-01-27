import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { DdtService } from '../../../../services/ddt.service';
import { DDTInsert, TipoDDT } from '../../../../models/ddt';
import { DDTMaterialeInsert } from '../../../../models/ddt-materiale';
import { Fornitore } from '../../../../models/fornitore';
import { Cantiere } from '../../../../models/cantiere';
import { Materiale } from '../../../../models/materiale';

@Component({
  selector: 'app-create-ddt',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-ddt.html',
  styleUrl: './create-ddt.scss',
})
export default class CreateDdt implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ddtService = inject(DdtService);

  loading = signal(false);
  fornitori = signal<Fornitore[]>([]);
  cantieri = signal<Cantiere[]>([]);
  materialiDisponibili = signal<Materiale[]>([]);

  tipoOptions: { value: TipoDDT; label: string }[] = [
    { value: 'carico', label: 'Carico' },
    { value: 'scarico', label: 'Scarico' },
    { value: 'reso', label: 'Reso' },
  ];

  ddtForm!: FormGroup<{
    numero_ddt: any;
    data_ddt: any;
    tipo: any;
    fornitore_id: any;
    cantiere_id: any;
    note: any;
    importo_totale: any;
    materiali: any;
  }>;

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadData();
  }

  private initForm(): void {
    const today = new Date().toISOString().split('T')[0];
    
    this.ddtForm = this.fb.group({
      numero_ddt: ['', [Validators.required]],
      data_ddt: [today, [Validators.required]],
      tipo: ['carico', [Validators.required]],
      fornitore_id: [null],
      cantiere_id: [null],
      note: [''],
      importo_totale: [null, [Validators.min(0)]],
      materiali: this.fb.array([])
    });
  }

  private async loadData(): Promise<void> {
    try {
      const [fornitori, cantieri, materiali] = await Promise.all([
        this.ddtService.getFornitori(),
        this.ddtService.getCantieri(),
        this.ddtService.getMateriali()
      ]);

      this.fornitori.set(fornitori.filter(f => f.is_attivo));
      this.cantieri.set(cantieri.filter(c => c.stato !== 'annullato'));
      this.materialiDisponibili.set(materiali.filter(m => m.is_attivo));
    } catch (error) {
      console.error('Errore nel caricamento dei dati:', error);
    }
  }

  get materialiFormArray(): FormArray {
    return this.ddtForm.get('materiali') as FormArray;
  }

  addMateriale(): void {
    const materialeGroup = this.fb.group({
      materiale_id: [null, Validators.required],
      quantita: [1, [Validators.required, Validators.min(1)]],
      prezzo_unitario: [null, [Validators.min(0)]],
      importo: [null, [Validators.min(0)]]
    });

    // Auto-calcolo importo quando cambiano quantità o prezzo
    materialeGroup.get('quantita')?.valueChanges.subscribe(() => this.calculateImporto(materialeGroup));
    materialeGroup.get('prezzo_unitario')?.valueChanges.subscribe(() => this.calculateImporto(materialeGroup));

    this.materialiFormArray.push(materialeGroup);
  }

  removeMateriale(index: number): void {
    this.materialiFormArray.removeAt(index);
    this.calculateTotal();
  }

  private calculateImporto(materialeGroup: FormGroup): void {
    const quantita = materialeGroup.get('quantita')?.value || 0;
    const prezzoUnitario = materialeGroup.get('prezzo_unitario')?.value || 0;
    const importo = quantita * prezzoUnitario;
    
    materialeGroup.get('importo')?.setValue(importo, { emitEvent: false });
    this.calculateTotal();
  }

  private calculateTotal(): void {
    const total = this.materialiFormArray.controls.reduce((sum, control) => {
      const importo = control.get('importo')?.value || 0;
      return sum + importo;
    }, 0);

    this.ddtForm.get('importo_totale')?.setValue(total, { emitEvent: false });
  }

  onMaterialeChange(index: number): void {
    const materialeGroup = this.materialiFormArray.at(index);
    const materialeId = materialeGroup.get('materiale_id')?.value;
    
    if (materialeId) {
      const materiale = this.materialiDisponibili().find(m => m.id === parseInt(materialeId));
      if (materiale && materiale.prezzo_unitario) {
        materialeGroup.get('prezzo_unitario')?.setValue(materiale.prezzo_unitario);
      }
    }
  }

  getMaterialeNome(materialeId: number): string {
    const materiale = this.materialiDisponibili().find(m => m.id === materialeId);
    return materiale?.nome || '';
  }

  async onSubmit(): Promise<void> {
    if (this.ddtForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    if (this.materialiFormArray.length === 0) {
      alert('Aggiungi almeno un materiale al DDT');
      return;
    }

    this.loading.set(true);

    try {
      const formValue = this.ddtForm.value;
      
      const ddtData: DDTInsert = {
        numero_ddt: formValue.numero_ddt,
        data_ddt: formValue.data_ddt,
        tipo: formValue.tipo,
        fornitore_id: formValue.fornitore_id || undefined,
        cantiere_id: formValue.cantiere_id || undefined,
        note: formValue.note || undefined,
        importo_totale: formValue.importo_totale || undefined,
      };

      const materialiData: DDTMaterialeInsert[] = formValue.materiali.map((mat: any) => ({
        materiale_id: mat.materiale_id,
        quantita: mat.quantita,
        prezzo_unitario: mat.prezzo_unitario,
        importo: mat.importo
      }));

      await this.ddtService.createDdt(ddtData, materialiData);

      alert('DDT creato con successo!');
      this.router.navigate(['/admin/ddt']);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert('Errore nel salvataggio del DDT');
    } finally {
      this.loading.set(false);
    }
  }

  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      if (confirm('Hai modifiche non salvate. Sei sicuro di voler uscire?')) {
        this.router.navigate(['/admin/ddt']);
      }
    } else {
      this.router.navigate(['/admin/ddt']);
    }
  }

  private hasUnsavedChanges(): boolean {
    return this.ddtForm.dirty;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.ddtForm.controls).forEach(key => {
      const control = this.ddtForm.get(key);
      control?.markAsTouched();
      
      if (control instanceof FormArray) {
        control.controls.forEach(innerControl => {
          Object.keys((innerControl as FormGroup).controls).forEach(innerKey => {
            (innerControl as FormGroup).get(innerKey)?.markAsTouched();
          });
        });
      }
    });
  }

  getErrorMessage(field: string): string {
    const control = this.ddtForm.get(field);
    
    if (control?.hasError('required')) {
      return `Il campo ${this.getFieldLabel(field)} è obbligatorio`;
    }
    
    if (control?.hasError('min')) {
      return `Il valore deve essere maggiore o uguale a 0`;
    }
    
    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      numero_ddt: 'Numero DDT',
      data_ddt: 'Data DDT',
      tipo: 'Tipo',
      fornitore_id: 'Fornitore',
      cantiere_id: 'Cantiere',
      note: 'Note',
      importo_totale: 'Importo totale'
    };
    return labels[field] || field;
  }
}