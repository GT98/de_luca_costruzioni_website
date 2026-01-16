import { Component, OnInit, inject, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../../services/supabase';
import { Router } from '@angular/router';
import { Lead, LeadType, LeadStatus } from '../../../models/lead';
import { Paginator } from '../../../components/paginator/paginator';

@Component({
  selector: 'admin-lead-list',
  standalone: true,
  imports: [CommonModule, FormsModule, Paginator],
  templateUrl: './lead-list.html',
  styleUrl: './lead-list.scss',
})
export default class LeadList implements OnInit {
  private supabase = inject(Supabase);
  private router = inject(Router);

  loading = signal(false);
  allLeads = signal<Lead[]>([]);
  selectedLead: Lead | null = null;

  // Filtri
  searchTerm = signal('');
  filterType = signal<LeadType | 'all'>('all');
  filterStatus = signal<LeadStatus | 'all'>('all');
  filterRead = signal<'all' | 'read' | 'unread'>('all');

  // Paginazione
  currentPage = signal(1);
  itemsPerPage = 10;

  // Computed per lead filtrati
  filteredLeads = computed(() => {
    let leads = this.allLeads();

    // Filtro per tipo
    if (this.filterType() !== 'all') {
      leads = leads.filter(l => l.lead_type === this.filterType());
    }

    // Filtro per stato
    if (this.filterStatus() !== 'all') {
      leads = leads.filter(l => l.lead_status === this.filterStatus());
    }

    // Filtro per lettura
    if (this.filterRead() === 'read') {
      leads = leads.filter(l => l.read === true);
    } else if (this.filterRead() === 'unread') {
      leads = leads.filter(l => l.read === false);
    }

    // Filtro per ricerca
    const search = this.searchTerm().toLowerCase();
    if (search) {
      leads = leads.filter(l => {
        const company = l.lead_type === 'supplier' ? (l as any).company : '';
        return (
          l.name?.toLowerCase().includes(search) ||
          l.surname?.toLowerCase().includes(search) ||
          l.email?.toLowerCase().includes(search) ||
          l.mobile?.includes(search) ||
          company?.toLowerCase().includes(search)
        );
      });
    }

    return leads;
  });

  // Lead paginati
  paginatedLeads = computed(() => {
    const start = (this.currentPage() - 1) * this.itemsPerPage;
    const end = start + this.itemsPerPage;
    return this.filteredLeads().slice(start, end);
  });

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
      this.allLeads.set(data || []);
    } catch (error) {
      console.error('Errore caricamento leads:', error);
      alert('Errore nel caricamento dei lead');
    } finally {
      this.loading.set(false);
    }
  }

  onPageChange(page: number) {
    this.currentPage.set(page);
  }

  clearFilters() {
    this.searchTerm.set('');
    this.filterType.set('all');
    this.filterStatus.set('all');
    this.filterRead.set('all');
    this.currentPage.set(1);
  }

  truncateMessage(message: string, maxLength: number = 150): string {
    if (!message || message.length <= maxLength) return message;
    return message.substring(0, maxLength) + '...';
  }

  getUnreadCount(): number {
    return this.allLeads().filter((l: Lead) => !l.read).length;
  }

  getLeadTypeLabel(type: LeadType): string {
    const labels: Record<LeadType, string> = {
      contact: 'Contatto',
      supplier: 'Fornitore',
      free_estimate: 'Preventivo'
    };
    return labels[type];
  }

  getLeadStatusLabel(status: LeadStatus | null | undefined): string {
    if (!status) return 'Nuovo';
    const labels: Record<LeadStatus, string> = {
      nuovo: 'Nuovo',
      contattato_qualifica: 'Contattato',
      sopralluogo_fissato: 'Sopralluogo',
      preventivo_in_bozza: 'Preventivo',
      in_negoziazione: 'Negoziazione',
      chiuso_vinto: 'Vinto',
      chiuso_perso: 'Perso',
      non_interessato: 'Non interessato'
    };
    return labels[status];
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
