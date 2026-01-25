import { Fornitore } from './fornitore';
import { Cantiere } from './cantiere';
import { DDTMateriale } from './ddt-materiale';

export type TipoDDT = 'carico' | 'scarico' | 'reso';

export interface DDT {
  id?: number;
  numero_ddt: string;
  data_ddt: string;
  tipo: TipoDDT;
  fornitore_id?: number;
  cantiere_id?: number;
  note?: string;
  importo_totale?: number;
  documento_url?: string;
  created_at?: string;
  updated_at?: string;

  // Relazioni (popolate con select)
  fornitore?: Fornitore;
  cantiere?: Cantiere;
  ddt_materiali?: DDTMateriale[];
}

export type DDTInsert = Omit<DDT, 'id' | 'created_at' | 'updated_at'>;
export type DDTUpdate = Partial<DDTInsert>;
