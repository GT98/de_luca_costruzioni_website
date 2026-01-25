import { Fornitore } from './fornitore';
import { Materiale } from './materiale';

export interface StoricoPrezzi {
  id?: number;
  materiale_id: number;
  prezzo_unitario: number;
  data_validita_inizio: string;
  data_validita_fine?: string;
  fornitore_id?: number;
  note?: string;
  created_at?: string;

  // Relazioni (popolate con select)
  materiale?: Materiale;
  fornitore?: Fornitore;
}

export type StoricoPrezziInsert = Omit<StoricoPrezzi, 'id' | 'created_at'>;

export interface VariazionePrezzo {
  materiale_id: number;
  materiale_nome: string;
  fornitore_id: number;
  fornitore_nome: string;
  prezzo_precedente: number;
  prezzo_nuovo: number;
  variazione_percentuale: number;
  data_validita_inizio: string;
}
