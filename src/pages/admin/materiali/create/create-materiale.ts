import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DdtService } from '../../../../services/ddt.service';
import { MaterialeInsert, UnitaMisura } from '../../../../models/materiale';
import { Fornitore } from '../../../../models/fornitore';

@Component({
  selector: 'app-create-materiale',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-materiale.html',
  styleUrl: './create-materiale.scss',
})
export default class CreateMateriale implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ddtService = inject(DdtService);

  loading = signal(false);
  fornitori = signal<Fornitore[]>([]);

  unitaMisuraOptions: { value: UnitaMisura; label: string }[] = [
    { value: 'pz', label: 'Pezzi (pz)' },
    { value: 'kg', label: 'Chilogrammi (kg)' },
    { value: 'mt', label: 'Metro (mt)' },
    { value: 'mq', label: 'Metro quadrato (mq)' },
    { value: 'mc', label: 'Metro cubo (mc)' },
    { value: 'lt', label: 'Litro (lt)' },
  ];

  materialeForm!: FormGroup<{
    nome: any;
    codice: any;
    descrizione: any;
    unita_misura: any;
    prezzo_unitario: any;
    quantita_giacenza: any;
    soglia_minima: any;
    fornitore_id: any;
    categoria: any;
    note: any;
    is_attivo: any;
  }>;

  async ngOnInit(): Promise<void> {
    this.initForm();
    await this.loadFornitori();
  }

  private initForm(): void {
    this.materialeForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      codice: [''],
      descrizione: [''],
      unita_misura: ['pz', Validators.required],
      prezzo_unitario: [null, [Validators.min(0)]],
      quantita_giacenza: [null, [Validators.min(0)]],
      soglia_minima: [null, [Validators.min(0)]],
      fornitore_id: [null],
      categoria: [''],
      note: [''],
      is_attivo: [true, Validators.required]
    });
  }

  private async loadFornitori(): Promise<void> {
    try {
      const data = await this.ddtService.getFornitori();
      this.fornitori.set(data.filter(f => f.is_attivo));
    } catch (error) {
      console.error('Errore nel caricamento dei fornitori:', error);
    }
  }

  async onSubmit(): Promise<void> {
    if (this.materialeForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading.set(true);

    try {
      const formValue = this.materialeForm.value as MaterialeInsert;
      
      await this.ddtService.createMateriale(formValue);

      alert('Materiale creato con successo!');
      this.router.navigate(['/admin/materiali']);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert('Errore nel salvataggio del materiale');
    } finally {
      this.loading.set(false);
    }
  }

  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      if (confirm('Hai modifiche non salvate. Sei sicuro di voler uscire?')) {
        this.router.navigate(['/admin/materiali']);
      }
    } else {
      this.router.navigate(['/admin/materiali']);
    }
  }

  private hasUnsavedChanges(): boolean {
    return this.materialeForm.dirty;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.materialeForm.controls).forEach(key => {
      const control = this.materialeForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.materialeForm.get(field);
    
    if (control?.hasError('required')) {
      return `Il campo ${this.getFieldLabel(field)} è obbligatorio`;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Il campo ${this.getFieldLabel(field)} deve avere almeno ${minLength} caratteri`;
    }

    if (control?.hasError('min')) {
      return `Il valore deve essere maggiore o uguale a 0`;
    }
    
    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      nome: 'Nome',
      codice: 'Codice',
      descrizione: 'Descrizione',
      unita_misura: 'Unità di misura',
      prezzo_unitario: 'Prezzo unitario',
      quantita_giacenza: 'Quantità in giacenza',
      soglia_minima: 'Soglia minima',
      fornitore_id: 'Fornitore',
      categoria: 'Categoria',
      note: 'Note',
      is_attivo: 'Attivo'
    };
    return labels[field] || field;
  }
}