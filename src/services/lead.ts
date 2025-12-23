import { inject, Injectable, signal } from '@angular/core';
import { Supabase } from './supabase';
import { ImageData } from '../models/image-data';

@Injectable({
  providedIn: 'root',
})
export class LeadService {

  supabase = inject(Supabase);

  async saveContactLead(contactForm: any) {

    const { data, error } = await this.supabase.from('leads')
    .insert(contactForm)

    if (error) throw error;

    return data;
  };

}
