import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormSuccessMessage } from '../form-success-message/form-success-message';
import { LeadService } from '../../services/lead';
import { FreeEstimateLead } from '../../models/lead';

@Component({
  selector: 'app-form-free-estimate',
  imports: [ReactiveFormsModule, CommonModule, FormSuccessMessage],
  templateUrl: './form-free-estimate.html',
  styleUrl: './form-free-estimate.scss',
})
export class FormFreeEstimate implements OnInit {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);

  estimateForm!: FormGroup;
  isSubmitted = false;
  isSubmitting = false;

  ngOnInit(): void {
    this.estimateForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      mobile: ['', Validators.required],
      address: ['', Validators.required],
      square_meters: [null],
      floor: [''],
      service_type: [''],
      budget: [''],
      email: ['', [Validators.required, Validators.email]],
      notes: [''],
      privacy_accepted: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.estimateForm.valid) {
      console.log('Form Preventivo Inviato:', this.estimateForm.value);
      this.isSubmitting = true;

      const formValue = this.estimateForm.value;
      const leadData: Omit<FreeEstimateLead, 'id' | 'created_at' | 'lead_status' | 'read'> = {
        ...formValue,
        square_meters: formValue.square_meters ? Number(formValue.square_meters) : undefined,
        lead_type: 'free_estimate' as const
      };

      this.leadService.saveContactLead(leadData)
        .then((data) => {
          console.log('Richiesta preventivo salvata con successo', data);
          this.isSubmitted = true;
          this.isSubmitting = false;
          this.estimateForm.reset();
        })
        .catch((error) => {
          console.error('Errore nel salvataggio della richiesta preventivo', error);
          alert('Si è verificato un errore durante l\'invio. Riprova.');
          this.isSubmitting = false;
        });
    } else {
      this.estimateForm.markAllAsTouched();
      alert('Per favore, compila tutti i campi obbligatori correttamente.');
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.estimateForm.reset();
    this.estimateForm.get('privacy_accepted')?.setValue(false);
  }
}
