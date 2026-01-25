import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DdtService } from '../../../services/ddt.service';
import { Cantiere, CantiereInsert } from '../../../models/cantiere';
import { CantiereModal } from '../../../components/modals/cantiere-modal';

@Component({
  selector: 'app-cantieri',
  imports: [CommonModule, CantiereModal],
  templateUrl: './cantieri.html',
  styleUrl: './cantieri.scss',
})
export default class Cantieri implements OnInit {
  private ddtService = inject(DdtService);

  cantieri = signal<Cantiere[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  isModalOpen = signal(false);
  selectedCantiere = signal<Cantiere | undefined>(undefined);

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

  openCreateModal(): void {
    this.selectedCantiere.set(undefined);
    this.isModalOpen.set(true);
  }

  openEditModal(cantiere: Cantiere): void {
    this.selectedCantiere.set(cantiere);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedCantiere.set(undefined);
  }

  async saveCantiere(data: CantiereInsert): Promise<void> {
    try {
      const selected = this.selectedCantiere();
      if (selected?.id) {
        await this.ddtService.updateCantiere(selected.id, data);
      } else {
        await this.ddtService.createCantiere(data);
      }

      this.closeModal();
      await this.loadCantieri();
    } catch (err) {
      console.error('Errore nel salvataggio del cantiere:', err);
      alert('Errore nel salvataggio del cantiere');
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
