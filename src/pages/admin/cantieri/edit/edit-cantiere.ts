import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { DdtService } from '../../../../services/ddt.service';
import { Cantiere, CantiereUpdate, StatoCantiere } from '../../../../models/cantiere';

@Component({
  selector: 'app-edit-cantiere',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './edit-cantiere.html',
  styleUrl: './edit-cantiere.scss',
})
export default class EditCantiere implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private ddtService = inject(DdtService);

  cantiereForm!: FormGroup<{
    nome: FormControl<string | null>;
    ristrutturazione_id: FormControl<string | null>;
    indirizzo: FormControl<string | null>;
    citta: FormControl<string | null>;
    cap: FormControl<string | null>;
    provincia: FormControl<string | null>;
    cliente_nome: FormControl<string | null>;
    cliente_cognome: FormControl<string | null>;
    cliente_telefono: FormControl<string | null>;
    cliente_email: FormControl<string | null>;
    data_inizio: FormControl<string | null>;
    data_fine_prevista: FormControl<string | null>;
    data_fine_effettiva: FormControl<string | null>;
    stato: FormControl<StatoCantiere | null>;
    budget: FormControl<number | null>;
    costo_effettivo: FormControl<number | null>;
    note: FormControl<string | null>;
    is_attivo: FormControl<boolean | null>;
  }>;

  cantiere = signal<Cantiere | null>(null);
  loading = signal(true);
  saving = signal(false);
  error = signal<string | null>(null);
  cantiereId = signal<number | null>(null);

  statoOptions: StatoCantiere[] = ['pianificato', 'in_corso', 'sospeso', 'completato', 'annullato'];

  async ngOnInit(): Promise<void> {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.cantiereId.set(parseInt(id));
      await this.loadCantiere(parseInt(id));
    } else {
      this.error.set('ID cantiere non fornito');
      this.loading.set(false);
    }
  }

  async loadCantiere(id: number): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);

      const data = await this.ddtService.getCantiereById(id);
      if (data) {
        this.cantiere.set(data);
        this.initForm(data);
      } else {
        this.error.set('Cantiere non trovato');
      }
    } catch (err) {
      console.error('Errore nel caricamento del cantiere:', err);
      this.error.set('Errore nel caricamento del cantiere');
    } finally {
      this.loading.set(false);
    }
  }

  initForm(cantiere?: Cantiere): void {
    this.cantiereForm = this.fb.group({
      nome: [cantiere?.nome || '', Validators.required],
      ristrutturazione_id: [cantiere?.ristrutturazione_id || ''],
      indirizzo: [cantiere?.indirizzo || '', Validators.required],
      citta: [cantiere?.citta || '', Validators.required],
      cap: [cantiere?.cap || ''],
      provincia: [cantiere?.provincia || ''],
      cliente_nome: [cantiere?.cliente_nome || ''],
      cliente_cognome: [cantiere?.cliente_cognome || ''],
      cliente_telefono: [cantiere?.cliente_telefono || ''],
      cliente_email: [cantiere?.cliente_email || '', Validators.email],
      data_inizio: [cantiere?.data_inizio || ''],
      data_fine_prevista: [cantiere?.data_fine_prevista || ''],
      data_fine_effettiva: [cantiere?.data_fine_effettiva || ''],
      stato: [cantiere?.stato as StatoCantiere || 'pianificato', Validators.required],
      budget: [cantiere?.budget || null, [Validators.min(0)]],
      costo_effettivo: [cantiere?.costo_effettivo || null, [Validators.min(0)]],
      note: [cantiere?.note || ''],
      is_attivo: [cantiere?.is_attivo !== false],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.cantiereForm.valid && this.cantiereId()) {
      try {
        this.saving.set(true);
        this.error.set(null);

        const formData = this.cantiereForm.value as CantiereUpdate;
        await this.ddtService.updateCantiere(this.cantiereId()!, formData);

        await this.router.navigate(['/admin/cantieri']);
      } catch (err) {
        console.error('Errore nel salvataggio del cantiere:', err);
        this.error.set('Errore nel salvataggio del cantiere');
      } finally {
        this.saving.set(false);
      }
    } else {
      this.markFormGroupTouched();
    }
  }

  private markFormGroupTouched(): void {
    Object.keys(this.cantiereForm.controls).forEach(key => {
      const control = this.cantiereForm.get(key);
      control?.markAsTouched();
    });
  }

  async goBack(): Promise<void> {
    await this.router.navigate(['/admin/cantieri']);
  }

  hasError(fieldName: string, errorType: string): boolean {
    const field = this.cantiereForm.get(fieldName);
    return !!(field?.hasError(errorType) && field?.touched);
  }

  getErrorMessage(fieldName: string): string {
    const field = this.cantiereForm.get(fieldName);
    if (!field || !field.touched || !field.errors) return '';

    const errors = field.errors;
    if (errors['required']) return `${this.getFieldLabel(fieldName)} è obbligatorio`;
    if (errors['email']) return 'Inserisci un indirizzo email valido';
    if (errors['min']) return `Il valore minimo è ${errors['min'].min}`;
    
    return 'Valore non valido';
  }

  private getFieldLabel(fieldName: string): string {
    const labels: Record<string, string> = {
      nome: 'Nome cantiere',
      indirizzo: 'Indirizzo',
      citta: 'Città',
      stato: 'Stato',
      cliente_email: 'Email cliente'
    };
    return labels[fieldName] || fieldName;
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