import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Supabase } from '../../../services/supabase';
import { Router } from '@angular/router';

interface Lead {
  id: string;
  name?: string;
  surname?: string;
  email?: string;
  address?: string;
  message?: string;
  mobile?: string;
  created_at?: string;
  read?: boolean; // Flag per marcare come letto
}

@Component({
  selector: 'admin-lead-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.scss',
})
export default class LeadList implements OnInit {
  private supabase = inject(Supabase);
  private router = inject(Router);

  loading = signal(false);
  leads = signal<Lead[]>([]);
  selectedLead: Lead | null = null;

  ngOnInit() {
    this.loadLeads();
  }

  async loadLeads() {
    this.loading.set(true);
    try {
      const { data, error } = await this.supabase
        .from('leads')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      this.leads.set(data || []);
    } catch (error) {
      console.error('Errore caricamento leads:', error);
      alert('Errore nel caricamento dei lead');
    } finally {
      this.loading.set(false);
    }
  }

  truncateMessage(message: string, maxLength: number = 150): string {
    if (!message || message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  }

  getUnreadCount(): number {
    return this.leads().filter(l => !l.read).length;
  }

  viewLead(lead: Lead) {
    this.openLeadDetail(lead, new Event('click'));
  }

  async openLeadDetail(lead: Lead, event: Event) {
    event.stopPropagation();
    this.selectedLead = lead;

    // Marca come letto
    if (!lead.read) {
      await this.toggleRead(lead, event, true);
    }
  }

  closeModal() {
    this.selectedLead = null;
  }

  async toggleRead(lead: Lead, event: Event, forceRead = false) {
    event.stopPropagation();

    try {
      const newReadStatus = forceRead ? true : !lead.read;

      const { error } = await this.supabase
        .from('leads')
        .update({ read: newReadStatus })
        .eq('id', lead.id);

      if (error) throw error;

      await this.loadLeads();

      if (this.selectedLead && this.selectedLead.id === lead.id) {
        this.selectedLead.read = newReadStatus;
      }
    } catch (error) {
      console.error('Errore aggiornamento stato:', error);
      alert('Errore nell\'aggiornamento');
    }
  }

  async deleteLead(lead: Lead, event?: Event) {
    if (event) event.stopPropagation();

    if (!confirm(`Sei sicuro di voler eliminare questo lead?`)) {
      return;
    }

    try {
      const { error } = await this.supabase
        .from('leads')
        .delete()
        .eq('id', lead.id);

      if (error) throw error;

      this.closeModal();
      await this.loadLeads();
      alert('Lead eliminato con successo');
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('Errore nell\'eliminazione');
    }
  }
}
