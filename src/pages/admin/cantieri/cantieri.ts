import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DdtService } from '../../../services/ddt.service';
import { Cantiere } from '../../../models/cantiere';

@Component({
  selector: 'app-cantieri',
  imports: [CommonModule],
  templateUrl: './cantieri.html',
  styleUrl: './cantieri.scss',
})
export default class Cantieri implements OnInit {
  private ddtService = inject(DdtService);
  private router = inject(Router);

  cantieri = signal<Cantiere[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadCantieri();
  }

  async loadCantieri(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.ddtService.getCantieri();
      this.cantieri.set(data);
    } catch (err) {
      this.error.set('Errore nel caricamento dei cantieri');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  async navigateToCreate(): Promise<void> {
    await this.router.navigate(['/admin/cantieri/create']);
  }

  async navigateToEdit(cantiere: Cantiere): Promise<void> {
    if (cantiere.id) {
      await this.router.navigate(['/admin/cantieri/edit', cantiere.id]);
    }
  }

  async deleteCantiere(id: number): Promise<void> {
    if (confirm('Sei sicuro di voler eliminare questo cantiere?')) {
      try {
        await this.ddtService.deleteCantiere(id);
        await this.loadCantieri();
      } catch (err) {
        console.error("Errore nell'eliminazione del cantiere:", err);
        alert("Errore nell'eliminazione del cantiere");
      }
    }
  }

  getStatoBadgeClass(stato: string): string {
    switch (stato) {
      case 'in_corso':
        return 'badge-primary';
      case 'completato':
        return 'badge-success';
      case 'sospeso':
        return 'badge-warning';
      case 'annullato':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getStatoLabel(stato: string): string {
    switch (stato) {
      case 'pianificato':
        return 'Pianificato';
      case 'in_corso':
        return 'In Corso';
      case 'sospeso':
        return 'Sospeso';
      case 'completato':
        return 'Completato';
      case 'annullato':
        return 'Annullato';
      default:
        return stato;
    }
  }
}
