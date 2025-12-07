import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../../services/supabase';

@Component({
  selector: 'app-ristrutturazioni',
  imports: [CommonModule, FormsModule],
  templateUrl: './ristrutturazioni.html',
  styleUrl: './ristrutturazioni.scss',
})
export default class Ristrutturazioni {

  view: 'list' | 'detail' | 'new' = 'list';
  loading = signal(false);
  saving = false;

  ristrutturazioni = signal<any>([]);
  selectedRistrutturazione: any | null = null;
  newRistrutturazione: any = this.getEmptyRistrutturazione();

  constructor(private supabase: Supabase) {

  }

  ngOnInit() {
    this.loadRistrutturazioni();
  }

  getEmptyRistrutturazione(): any {
    return {
      titolo: '',
      descrizione: '',
      indirizzo: '',
      data_inizio: '',
      data_fine: '',
      stato: 'in_attesa',
      costo: 0,
      immagini_prima: [],
      immagini_dopo: []
    };
  }

  async loadRistrutturazioni() {
    this.loading.set(true);
    try {

      const { data, error } = await this.supabase
        .from('ristrutturazioni')
        .select(`
        id,
        title,
        description,
        createdAt,
        immagini (
          id,
          url,
          ristrutturazione_id,
          isCoverImg,
          stato,
          created_at
        )
      `);

      if (error) throw error;

      this.ristrutturazioni.set((data ?? []).map(ristrutturazione => this.organizeData(ristrutturazione)));

    } catch (error) {
      console.error('Errore caricamento ristrutturazioni:', error);
      alert('Errore nel caricamento dei dati');
    } finally {
      this.loading.set(false);
    }
  }

  organizeData(data: any): any {
    if (!data) return data;
    const beforeImages = (data.immagini ?? []).filter((img: any) => img.stato.toLowerCase() === 'prima');
    const afterImages = (data.immagini ?? []).filter((img: any) => img.stato.toLowerCase() === 'dopo');
    return {
      ...data,
      immagini: {
        beforeImages,
        afterImages
      },
      cover_img: data.immagini.find((img: any) => img.isCoverImg)?.url || null
    };
  }

  async createRistrutturazione() {
    this.saving = true;
    try {
      const { error } = await this.supabase
        .from('ristrutturazioni')
        .update(this.selectedRistrutturazione)
        .eq('id', this.selectedRistrutturazione?.id);

      if (error) throw error;

      alert('Ristrutturazione aggiornata con successo!');
      this.backToList();
      this.loadRistrutturazioni();
    } catch (error) {
      console.error('Errore aggiornamento:', error);
      alert('Errore nell\'aggiornamento');
    } finally {
      this.saving = false;
    }
  }

  async updateRistrutturazione() {
    if (!this.selectedRistrutturazione?.id) return;

    this.saving = true;
    try {
      const { error } = await this.supabase
        .from('ristrutturazioni')
        .update(this.selectedRistrutturazione)
        .eq('id', this.selectedRistrutturazione.id);

      if (error) throw error;

      alert('Ristrutturazione aggiornata con successo!');
      this.backToList();
      this.loadRistrutturazioni();
    } catch (error) {
      console.error('Errore aggiornamento:', error);
      alert('Errore nell\'aggiornamento');
    } finally {
      this.saving = false;
    }
  }

  async deleteRistrutturazione(ristrutturazione: any) {
    if (!ristrutturazione.id) return;

    if (!confirm(`Sei sicuro di voler eliminare "${ristrutturazione.titolo}"?`)) {
      return;
    }

    try {
      const { error } = await this.supabase
        .from('ristrutturazioni')
        .delete()
        .eq('id', ristrutturazione.id);

      if (error) throw error;

      alert('Ristrutturazione eliminata con successo!');
      this.loadRistrutturazioni();
    } catch (error) {
      console.error('Errore eliminazione:', error);
      alert('Errore nell\'eliminazione');
    }
  }

  async onImageSelect(event: Event, tipo: 'prima' | 'dopo') {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    for (const file of files) {
      // Converti l'immagine in base64 per preview
      const reader = new FileReader();
      reader.onload = (e) => {
        const base64 = e.target?.result as string;

        if (this.view === 'new') {
          if (tipo === 'prima') {
            this.newRistrutturazione.immagini_prima.push(base64);
          } else {
            this.newRistrutturazione.immagini_dopo.push(base64);
          }
        } else if (this.selectedRistrutturazione) {
          if (tipo === 'prima') {
            this.selectedRistrutturazione.immagini_prima.push(base64);
          } else {
            this.selectedRistrutturazione.immagini_dopo.push(base64);
          }
        }
      };
      reader.readAsDataURL(file);

      // IMPORTANTE: Per un'implementazione completa, dovresti caricare 
      // le immagini su Supabase Storage e salvare gli URL invece di base64
      // Esempio:
      // const { data, error } = await this.supabase.storage
      //   .from('ristrutturazioni-images')
      //   .upload(`${Date.now()}-${file.name}`, file);
    }

    // Reset input
    input.value = '';
  }

  removeImage(index: number, tipo: 'prima' | 'dopo') {
    if (this.view === 'new') {
      if (tipo === 'prima') {
        this.newRistrutturazione.immagini_prima.splice(index, 1);
      } else {
        this.newRistrutturazione.immagini_dopo.splice(index, 1);
      }
    } else if (this.selectedRistrutturazione) {
      if (tipo === 'prima') {
        this.selectedRistrutturazione.immagini_prima.splice(index, 1);
      } else {
        this.selectedRistrutturazione.immagini_dopo.splice(index, 1);
      }
    }
  }

  openNewForm() {
    this.newRistrutturazione = this.getEmptyRistrutturazione();
    this.view = 'new';
  }

  viewDetail(ristrutturazione: any) {
    this.selectedRistrutturazione = { ...ristrutturazione };
    this.view = 'detail';
  }

  backToList() {
    this.view = 'list';
    this.selectedRistrutturazione = null;
    this.newRistrutturazione = this.getEmptyRistrutturazione();
  }

  getStatoLabel(stato: string): string {
    const labels: { [key: string]: string } = {
      'in_attesa': 'In Attesa',
      'in_corso': 'In Corso',
      'completata': 'Completata'
    };
    return labels[stato] || stato;
  }
}
