import { Component, inject, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  imports: [FormsModule],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export default class Login {
  email = '';
  password = '';
  loading = signal(false);
  errorMessage = '';
  returnUrl = '/admin';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    // Ottieni l'URL di ritorno se presente
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/admin';
  }

  async onSubmit() {
    if (!this.email || !this.password) {
      this.errorMessage = 'Inserisci email e password';
      return;
    }

    this.loading.update(v => !v);
    this.errorMessage = '';

    const result = await this.authService.login(this.email, this.password);

    if (result.success) {
      this.router.navigate([this.returnUrl]);
    } else {
      this.errorMessage = result.error || 'Errore durante il login';
    }

    this.loading.update(v => !v);
  }
}
