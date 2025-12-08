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

  private readonly STORAGE_BUCKET = 'immagini_lavori';
  view: 'list' | 'detail' | 'new' = 'list';
  loading = signal(false);
  saving = false;

  ristrutturazioni = signal<any>([]);
  selectedRistrutturazione: any | null = null;
  newRistrutturazione = signal<any>({
    title: '',
    description: '',
    beforeFiles: [],
    afterFiles: [],
    beforePreviews: [],
    afterPreviews: []
  })

  constructor(private supabase: Supabase) {

  }

  ngOnInit() {
    this.loadRistrutturazioni();
  }

  getEmptyRistrutturazione(): WritableSignal<any> {
    return signal<any>({
      title: '',
      description: '',
      beforeImages: [],
      afterImages: []
    });
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
    const beforeImages = (data.immagini ?? []).filter((img: any) => img.stato.toLowerCase() === 'before');
    const afterImages = (data.immagini ?? []).filter((img: any) => img.stato.toLowerCase() === 'after');
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
    const { title, description, beforeFiles, afterFiles } = this.newRistrutturazione();

    // --- 1. CARICAMENTO DEI FILE NELLO STORAGE ---
    console.log('Fase 1: Caricamento immagini...');
    const uploadedBeforeUrls = await this.uploadFiles(beforeFiles, 'before_images');
    const uploadedAfterUrls = await this.uploadFiles(afterFiles, 'after_images');

    // --- 2. SALVATAGGIO DEI DATI PRINCIPALI ---
    console.log('Fase 2: Salvataggio ristrutturazione principale...');
    const { data: ristrutturazione, error: mainError } = await this.supabase
      .from('ristrutturazioni') // Nome della tua tabella principale
      .insert({ title, description })
      .select('id') // Ottieni l'ID della riga appena creata
      .single();

    if (mainError) throw mainError;
    if (!ristrutturazione) throw new Error('Impossibile ottenere l\'ID della nuova ristrutturazione.');

    const ristrutturazioneId = ristrutturazione.id;

    // --- 3. SALVATAGGIO DEGLI URL NELLA TABELLA CORRELATA ---
    console.log('Fase 3: Salvataggio URL delle immagini...');
    const allImageUrls = [
      ...uploadedBeforeUrls.map(url => ({ ristrutturazione_id: ristrutturazioneId, url: url, stato: 'before' })),
      ...uploadedAfterUrls.map(url => ({ ristrutturazione_id: ristrutturazioneId, url: url, stato: 'after' }))
    ];

    const { error: imageError } = await this.supabase
      .from('immagini') // Nome della tua tabella secondaria
      .insert(allImageUrls);

    if (imageError) throw imageError;

    console.log('Ristrutturazione creata con successo!');
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

  async onImageSelect(event: Event, stato: 'before' | 'after') {
    const input = event.target as HTMLInputElement;
    if (!input.files) return;

    const files = Array.from(input.files);

    // 1. Array temporaneo per tenere traccia dei nuovi file e delle nuove preview
    const newFiles: File[] = [];
    const newPreviews: string[] = [];

    // Itera attraverso i file
    for (const file of files) {
      newFiles.push(file);

      // Crea la Promessa per la lettura in Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });

      // Aggiungi la stringa Base64 all'array delle preview
      newPreviews.push(await base64Promise);
    }

    // 2. Aggiorna lo stato del Signal una sola volta (più performante)
    this.newRistrutturazione.update(r => {
      if (stato === 'before') {
        return {
          ...r,
          beforeFiles: [...(r.beforeFiles ?? []), ...newFiles],
          beforePreviews: [...(r.beforePreviews ?? []), ...newPreviews]
        };
      } else {
        return {
          ...r,
          afterFiles: [...(r.afterFiles ?? []), ...newFiles],
          afterPreviews: [...(r.afterPreviews ?? []), ...newPreviews]
        };
      }
    });

    // Reset input per consentire il caricamento dello stesso file
    input.value = '';
  }

  removeImage(index: number, tipo: 'before' | 'after') {
    if (this.view === 'new') {
      if (tipo === 'before') {
        this.newRistrutturazione.update(r => ({ ...r, beforeImages: r.beforeImages.filter((_: any, i: number) => i !== index) }));
      } else {
        this.newRistrutturazione.update(r => ({ ...r, afterImages: r.afterImages.filter((_: any, i: number) => i !== index) }));
      }
    } else if (this.selectedRistrutturazione) {
      if (tipo === 'after') {
        this.selectedRistrutturazione.beforeImages.splice(index, 1);
      } else {
        this.selectedRistrutturazione.afterImages.splice(index, 1);
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

  // Funzione helper per caricare i file su Supabase Storage
  private async uploadFiles(files: File[], folderName: string): Promise<string[]> {
    const urls: string[] = [];

    for (const file of files) {
      // 2. Genera il percorso unico del file
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${folderName}/${fileName}`;

      const { data, error } = await this.supabase.getClient().storage
        .from(this.STORAGE_BUCKET) // <-- Indica il bucket principale
        .upload(filePath, file);   // <-- Usa il percorso completo (inclusa la cartella)

      if (error) {
        throw error;
      }

      // 4. Ottieni l'URL pubblico (usando lo stesso bucket e il path completo)
      const publicUrl = this.supabase.getClient().storage
        .from(this.STORAGE_BUCKET)
        .getPublicUrl(data.path)
        .data.publicUrl;

      urls.push(publicUrl);
    }
    return urls;
  }

}
