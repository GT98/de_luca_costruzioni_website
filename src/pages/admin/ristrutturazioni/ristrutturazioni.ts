import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  RistrutturazioneService,
  RistrutturazioneWithCover,
} from '../../../services/ristrutturazione.service';
import { Ristrutturazione } from '../../../models/ristrutturazione';
import { ImageData } from '../../../models/image-data';
import { RistrutturazioneList } from '../../../components/ristrutturazione-list/ristrutturazione-list';
import {
  RistrutturazioneModal,
  RistrutturazioneFormData,
} from '../../../components/modals/ristrutturazione-modal';

@Component({
  selector: 'app-ristrutturazioni',
  imports: [CommonModule, RistrutturazioneList, RistrutturazioneModal],
  templateUrl: './ristrutturazioni.html',
  styleUrl: './ristrutturazioni.scss',
})
export default class Ristrutturazioni implements OnInit {
  private ristrutturazioneService = inject(RistrutturazioneService);

  ristrutturazioni = signal<RistrutturazioneWithCover[]>([]);
  loading = signal(false);

  isModalOpen = signal(false);
  selectedRistrutturazione = signal<Ristrutturazione | undefined>(undefined);

  async ngOnInit(): Promise<void> {
    await this.loadRistrutturazioni();
  }

  async loadRistrutturazioni(): Promise<void> {
    this.loading.set(true);
    try {
      const data = await this.ristrutturazioneService.getAll();
      this.ristrutturazioni.set(data);
    } catch (error) {
      console.error('Errore caricamento ristrutturazioni:', error);
      alert('Errore nel caricamento dei dati');
    } finally {
      this.loading.set(false);
    }
  }

  openCreateModal(): void {
    this.selectedRistrutturazione.set(undefined);
    this.isModalOpen.set(true);
  }

  openEditModal(ristrutturazione: RistrutturazioneWithCover): void {
    this.selectedRistrutturazione.set(ristrutturazione);
    this.isModalOpen.set(true);
  }

  closeModal(): void {
    this.isModalOpen.set(false);
    this.selectedRistrutturazione.set(undefined);
  }

  async saveRistrutturazione(data: RistrutturazioneFormData): Promise<void> {
    try {
      const selected = this.selectedRistrutturazione();

      if (selected?.id) {
        await this.ristrutturazioneService.update(
          selected.id,
          data.title,
          data.description,
          data.beforeImages,
          data.afterImages,
          data.beforeFiles,
          data.afterFiles
        );
        alert('Ristrutturazione aggiornata con successo!');
      } else {
        await this.ristrutturazioneService.create(
          data.title,
          data.description,
          data.beforeFiles,
          data.afterFiles
        );
        alert('Ristrutturazione creata con successo!');
      }

      this.closeModal();
      await this.loadRistrutturazioni();
    } catch (error) {
      console.error('Errore nel salvataggio:', error);
      alert('Errore nel salvataggio della ristrutturazione');
    }
  }

  async deleteRistrutturazione(ristrutturazione: RistrutturazioneWithCover): Promise<void> {
    if (!ristrutturazione.id) return;

    if (!confirm(`Sei sicuro di voler eliminare "${ristrutturazione.title}"?`)) {
      return;
    }

    try {
      await this.ristrutturazioneService.delete(ristrutturazione.id);
      alert('Ristrutturazione eliminata con successo!');
      await this.loadRistrutturazioni();
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert("Errore nell'eliminazione");
    }
  }

  async onImageDeleted(image: ImageData): Promise<void> {
    try {
      await this.ristrutturazioneService.deleteImage(image);
    } catch (error) {
      console.error('Errore eliminazione immagine:', error);
    }
  }
}
