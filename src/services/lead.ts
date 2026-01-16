import { inject, Injectable } from '@angular/core';
import { Supabase } from './supabase';
import { Lead, LeadInsert } from '../models/lead';

@Injectable({
  providedIn: 'root',
})
export class LeadService {
  private supabase = inject(Supabase);

  async saveContactLead(leadData: LeadInsert): Promise<Lead> {
    const { data, error } = await this.supabase
      .from('leads')
      .insert(leadData)
      .select()
      .single();

    if (error) {
      console.error('Errore salvataggio lead:', error);
      throw error;
    }

    return data;
  }

  async getLeads(): Promise<Lead[]> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Errore recupero leads:', error);
      throw error;
    }

    return data ?? [];
  }

  async getLeadById(id: number): Promise<Lead | null> {
    const { data, error } = await this.supabase
      .from('leads')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      console.error('Errore recupero lead:', error);
      throw error;
    }

    return data;
  }

  async markLeadAsRead(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('leads')
      .update({ read: true })
      .eq('id', id);

    if (error) {
      console.error('Errore aggiornamento lead:', error);
      throw error;
    }
  }
}
