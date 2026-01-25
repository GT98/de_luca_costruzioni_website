import {
  Component,
  EventEmitter,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Ristrutturazione } from '../../models/ristrutturazione';
import { ImageData } from '../../models/image-data';
import { ImageGalleryEditor, ImagePreview } from '../image-gallery-editor/image-gallery-editor';
import { RistrutturazioneService } from '../../services/ristrutturazione.service';

export interface RistrutturazioneFormData {
  title: string;
  description: string;
  beforeImages: ImageData[];
  afterImages: ImageData[];
  beforeFiles: File[];
  afterFiles: File[];
}

@Component({
  selector: 'app-ristrutturazione-modal',
  imports: [CommonModule, FormsModule, ImageGalleryEditor],
  templateUrl: './ristrutturazione-modal.html',
  styleUrl: './ristrutturazione-modal.scss',
})
export class RistrutturazioneModal implements OnChanges {
  @Input() ristrutturazione?: Ristrutturazione;
  @Input() isOpen = false;
  @Output() onClose = new EventEmitter<void>();
  @Output() onSave = new EventEmitter<RistrutturazioneFormData>();
  @Output() onImageDeleted = new EventEmitter<ImageData>();

  private ristrutturazioneService = inject(RistrutturazioneService);

  title = '';
  description = '';
  saving = signal(false);

  beforeImages = signal<ImageData[]>([]);
  afterImages = signal<ImageData[]>([]);
  beforePreviews = signal<ImagePreview[]>([]);
  afterPreviews = signal<ImagePreview[]>([]);
  beforeFiles = signal<File[]>([]);
  afterFiles = signal<File[]>([]);

  get isEditMode(): boolean {
    return !!this.ristrutturazione?.id;
  }

  get modalTitle(): string {
    return this.isEditMode ? 'Modifica Ristrutturazione' : 'Nuova Ristrutturazione';
  }

  get saveButtonText(): string {
    if (this.saving()) {
      return this.isEditMode ? 'Salvataggio...' : 'Creazione...';
    }
    return this.isEditMode ? 'Salva Modifiche' : 'Crea Ristrutturazione';
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['isOpen'] && changes['isOpen'].currentValue === true) {
      this.resetForm();
      if (this.ristrutturazione) {
        this.title = this.ristrutturazione.title;
        this.description = this.ristrutturazione.description;
        this.beforeImages.set([...(this.ristrutturazione.beforeImages || [])]);
        this.afterImages.set([...(this.ristrutturazione.afterImages || [])]);
      }
    }
  }

  resetForm(): void {
    this.title = '';
    this.description = '';
    this.beforeImages.set([]);
    this.afterImages.set([]);
    this.beforePreviews.set([]);
    this.afterPreviews.set([]);
    this.beforeFiles.set([]);
    this.afterFiles.set([]);
  }

  close(): void {
    this.onClose.emit();
  }

  async save(): Promise<void> {
    if (!this.title.trim() || !this.description.trim()) {
      alert('Compila tutti i campi obbligatori');
      return;
    }

    this.saving.set(true);

    try {
      this.onSave.emit({
        title: this.title,
        description: this.description,
        beforeImages: this.beforeImages(),
        afterImages: this.afterImages(),
        beforeFiles: this.beforeFiles(),
        afterFiles: this.afterFiles(),
      });
    } finally {
      this.saving.set(false);
    }
  }

  async onBeforeFilesSelected(files: File[]): Promise<void> {
    const newPreviews = await this.createPreviews(files);
    const updatedPreviews = [...this.beforePreviews(), ...newPreviews];
    this.recalculatePreviewOrder(updatedPreviews);
    this.beforePreviews.set(updatedPreviews);
    this.beforeFiles.set([...this.beforeFiles(), ...files]);
  }

  async onAfterFilesSelected(files: File[]): Promise<void> {
    const newPreviews = await this.createPreviews(files);
    const updatedPreviews = [...this.afterPreviews(), ...newPreviews];
    this.recalculatePreviewOrder(updatedPreviews);
    this.afterPreviews.set(updatedPreviews);
    this.afterFiles.set([...this.afterFiles(), ...files]);
  }

  async onRemoveBeforeImage(event: { index: number; isNew: boolean }): Promise<void> {
    if (event.isNew) {
      this.beforePreviews.set(this.beforePreviews().filter((_, i) => i !== event.index));
      this.beforeFiles.set(this.beforeFiles().filter((_, i) => i !== event.index));
    } else {
      const imageToRemove = this.beforeImages()[event.index];
      if (imageToRemove) {
        this.onImageDeleted.emit(imageToRemove);
        const updatedImages = this.beforeImages().filter((_, i) => i !== event.index);
        this.recalculateImageOrder(updatedImages);
        this.beforeImages.set(updatedImages);
      }
    }
  }

  async onRemoveAfterImage(event: { index: number; isNew: boolean }): Promise<void> {
    if (event.isNew) {
      this.afterPreviews.set(this.afterPreviews().filter((_, i) => i !== event.index));
      this.afterFiles.set(this.afterFiles().filter((_, i) => i !== event.index));
    } else {
      const imageToRemove = this.afterImages()[event.index];
      if (imageToRemove) {
        this.onImageDeleted.emit(imageToRemove);
        const updatedImages = this.afterImages().filter((_, i) => i !== event.index);
        this.recalculateImageOrder(updatedImages);
        this.afterImages.set(updatedImages);
      }
    }
  }

  onReorderBeforeImages(event: { images: ImageData[]; previews: ImagePreview[] }): void {
    this.beforeImages.set(event.images);
    this.beforePreviews.set(event.previews);
  }

  onReorderAfterImages(event: { images: ImageData[]; previews: ImagePreview[] }): void {
    this.afterImages.set(event.images);
    this.afterPreviews.set(event.previews);
  }

  private async createPreviews(files: File[]): Promise<ImagePreview[]> {
    const previews: ImagePreview[] = [];

    for (const file of files) {
      const base64Url = await this.fileToBase64(file);
      previews.push({
        url: base64Url,
        order_index: 0,
        isCoverImg: false,
        isNew: true,
      });
    }

    return previews;
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        resolve(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    });
  }

  private recalculatePreviewOrder(previews: ImagePreview[]): void {
    previews.forEach((preview, index) => {
      preview.order_index = index + 1;
      preview.isCoverImg = index === 0;
    });
  }

  private recalculateImageOrder(images: ImageData[]): void {
    images.forEach((img, index) => {
      img.order_index = index + 1;
      img.isCoverImg = index === 0;
    });
  }
}
