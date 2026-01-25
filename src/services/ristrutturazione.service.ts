import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';
import { Ristrutturazione } from '../models/ristrutturazione';
import { ImageData } from '../models/image-data';

export interface RistrutturazioneWithCover extends Ristrutturazione {
  cover_img?: string | null;
}

export interface ImageInsert {
  ristrutturazione_id: string;
  url: string;
  stato: 'before' | 'after';
  order_index: number;
  isCoverImg: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class RistrutturazioneService {
  private supabase = inject(Supabase);
  private readonly STORAGE_BUCKET = 'immagini_lavori';

  async getAll(): Promise<RistrutturazioneWithCover[]> {
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
      `)
      .order('order_index', { foreignTable: 'immagini', ascending: true });

    if (error) throw error;

    return (data ?? []).map((r) => this.organizeData(r));
  }

  async getById(id: string): Promise<RistrutturazioneWithCover | null> {
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
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    if (!data) return null;

    return this.organizeData(data);
  }

  async create(
    title: string,
    description: string,
    beforeFiles: File[],
    afterFiles: File[]
  ): Promise<string> {
    // 1. Upload files
    const uploadedBeforeUrls = await this.uploadFiles(beforeFiles, 'before_images');
    const uploadedAfterUrls = await this.uploadFiles(afterFiles, 'after_images');

    // 2. Create main record
    const { data: ristrutturazione, error: mainError } = await this.supabase
      .from('ristrutturazioni')
      .insert({ title, description })
      .select('id')
      .single();

    if (mainError) throw mainError;
    if (!ristrutturazione) throw new Error("Impossibile ottenere l'ID della nuova ristrutturazione.");

    const ristrutturazioneId = ristrutturazione.id;

    // 3. Save image URLs
    const allImageUrls: ImageInsert[] = [
      ...uploadedBeforeUrls.map((url, index) => ({
        ristrutturazione_id: ristrutturazioneId,
        url,
        stato: 'before' as const,
        order_index: index + 1,
        isCoverImg: index === 0,
      })),
      ...uploadedAfterUrls.map((url, index) => ({
        ristrutturazione_id: ristrutturazioneId,
        url,
        stato: 'after' as const,
        order_index: index + 1,
        isCoverImg: index === 0,
      })),
    ];

    if (allImageUrls.length > 0) {
      const { error: imageError } = await this.supabase.from('immagini').insert(allImageUrls);
      if (imageError) throw imageError;
    }

    return ristrutturazioneId;
  }

  async update(
    id: string,
    title: string,
    description: string,
    beforeImages: ImageData[],
    afterImages: ImageData[],
    newBeforeFiles: File[],
    newAfterFiles: File[]
  ): Promise<void> {
    // 1. Update existing images order/cover
    await this.updateImages([...beforeImages, ...afterImages]);

    // 2. Upload new files
    if (newBeforeFiles.length > 0 || newAfterFiles.length > 0) {
      const uploadedBeforeUrls = await this.uploadFiles(newBeforeFiles, 'before_images');
      const uploadedAfterUrls = await this.uploadFiles(newAfterFiles, 'after_images');

      const lastBeforeIndex = beforeImages.length;
      const lastAfterIndex = afterImages.length;

      const newImageRecords: ImageInsert[] = [
        ...uploadedBeforeUrls.map((url, index) => ({
          ristrutturazione_id: id,
          url,
          stato: 'before' as const,
          order_index: lastBeforeIndex + index + 1,
          isCoverImg: lastBeforeIndex === 0 && index === 0,
        })),
        ...uploadedAfterUrls.map((url, index) => ({
          ristrutturazione_id: id,
          url,
          stato: 'after' as const,
          order_index: lastAfterIndex + index + 1,
          isCoverImg: lastAfterIndex === 0 && index === 0,
        })),
      ];

      if (newImageRecords.length > 0) {
        const { error: imageError } = await this.supabase.from('immagini').insert(newImageRecords);
        if (imageError) throw imageError;
      }
    }

    // 3. Update main record
    const { error } = await this.supabase
      .from('ristrutturazioni')
      .update({ title, description })
      .eq('id', id);

    if (error) throw error;
  }

  async delete(id: string): Promise<void> {
    const { error } = await this.supabase.from('ristrutturazioni').delete().eq('id', id);
    if (error) throw error;
  }

  async deleteImage(image: ImageData): Promise<void> {
    if (image.url) {
      await this.deleteImageFromStorage(image.url);
    }
    if (image.id) {
      const { error } = await this.supabase.from('immagini').delete().eq('id', image.id);
      if (error) throw error;
    }
  }

  async uploadFiles(files: File[], folderName: string): Promise<string[]> {
    const urls: string[] = [];

    if (!files || files.length === 0) {
      return urls;
    }

    for (const file of files) {
      const fileName = `${Date.now()}_${file.name}`;
      const filePath = `${folderName}/${fileName}`;

      const { data, error } = await this.supabase
        .getClient()
        .storage.from(this.STORAGE_BUCKET)
        .upload(filePath, file);

      if (error) throw error;

      const publicUrl = this.supabase
        .getClient()
        .storage.from(this.STORAGE_BUCKET)
        .getPublicUrl(data.path).data.publicUrl;

      urls.push(publicUrl);
    }

    return urls;
  }

  private async updateImages(images: ImageData[]): Promise<void> {
    if (images.length === 0) return;

    const { error } = await this.supabase.from('immagini').upsert(images, {
      onConflict: 'id',
    });

    if (error) throw error;
  }

  private async deleteImageFromStorage(imageUrl: string): Promise<void> {
    try {
      const url = new URL(imageUrl);
      const pathParts = url.pathname.split('/storage/v1/object/public/');
      if (pathParts.length < 2) return;

      const fullPath = pathParts[1];
      const bucketAndPath = fullPath.split('/');
      const filePath = bucketAndPath.slice(1).join('/');

      const { error } = await this.supabase
        .getClient()
        .storage.from(this.STORAGE_BUCKET)
        .remove([filePath]);

      if (error) {
        console.error('Errore eliminazione file dallo storage:', error);
      }
    } catch (error) {
      console.error('Errore parsing URL immagine:', error);
    }
  }

  private organizeData(data: any): RistrutturazioneWithCover {
    if (!data) return data;

    const beforeImages = (data.immagini ?? []).filter(
      (img: any) => img.stato.toLowerCase() === 'before'
    );
    const afterImages = (data.immagini ?? []).filter(
      (img: any) => img.stato.toLowerCase() === 'after'
    );

    return {
      id: data.id,
      title: data.title,
      description: data.description,
      created_at: data.createdAt,
      beforeImages,
      afterImages,
      cover_img: this.getCoverImageUrl(beforeImages, afterImages),
    };
  }

  private getCoverImageUrl(beforeImages: ImageData[], afterImages: ImageData[]): string | null {
    if (afterImages.length > 0) {
      const coverAfter = afterImages.find((img) => img.isCoverImg);
      if (coverAfter) return coverAfter.url;
    }
    if (beforeImages.length > 0) {
      const coverBefore = beforeImages.find((img) => img.isCoverImg);
      if (coverBefore) return coverBefore.url;
    }
    return null;
  }
}
