import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { FormSuccessMessage } from '../form-success-message/form-success-message';
import { LeadService } from '../../services/lead';
import { ContactLead } from '../../models/lead';

@Component({
  selector: 'app-form-user',
  imports: [ReactiveFormsModule, CommonModule, FormSuccessMessage],
  templateUrl: './form-user.html',
  styleUrl: './form-user.scss',
})
export class FormUser implements OnInit {
  private fb = inject(FormBuilder);
  private leadService = inject(LeadService);

  contactForm!: FormGroup;
  isSubmitted = false;
  isSubmitting = false;

  ngOnInit(): void {
    this.contactForm = this.fb.group({
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required],
      address: [''],
      service_type: [''],
      message: [''],
      privacy_accepted: [false, Validators.requiredTrue]
    });
  }

  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form Inviato:', this.contactForm.value);
      this.isSubmitting = true;

      const leadData: Omit<ContactLead, 'id' | 'created_at' | 'lead_status' | 'read'> = {
        ...this.contactForm.value,
        lead_type: 'contact' as const
      };

      this.leadService.saveContactLead(leadData)
        .then((data) => {
          console.log('Lead salvato con successo', data);
          this.isSubmitted = true;
          this.isSubmitting = false;
          this.contactForm.reset();
        })
        .catch((error) => {
          console.error('Errore nel salvataggio del lead', error);
          alert('Si è verificato un errore durante l\'invio. Riprova.');
          this.isSubmitting = false;
        });

    } else {
      this.contactForm.markAllAsTouched();
      alert('Per favore, compila tutti i campi obbligatori correttamente.');
    }
  }

  resetForm(): void {
    this.isSubmitted = false;
    this.contactForm.reset();
    this.contactForm.get('privacy_accepted')?.setValue(false);
  }
}
