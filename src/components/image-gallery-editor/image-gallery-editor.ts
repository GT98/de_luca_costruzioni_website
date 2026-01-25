import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageData } from '../../models/image-data';

export interface ImagePreview {
  url: string;
  order_index: number;
  isCoverImg: boolean;
  isNew?: boolean;
}

@Component({
  selector: 'app-image-gallery-editor',
  imports: [CommonModule],
  templateUrl: './image-gallery-editor.html',
  styleUrl: './image-gallery-editor.scss',
})
export class ImageGalleryEditor {
  @Input() label = 'Immagini';
  @Input() images: ImageData[] = [];
  @Input() newPreviews: ImagePreview[] = [];
  @Input() uploadButtonText = 'Carica Immagini';

  @Output() onFilesSelected = new EventEmitter<File[]>();
  @Output() onRemoveImage = new EventEmitter<{ index: number; isNew: boolean }>();
  @Output() onReorder = new EventEmitter<{ images: ImageData[]; previews: ImagePreview[] }>();

  private draggedIndex: number | null = null;
  private isDraggingNew = false;

  get allItems(): (ImageData | ImagePreview)[] {
    const existingWithFlag = this.images.map((img) => ({ ...img, isNew: false }));
    const newWithFlag = this.newPreviews.map((p) => ({ ...p, isNew: true }));
    return [...existingWithFlag, ...newWithFlag];
  }

  onFileInputChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files || input.files.length === 0) return;

    const files = Array.from(input.files);
    this.onFilesSelected.emit(files);
    input.value = '';
  }

  removeImage(index: number): void {
    const isNew = index >= this.images.length;
    const actualIndex = isNew ? index - this.images.length : index;
    this.onRemoveImage.emit({ index: actualIndex, isNew });
  }

  onDragStart(event: DragEvent, index: number): void {
    this.draggedIndex = index;
    this.isDraggingNew = index >= this.images.length;
    const target = event.target as HTMLElement;
    target.classList.add('dragging');
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
  }

  onDragOver(event: DragEvent): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.add('drag-over');
    if (event.dataTransfer) {
      event.dataTransfer.dropEffect = 'move';
    }
  }

  onDragLeave(event: DragEvent): void {
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');
  }

  onDrop(event: DragEvent, dropIndex: number): void {
    event.preventDefault();
    const target = event.currentTarget as HTMLElement;
    target.classList.remove('drag-over');

    if (this.draggedIndex === null || this.draggedIndex === dropIndex) return;

    // Only allow reordering within same category (existing or new)
    const isDropNew = dropIndex >= this.images.length;
    if (this.isDraggingNew !== isDropNew) return;

    if (this.isDraggingNew) {
      // Reorder new previews
      const actualDragIndex = this.draggedIndex - this.images.length;
      const actualDropIndex = dropIndex - this.images.length;
      const newPreviews = [...this.newPreviews];
      const [removed] = newPreviews.splice(actualDragIndex, 1);
      newPreviews.splice(actualDropIndex, 0, removed);
      this.recalculateOrder(newPreviews);
      this.onReorder.emit({ images: this.images, previews: newPreviews });
    } else {
      // Reorder existing images
      const images = [...this.images];
      const [removed] = images.splice(this.draggedIndex, 1);
      images.splice(dropIndex, 0, removed);
      this.recalculateOrder(images);
      this.onReorder.emit({ images, previews: this.newPreviews });
    }
  }

  onDragEnd(): void {
    this.draggedIndex = null;
    this.isDraggingNew = false;
    document.querySelectorAll('.dragging, .drag-over').forEach((el) => {
      el.classList.remove('dragging', 'drag-over');
    });
  }

  private recalculateOrder(items: (ImageData | ImagePreview)[]): void {
    items.forEach((item, index) => {
      item.order_index = index + 1;
      item.isCoverImg = index === 0;
    });
  }

  isFirstItem(index: number): boolean {
    return index === 0;
  }

  isNewItem(index: number): boolean {
    return index >= this.images.length;
  }

  canDrag(index: number): boolean {
    // Can only drag within existing images (not new previews for now)
    return index < this.images.length;
  }
}
