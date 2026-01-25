import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DdtService } from '../../../services/ddt.service';
import { Fornitore, FornitoreInsert } from '../../../models/fornitore';
import { FornitoreModal } from '../../../components/modals/fornitore-modal';

@Component({
  selector: 'app-fornitori',
  imports: [CommonModule, FornitoreModal],
  templateUrl: './fornitori.html',
  styleUrl: './fornitori.scss',
})
export default class Fornitori implements OnInit {
  private ddtService = inject(DdtService);

  fornitori = signal<Fornitore[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  isModalOpen = signal(false);
  selectedFornitore = signal<Fornitore | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    await this.loadFornitori();
  }

  async loadFornitori(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.ddtService.getFornitori();
      this.fornitori.set(data);
    } catch (err) {
      this.error.set('Errore nel caricamento dei fornitori');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  openCreateModal(): void {
    this.selectedFornitore.set(undefined);
    this.isModalOpen.set(true);
  }

  openEditModal(fornitore: Fornitore): void {
    this.selectedFornitore.set(fornitore);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedFornitore.set(undefined);
  }

  async saveFornitore(data: FornitoreInsert): Promise<void> {
    try {
      const selected = this.selectedFornitore();
      if (selected?.id) {
        await this.ddtService.updateFornitore(selected.id, data);
      } else {
        await this.ddtService.createFornitore(data);
      }

      this.closeModal();
      await this.loadFornitori();
    } catch (err) {
      console.error('Errore nel salvataggio del fornitore:', err);
      alert('Errore nel salvataggio del fornitore');
    }
  }

  async deleteFornitore(id: number): Promise<void> {
    if (confirm('Sei sicuro di voler eliminare questo fornitore?')) {
      try {
        await this.ddtService.deleteFornitore(id);
        await this.loadFornitori();
      } catch (err) {
        console.error("Errore nell'eliminazione del fornitore:", err);
        alert("Errore nell'eliminazione del fornitore");
      }
    }
  }
}
