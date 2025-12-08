import { inject, Injectable, signal } from '@angular/core';
import { Supabase } from './supabase';

@Injectable({
  providedIn: 'root',
})
export class AdminService {

  supabase = inject(Supabase);
  ristrutturazioni = signal<any[]>([]);

  async getRistrutturazioniAdmin() {

    const { data, error } = await this.supabase.from('ristrutturazioni')
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

    this.ristrutturazioni.set((data ?? []));

  }

}
