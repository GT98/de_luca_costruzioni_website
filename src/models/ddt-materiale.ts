import { Materiale } from './materiale';

export interface DDTMateriale {
  id?: number;
  ddt_id: number;
  materiale_id: number;
  quantita: number;
  prezzo_unitario?: number;
  subtotale?: number;
  note?: string;
  created_at?: string;

  // Relazione (popolata con select)
  materiale?: Materiale;
}

export type DDTMaterialeInsert = Omit<DDTMateriale, 'id' | 'created_at' | 'subtotale'>;
export type DDTMaterialeUpdate = Partial<DDTMaterialeInsert>;
