import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LeadService } from '../../services/lead';

@Component({
  selector: 'app-form-user',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './form-user.html',
  styleUrl: './form-user.scss',
})
export class FormUser implements OnInit {

  contactForm!: FormGroup;
  isSubmitted = false;
  isSubmitting = false;
  private n8nWebhookUrl = 'http://localhost:5678/webhook/form-webhook'; // <<< INSERISCI QUI IL TUO VERO URL N8N
  leadService = inject(LeadService);

  constructor(
    private fb: FormBuilder,
    private http: HttpClient
  ) { }

  ngOnInit(): void {
    // Inizializzazione del Form Group con i Reactive Forms
    this.contactForm = this.fb.group({
      // NOTA: Le chiavi qui DEVONO corrispondere esattamente a quelle usate nel nodo SET di n8n
      name: ['', Validators.required],
      surname: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      mobile: ['', Validators.required], // Chiave n8n: mobile
      address: [''],
      service_type: [''], // Chiave n8n: service_type
      message: [''],
      privacy_accepted: [false, Validators.requiredTrue] // Chiave n8n: privacy_accedepted
    });
  }

  // Metodo chiamato al submit del form
  onSubmit(): void {
    if (this.contactForm.valid) {
      console.log('Form Inviato:', this.contactForm.value);
      this.isSubmitting = true;

      this.leadService.saveContactLead(this.contactForm.value)
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
      // Evidenzia i campi non validi
      this.contactForm.markAllAsTouched();
      alert('Per favore, compila tutti i campi obbligatori correttamente.');
    }
  }

  // Metodo per tornare al form
  resetForm(): void {
    this.isSubmitted = false;
    this.contactForm.reset();
    this.contactForm.get('privacy_accepted')?.setValue(false);
  }

}
