import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { RouterModule } from "@angular/router";
import { AdminService } from '../../../services/admin';
import { LeadService } from '../../../services/lead';
import { DdtService } from '../../../services/ddt.service';
import { CommonModule } from '@angular/common';
import { Lead } from '../../../models/lead';
import { DDT } from '../../../models/ddt';
import { Fornitore } from '../../../models/fornitore';

@Component({
  selector: 'app-dashboard',
  imports: [RouterModule, CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export default class Dashboard implements OnInit {

  adminService = inject(AdminService);
  leadService = inject(LeadService);
  ddtService = inject(DdtService);
  
  ristrutturazioni = this.adminService.ristrutturazioni;
  
  // Signals per dashboard data
  leads = signal<Lead[]>([]);
  ddts = signal<DDT[]>([]);
  fornitori = signal<Fornitore[]>([]);
  loading = signal<boolean>(false);

  // Computed values per statistiche
  leadStats = computed(() => {
    const allLeads = this.leads();
    return {
      totale: allLeads.length,
      nonLetti: allLeads.filter(l => !l.read).length,
      contatti: allLeads.filter(l => l.lead_type === 'contact').length,
      fornitori: allLeads.filter(l => l.lead_type === 'supplier').length,
      preventivi: allLeads.filter(l => l.lead_type === 'free_estimate').length
    };
  });

  ddtStats = computed(() => {
    const allDdts = this.ddts();
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    
    const thisMonth = allDdts.filter(ddt => {
      const ddtDate = new Date(ddt.data_ddt);
      return ddtDate.getMonth() === currentMonth && ddtDate.getFullYear() === currentYear;
    });
    
    return {
      totale: allDdts.length,
      questoMese: thisMonth.length,
      totaleSpeso: allDdts.reduce((sum, ddt) => sum + (ddt.importo_totale || 0), 0),
      spesoQuestoMese: thisMonth.reduce((sum, ddt) => sum + (ddt.importo_totale || 0), 0)
    };
  });

  fornitoriStats = computed(() => {
    const allFornitori = this.fornitori();
    const allDdts = this.ddts();
    
    // Calcola spesa per fornitore
    const spesaPerFornitore = allFornitori.map(fornitore => {
      const ddtsFornitore = allDdts.filter(ddt => ddt.fornitore_id === fornitore.id);
      const totaleSpeso = ddtsFornitore.reduce((sum, ddt) => sum + (ddt.importo_totale || 0), 0);
      
      return {
        nome: fornitore.nome,
        totaleSpeso,
        numeroDdt: ddtsFornitore.length
      };
    }).sort((a, b) => b.totaleSpeso - a.totaleSpeso);

    return {
      totale: allFornitori.length,
      topFornitori: spesaPerFornitore.slice(0, 5)
    };
  });

  async ngOnInit(): Promise<void> {
    this.loading.set(true);
    try {
      await Promise.all([
        this.loadRistrutturazioni(),
        this.loadLeads(),
        this.loadDdts(),
        this.loadFornitori()
      ]);
    } catch (error) {
      console.error('Errore caricamento dashboard:', error);
    } finally {
      this.loading.set(false);
    }
  }

  async loadRistrutturazioni(): Promise<void> {
    try {
      await this.adminService.getRistrutturazioniAdmin();
    } catch (error) {
      console.error('Errore caricamento ristrutturazioni:', error);
    }
  }

  async loadLeads(): Promise<void> {
    try {
      const leads = await this.leadService.getLeads();
      this.leads.set(leads);
    } catch (error) {
      console.error('Errore caricamento leads:', error);
    }
  }

  async loadDdts(): Promise<void> {
    try {
      const ddts = await this.ddtService.getDdts();
      this.ddts.set(ddts);
    } catch (error) {
      console.error('Errore caricamento DDT:', error);
    }
  }

  async loadFornitori(): Promise<void> {
    try {
      const fornitori = await this.ddtService.getFornitori();
      this.fornitori.set(fornitori);
    } catch (error) {
      console.error('Errore caricamento fornitori:', error);
    }
  }

  formatCurrency(value: number): string {
    return new Intl.NumberFormat('it-IT', {
      style: 'currency',
      currency: 'EUR'
    }).format(value);
  }

}
