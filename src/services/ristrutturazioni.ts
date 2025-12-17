import { inject, Injectable, signal } from '@angular/core';
import { Supabase } from './supabase';
import { ImageData } from '../models/image-data';

@Injectable({
  providedIn: 'root',
})
export class RistrutturazioniService {

  supabase = inject(Supabase);
  categories = signal<any[]>([]);
  ristrutturazioni = signal<any[]>([]);

  async getCategories() {

    const { data, error } = await this.supabase.from('categoria')
      .select(`
        id,
        name
      `);

    if (error) throw error;

    //aggiungo una categoria "Tutti" con id 0
    data?.unshift({ id: 0, name: 'Tutte' });
    this.categories.set((data ?? []));
  }

  async getRistrutturazioni(categoryId: number = 0) {

    // 1. Definisci la tua query iniziale con la selezione e l'ordinamento
    let query = this.supabase.from('ristrutturazioni')
      .select(`
    id,
    title,
    description,
    createdAt,
    categoria_id (
      id,
      name
    ),
    immagini (
      id,
      url,
      ristrutturazione_id,
      isCoverImg,
      stato,
      created_at
    )
  `)
      .order('createdAt', { ascending: false });

    if (categoryId && categoryId !== 0) {
      query = query.not('categoria_id', 'is', null);
      query = query.filter('categoria_id.id', 'eq', categoryId);
    }

    const { data, error } = await query;

    if (error) throw error;

    this.ristrutturazioni.set((data ?? []).map(item => this.organizeData(item)));

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
      cover_img: this.getCoverImage(beforeImages, afterImages)?.url
    };
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

}
