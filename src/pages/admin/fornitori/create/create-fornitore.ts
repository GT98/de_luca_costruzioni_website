import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DdtService } from '../../../../services/ddt.service';
import { FornitoreInsert } from '../../../../models/fornitore';

@Component({
  selector: 'app-create-fornitore',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-fornitore.html',
  styleUrl: './create-fornitore.scss',
})
export default class CreateFornitore implements OnInit {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private ddtService = inject(DdtService);

  loading = signal(false);

  fornitoreForm!: FormGroup<{
    nome: any;
    ragione_sociale: any;
    partita_iva: any;
    codice_fiscale: any;
    email: any;
    telefono: any;
    indirizzo: any;
    citta: any;
    cap: any;
    provincia: any;
    pec: any;
    note: any;
    categoria_principale: any;
    is_attivo: any;
  }>;

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.fornitoreForm = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      ragione_sociale: [''],
      partita_iva: ['', [Validators.pattern(/^\d{11}$/)]],
      codice_fiscale: ['', [Validators.pattern(/^[A-Z]{6}\d{2}[A-Z]\d{2}[A-Z]\d{3}[A-Z]$|^\d{11}$/)]],
      email: ['', [Validators.email]],
      telefono: [''],
      indirizzo: [''],
      citta: [''],
      cap: ['', [Validators.pattern(/^\d{5}$/)]],
      provincia: ['', [Validators.maxLength(2)]],
      pec: ['', [Validators.email]],
      note: [''],
      categoria_principale: [''],
      is_attivo: [true, Validators.required]
    });
  }

  async onSubmit(): Promise<void> {
    if (this.fornitoreForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.loading.set(true);

    try {
      const formValue = this.fornitoreForm.value as FornitoreInsert;
      
      await this.ddtService.createFornitore(formValue);

      alert('Fornitore creato con successo!');
      this.router.navigate(['/admin/fornitori']);
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert('Errore nel salvataggio del fornitore');
    } finally {
      this.loading.set(false);
    }
  }

  onCancel(): void {
    if (this.hasUnsavedChanges()) {
      if (confirm('Hai modifiche non salvate. Sei sicuro di voler uscire?')) {
        this.router.navigate(['/admin/fornitori']);
      }
    } else {
      this.router.navigate(['/admin/fornitori']);
    }
  }

  private hasUnsavedChanges(): boolean {
    return this.fornitoreForm.dirty;
  }

  private markFormGroupTouched(): void {
    Object.keys(this.fornitoreForm.controls).forEach(key => {
      const control = this.fornitoreForm.get(key);
      control?.markAsTouched();
    });
  }

  getErrorMessage(field: string): string {
    const control = this.fornitoreForm.get(field);
    
    if (control?.hasError('required')) {
      return `Il campo ${this.getFieldLabel(field)} è obbligatorio`;
    }
    
    if (control?.hasError('minlength')) {
      const minLength = control.errors?.['minlength'].requiredLength;
      return `Il campo ${this.getFieldLabel(field)} deve avere almeno ${minLength} caratteri`;
    }

    if (control?.hasError('maxlength')) {
      const maxLength = control.errors?.['maxlength'].requiredLength;
      return `Il campo ${this.getFieldLabel(field)} può avere massimo ${maxLength} caratteri`;
    }
    
    if (control?.hasError('email')) {
      return 'Inserisci un indirizzo email valido';
    }

    if (control?.hasError('pattern')) {
      if (field === 'partita_iva') {
        return 'La Partita IVA deve essere di 11 cifre';
      }
      if (field === 'codice_fiscale') {
        return 'Codice fiscale non valido';
      }
      if (field === 'cap') {
        return 'Il CAP deve essere di 5 cifre';
      }
    }
    
    return '';
  }

  private getFieldLabel(field: string): string {
    const labels: Record<string, string> = {
      nome: 'Nome',
      ragione_sociale: 'Ragione sociale',
      partita_iva: 'Partita IVA',
      codice_fiscale: 'Codice fiscale',
      email: 'Email',
      telefono: 'Telefono',
      indirizzo: 'Indirizzo',
      citta: 'Città',
      cap: 'CAP',
      provincia: 'Provincia',
      pec: 'PEC',
      note: 'Note',
      categoria_principale: 'Categoria principale',
      is_attivo: 'Attivo'
    };
    return labels[field] || field;
  }
}