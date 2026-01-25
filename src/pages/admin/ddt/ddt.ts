import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DdtService } from '../../../services/ddt.service';
import { DDT } from '../../../models/ddt';
import { DdtModal, DdtSaveData } from '../../../components/modals/ddt-modal';

@Component({
  selector: 'app-ddt',
  imports: [CommonModule, DdtModal],
  templateUrl: './ddt.html',
  styleUrl: './ddt.scss',
})
export default class Ddt implements OnInit {
  private ddtService = inject(DdtService);

  ddtList = signal<DDT[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  isModalOpen = signal(false);
  selectedDdt = signal<DDT | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    await this.loadDdts();
  }

  async loadDdts(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.ddtService.getDdts();
      this.ddtList.set(data);
    } catch (err) {
      this.error.set('Errore nel caricamento dei DDT');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  openCreateModal(): void {
    this.selectedDdt.set(undefined);
    this.isModalOpen.set(true);
  }

  openEditModal(ddt: DDT): void {
    this.selectedDdt.set(ddt);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedDdt.set(undefined);
  }

  async saveDdt(data: DdtSaveData): Promise<void> {
    try {
      const selected = this.selectedDdt();
      if (selected?.id) {
        await this.ddtService.updateDdt(selected.id, data.ddt);
      } else {
        await this.ddtService.createDdt(data.ddt, data.materiali);
      }

      this.closeModal();
      await this.loadDdts();
    } catch (err) {
      console.error('Errore nel salvataggio del DDT:', err);
      alert('Errore nel salvataggio del DDT');
    }
  }

  async deleteDdt(id: number): Promise<void> {
    if (confirm('Sei sicuro di voler eliminare questo DDT?')) {
      try {
        await this.ddtService.deleteDdt(id);
        await this.loadDdts();
      } catch (err) {
        console.error("Errore nell'eliminazione del DDT:", err);
        alert("Errore nell'eliminazione del DDT");
      }
    }
  }

  downloadDocumento(url: string): void {
    window.open(url, '_blank');
  }

  getTipoBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'carico':
        return 'badge-success';
      case 'scarico':
        return 'badge-warning';
      case 'reso':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'carico':
        return 'Carico';
      case 'scarico':
        return 'Scarico';
      case 'reso':
        return 'Reso';
      default:
        return tipo;
    }
  }
}
