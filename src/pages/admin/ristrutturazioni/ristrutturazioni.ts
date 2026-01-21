import { CommonModule } from '@angular/common';
import { Component, signal, WritableSignal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Supabase } from '../../../services/supabase';
import { Ristrutturazione } from '../../../models/ristrutturazione';
import { ImageData } from '../../../models/image-data';
import { NewRistrutturazioneImage } from '../../../models/new-ristrutturazione-image';

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
  saving = signal(false);
  // Drag & Drop state
  draggedIndex: number | null = null;
  draggedType: 'before' | 'after' | null = null;
  ristrutturazioni = signal<Ristrutturazione[]>([]);
  selectedRistrutturazione = signal<Ristrutturazione | null>(null);
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
          created_at,
          order_index
        )
      `).order('order_index', { foreignTable: 'immagini', ascending: true });

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
      id: data.id,
      title: data.title,
      description: data.description,
      createdAt: data.createdAt,
      beforeImages,
      afterImages,
      cover_img: this.getCoverImage(beforeImages, afterImages)?.url || null
    };
  }

  updateTitle(newTitle: string): void {
    const currentRistrutturazione = this.selectedRistrutturazione();

    // 1. Verifica che l'oggetto esista
    if (!currentRistrutturazione) {
      return; // O gestisci il caso in cui il Signal è undefined
    }

    const updatedRistrutturazione = {
      ...currentRistrutturazione,
      title: newTitle,
    };
    this.selectedRistrutturazione.set(updatedRistrutturazione);
  }

  updateDescription(newDescription: string): void {
    const currentRistrutturazione = this.selectedRistrutturazione();

    // 1. Verifica che l'oggetto esista
    if (!currentRistrutturazione) {
      return; // O gestisci il caso in cui il Signal è undefined
    }

    const updatedRistrutturazione = {
      ...currentRistrutturazione,
      description: newDescription,
    };
    this.selectedRistrutturazione.set(updatedRistrutturazione);
  }

  async createRistrutturazione() {
    this.saving.update(v => !v);
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

    alert('Ristrutturazione creata con successo!');
    this.saving.update(v => !v);
    this.backToList();
    this.loadRistrutturazioni();
  }

  async updateImageOnSupabaseTable() {
    const ristrutturazione = this.selectedRistrutturazione();
    if (!ristrutturazione) return;

    const beforeImages = ristrutturazione.beforeImages || [];
    const afterImages = ristrutturazione.afterImages || [];

    // 2. CREAZIONE DEL PAYLOAD: Combina gli array in un unico array piatto usando lo Spread Operator
    const rawPayload = [
      ...beforeImages,
      ...afterImages
    ];
    const { error } = await this.supabase
      .from('immagini')
      .upsert(rawPayload, {
        onConflict: 'id', // Usa la chiave primaria 'id' per identificare i record da aggiornare
      })
      .eq('id', this.selectedRistrutturazione()?.id);

    if (error) throw error;

  }

  async updateRistrutturazione() {
    if (!this.selectedRistrutturazione()?.id) return;

    this.saving.update(v => !v);
    try {

      this.updateImageOnSupabaseTable();

      const { error } = await this.supabase
        .from('ristrutturazioni')
        .update({
          title: this.selectedRistrutturazione()?.title,
          description: this.selectedRistrutturazione()?.description
        })
        .eq('id', this.selectedRistrutturazione()?.id);

      if (error) throw error;

      alert('Ristrutturazione aggiornata con successo!');
      this.backToList();
      this.loadRistrutturazioni();
    } catch (error) {
      console.error('Errore aggiornamento:', error);
      alert('Errore nell\'aggiornamento');
    } finally {
      this.saving.update(v => !v);
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

    const newFiles: File[] = [];
    // Array che conterrà gli oggetti { base64Url: string, order_index: number, isCoverImg: boolean }
    const newPreviewObjects: any[] = []; // Usa l'interfaccia se l'hai definita

    // Itera attraverso i file
    for (const file of files) {
      newFiles.push(file); // Aggiunge il file RAW all'array dei file

      // Crea Base64
      const reader = new FileReader();
      const base64Promise = new Promise<string>((resolve) => {
        reader.onload = (e) => {
          resolve(e.target?.result as string);
        };
        reader.readAsDataURL(file);
      });
      const base64Url = await base64Promise;

      // Crea l'oggetto Preview con i metadati da sincronizzare
      newPreviewObjects.push({
        url: base64Url,
        // order_index e isCoverImg verranno calcolati alla fine
        order_index: 0,
        isCoverImg: false,
      });
    }

    // 2. Aggiorna lo stato del Signal con i due array
    this.newRistrutturazione.update(r => {

      let existingPreviews: any[] = stato === 'before' ? (r.beforePreviews || []) : (r.afterPreviews || []);
      let targetFiles: File[] = stato === 'before' ? (r.beforeFiles || []) : (r.afterFiles || []);

      // 2a. Combina i nuovi e i vecchi array
      const combinedPreviews = [...existingPreviews, ...newPreviewObjects];
      const combinedFiles = [...targetFiles, ...newFiles];

      // 2b. RICALCOLA L'ORDINE (SOLO PER L'ARRAY PREVIEWS)
      combinedPreviews.forEach((obj, index) => {
        obj.order_index = index + 1;
        obj.isCoverImg = index === 0;
      });

      // 3. Aggiorna lo stato nel Signal (Manteniamo i due array separati, ma sincronizzati per posizione)
      if (stato === 'before') {
        return {
          ...r,
          beforeFiles: combinedFiles, // Array di File RAW
          beforePreviews: combinedPreviews // Array di Oggetti con metadati
        };
      } else {
        return {
          ...r,
          afterFiles: combinedFiles,
          afterPreviews: combinedPreviews
        };
      }
    });

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
        this.selectedRistrutturazione()?.beforeImages.splice(index, 1);
      } else {
        this.selectedRistrutturazione()?.afterImages.splice(index, 1);
      }
    }
  }

  backToList() {
    this.view = 'list';
    this.selectedRistrutturazione.set(null);
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

    if(!files || files.length === 0) {
      return urls; // Ritorna un array vuoto se non ci sono file da caricare
    }

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

  // Drag & Drop methods
  onDragStart(event: DragEvent, index: number, tipo: 'before' | 'after') {
    this.draggedIndex = index;
    this.draggedType = tipo;
    const target = event.target as HTMLElement;
    target.classList.add('dragging');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }
  onDragOver(event: DragEvent) {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDrop(event: DragEvent, dropIndex: number, tipo: 'before' | 'after') {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
    if (this.draggedIndex === null || this.draggedType !== tipo) return;

    // Riferimento all'oggetto principale
    const ristrutturazione = this.view === 'new'
      ? this.newRistrutturazione()
      : this.selectedRistrutturazione()!;

    // DICHIARAZIONE E INIZIALIZZAZIONE SICURA
    let arrayPreview: any[] | undefined = undefined;
    let arrayFiles: any[] | undefined = undefined;
    let arrayImages: any[] | undefined = undefined;
    let arrayPerMetadati: any; // Questa deve essere definita prima di essere usata

    // 1. Identifica gli array di lavoro e li assegna
    if (this.view === 'new') {
      arrayPreview = tipo === 'before' ? ristrutturazione.beforePreviews : ristrutturazione.afterPreviews;
      arrayFiles = tipo === 'before' ? ristrutturazione.beforeFiles : ristrutturazione.afterFiles;
      arrayPerMetadati = arrayPreview; // Assegna qui il riferimento per i metadati

    } else { // view === 'detail'
      arrayImages = tipo === 'before' ? ristrutturazione.beforeImages : ristrutturazione.afterImages;
      arrayPerMetadati = arrayImages; // Assegna qui il riferimento per i metadati
    }

    // Controlliamo che l'array su cui lavorare esista prima di procedere
    if (!arrayPerMetadati) return;

    // --- 2. Riordino ---
    if (this.view === 'new') {
      // Riordina l'array delle Previews (che contiene i metadati)
      const [removedPreview] = arrayPreview!.splice(this.draggedIndex, 1);
      arrayPreview!.splice(dropIndex, 0, removedPreview);

      // Riordina l'array dei Files RAW in modo IDENTICO
      const [removedFile] = arrayFiles!.splice(this.draggedIndex, 1);
      arrayFiles!.splice(dropIndex, 0, removedFile);

    } else { // view === 'detail'
      // Riordina l'array delle Immagini del DB
      const [removedImage] = arrayImages!.splice(this.draggedIndex, 1);
      arrayImages!.splice(dropIndex, 0, removedImage);
    }


    // --- 3. LOGICA CHIAVE PER COPERTINA E ORDINE ---
    // Usiamo 'arrayPerMetadati' che è stato assegnato in modo condizionale sopra
    arrayPerMetadati.forEach((item: any, index: number) => {
      item.order_index = index + 1;
      item.isCoverImg = index === 0;
    });

    // ----------------------------------------------------------------------


    // 4. Aggiorna il signal per riflettere il nuovo stato
    if (this.view === 'new') {
      // Aggiorna il Signal con i due array riordinati (Files e Previews)
      const updatedRistrutturazione = {
        ...ristrutturazione,
        ...(tipo === 'before' ? {
          beforePreviews: arrayPreview,
          beforeFiles: arrayFiles
        } : {}),
        ...(tipo === 'after' ? {
          afterPreviews: arrayPreview,
          afterFiles: arrayFiles
        } : {}),
      };
      this.newRistrutturazione.set(updatedRistrutturazione);

    } else if (this.view == 'detail') {
      // Aggiorna il Signal con il singolo array Images riordinato
      this.selectedRistrutturazione.set({ ...ristrutturazione });
    }
  }

  onDragEnd() {
    this.draggedIndex = null;
    this.draggedType = null;
    document.querySelectorAll('.dragging, .drag-over').forEach(el => {
      el.classList.remove('dragging', 'drag-over');
    });
  }
  getCoverImage(beforeImages: ImageData[], afterImages: ImageData[]): ImageData | null {
    if (!beforeImages || !afterImages) return null;
    if (afterImages.length > 0) {
      const coverAfter = afterImages.find((img: ImageData) => img.isCoverImg);
      if (coverAfter) return coverAfter;
    } else {
      if (beforeImages.length > 0) {
        const coverBefore = beforeImages.find(img => img.isCoverImg);
        if (coverBefore) return coverBefore;
      }
    };
    return null
  }
  openNewForm() {
    this.newRistrutturazione.set(this.getEmptyRistrutturazione());
    this.view = 'new';
  }
  viewDetail(ristrutturazione: Ristrutturazione) {
    this.selectedRistrutturazione.set({ ...ristrutturazione });
    this.view = 'detail';
  }

}
