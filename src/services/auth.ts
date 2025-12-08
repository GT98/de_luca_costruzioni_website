import { computed, inject, Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';
import { User } from '@supabase/supabase-js';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class AuthService {

  private supabase = inject(Supabase).getClient();
  
  // Signal per l'utente corrente
  private currentUserSignal = signal<User | null>(null);
  private sessionLoadedSignal = signal<boolean>(false);
  
  // Computed signals per valori derivati
  public currentUser = this.currentUserSignal.asReadonly();
  public isAuthenticated = computed(() => this.currentUserSignal() !== null);
  public userEmail = computed(() => this.currentUserSignal()?.email ?? '');
  public sessionLoaded = this.sessionLoadedSignal.asReadonly();

  constructor(private router: Router) {

    // Verifica sessione all'avvio
    this.initSession();

    // Ascolta i cambiamenti di autenticazione
    this.supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state changed:', event, session?.user?.email);
      this.currentUserSignal.set(session?.user ?? null);
      if (!this.sessionLoadedSignal()) {
        this.sessionLoadedSignal.set(true);
      }
    });
  }

  private async initSession() {
    try {
      const { data: { session }, error } = await this.supabase.auth.getSession();
      console.log('Session loaded:', session?.user?.email, 'Error:', error);
      
      if (error) {
        console.error('Errore nel recupero della sessione:', error);
      }
      
      this.currentUserSignal.set(session?.user ?? null);
    } catch (error) {
      console.error('Errore nel recupero della sessione:', error);
      this.currentUserSignal.set(null);
    } finally {
      this.sessionLoadedSignal.set(true);
    }
  }

  async waitForSession(): Promise<void> {
    // Se la sessione è già caricata, ritorna subito
    if (this.sessionLoadedSignal()) {
      return;
    }

    // Altrimenti aspetta che sia caricata (max 5 secondi)
    return new Promise((resolve) => {
      const startTime = Date.now();
      const checkInterval = setInterval(() => {
        if (this.sessionLoadedSignal() || Date.now() - startTime > 5000) {
          clearInterval(checkInterval);
          resolve();
        }
      }, 50);
    });
  }

  async login(email: string, password: string): Promise<{ success: boolean; error?: string }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password
      });

      if (error) {
        console.error('Login error:', error);
        return { success: false, error: error.message };
      }

      if (data.user && data.session) {
        console.log('Login successful:', data.user.email);
        this.currentUserSignal.set(data.user);
        return { success: true };
      }

      return { success: false, error: 'Errore durante il login' };
    } catch (error) {
      console.error('Login exception:', error);
      return { success: false, error: 'Errore di connessione' };
    }
  }

  async logout() {
    console.log('Logging out...');
    await this.supabase.auth.signOut();
    this.currentUserSignal.set(null);
    this.router.navigate(['/admin/login']);
  }

  getCurrentUser(): User | null {
    return this.currentUserSignal();
  }
}
