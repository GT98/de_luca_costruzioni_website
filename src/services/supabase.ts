import { Injectable } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class Supabase {
  private url = environment.supabaseUrl;
  private anonKey = environment.supabaseAnonKey;
  private serviceRoleKey = environment.supabaseServiceRoleKey; // superadmin / service_role key (store securely)
  private client: SupabaseClient;
  private adminClient?: SupabaseClient;

  constructor() {
    if (!this.url || !this.anonKey) {
      throw new Error('Supabase URL or anon key missing in environment configuration.');
    }

    // client per operazioni lato cliente (anon/public)
    this.client = createClient(this.url, this.anonKey, {
      auth: { persistSession: false },
    });

    // client "admin" usando la service_role key (se configurata)
    if (this.serviceRoleKey) {
      this.adminClient = createClient(this.url, this.serviceRoleKey, {
        auth: { persistSession: false },
      });
    }
  }

  // Recupera il client anon (uso generale)
  getClient(): SupabaseClient {
    return this.client;
  }

  // Recupera il client admin (richiede serviceRoleKey)
  getAdminClient(): SupabaseClient {
    if (!this.adminClient) {
      throw new Error('Supabase service role key not configured. Cannot return admin client.');
    }
    return this.adminClient;
  }

  // Helper rapido per query su una tabella con client anon
  from(table: string) {
    return this.client.from(table);
  }

  // Helper rapido per query su una tabella con client admin (superadmin)
  adminFrom(table: string) {
    return this.getAdminClient().from(table);
  }

  // Esegue una funzione RPC
  rpc(fn: string, params?: any) {
    return this.client.rpc(fn, params);
  }

  // Esegue una funzione RPC con client admin
  adminRpc(fn: string, params?: any) {
    return this.getAdminClient().rpc(fn, params);
  }

  // Esempi di helper auth (anon client)
  async signInWithEmail(email: string, password: string) {
    return this.client.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return this.client.auth.signOut();
  }

  // Utility: permette di usare headers custom sul client admin (es. per bypassare RLS)
  createAdminClientWithHeaders(headers: Record<string, string>): SupabaseClient {
    const key = this.serviceRoleKey;
    if (!key) throw new Error('Service role key not configured.');
    return createClient(this.url, key, { global: { headers } });
  }
}
