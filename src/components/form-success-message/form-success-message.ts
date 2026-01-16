import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-form-success-message',
  standalone: true,
  imports: [],
  templateUrl: './form-success-message.html',
  styleUrl: './form-success-message.scss',
})
export class FormSuccessMessage {
  @Input() title = 'RICHIESTA INVIATA CON SUCCESSO!';
  @Input() message = 'Grazie per averci contattato. Abbiamo ricevuto la tua richiesta e ti ricontatteremo al più presto.';
  @Input() subtitle = 'Il nostro team valuterà la tua richiesta e ti fornirà una risposta entro 24-48 ore.';
  @Input() showResetButton = true;
  @Input() resetButtonText = 'Invia un\'altra richiesta';

  @Output() reset = new EventEmitter<void>();

  onReset(): void {
    this.reset.emit();
  }
}
