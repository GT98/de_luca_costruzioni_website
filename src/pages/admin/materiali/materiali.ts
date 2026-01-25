import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DdtService } from '../../../services/ddt.service';
import { Materiale, MaterialeInsert } from '../../../models/materiale';
import { MaterialeModal } from '../../../components/modals/materiale-modal';

@Component({
  selector: 'app-materiali',
  imports: [CommonModule, MaterialeModal],
  templateUrl: './materiali.html',
  styleUrl: './materiali.scss',
})
export default class Materiali implements OnInit {
  private ddtService = inject(DdtService);

  materiali = signal<Materiale[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  isModalOpen = signal(false);
  selectedMateriale = signal<Materiale | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    await this.loadMateriali();
  }

  async loadMateriali(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.ddtService.getMateriali();
      this.materiali.set(data);
    } catch (err) {
      this.error.set('Errore nel caricamento dei materiali');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  openCreateModal(): void {
    this.selectedMateriale.set(undefined);
    this.isModalOpen.set(true);
  }

  openEditModal(materiale: Materiale): void {
    this.selectedMateriale.set(materiale);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedMateriale.set(undefined);
  }

  async saveMateriale(data: MaterialeInsert): Promise<void> {
    try {
      const selected = this.selectedMateriale();
      if (selected?.id) {
        await this.ddtService.updateMateriale(selected.id, data);
      } else {
        await this.ddtService.createMateriale(data);
      }

      this.closeModal();
      await this.loadMateriali();
    } catch (err) {
      console.error('Errore nel salvataggio del materiale:', err);
      alert('Errore nel salvataggio del materiale');
    }
  }

  async deleteMateriale(id: number): Promise<void> {
    if (confirm('Sei sicuro di voler eliminare questo materiale?')) {
      try {
        await this.ddtService.deleteMateriale(id);
        await this.loadMateriali();
      } catch (err) {
        console.error("Errore nell'eliminazione del materiale:", err);
        alert("Errore nell'eliminazione del materiale");
      }
    }
  }
}
