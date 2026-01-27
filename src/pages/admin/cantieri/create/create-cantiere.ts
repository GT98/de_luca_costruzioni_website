import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators, FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { DdtService } from '../../../../services/ddt.service';
import { CantiereInsert, StatoCantiere } from '../../../../models/cantiere';

@Component({
  selector: 'app-create-cantiere',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-cantiere.html',
  styleUrl: './create-cantiere.scss',
})
export default class CreateCantiere implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
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

  loading = signal(false);
  error = signal<string | null>(null);

  statoOptions: StatoCantiere[] = ['pianificato', 'in_corso', 'sospeso', 'completato', 'annullato'];

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.cantiereForm = this.fb.group({
      nome: ['', Validators.required],
      ristrutturazione_id: [''],
      indirizzo: ['', Validators.required],
      citta: ['', Validators.required],
      cap: [''],
      provincia: [''],
      cliente_nome: [''],
      cliente_cognome: [''],
      cliente_telefono: [''],
      cliente_email: ['', Validators.email],
      data_inizio: [''],
      data_fine_prevista: [''],
      data_fine_effettiva: [''],
      stato: ['pianificato' as StatoCantiere, Validators.required],
      budget: [null as number | null, [Validators.min(0)]],
      costo_effettivo: [null as number | null, [Validators.min(0)]],
      note: [''],
      is_attivo: [true],
    });
  }

  async onSubmit(): Promise<void> {
    if (this.cantiereForm.valid) {
      try {
        this.loading.set(true);
        this.error.set(null);

        const formData = this.cantiereForm.value as CantiereInsert;
        await this.ddtService.createCantiere(formData);

        await this.router.navigate(['/admin/cantieri']);
      } catch (err) {
        console.error('Errore nel salvataggio del cantiere:', err);
        this.error.set('Errore nel salvataggio del cantiere');
      } finally {
        this.loading.set(false);
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