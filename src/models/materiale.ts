export type UnitaMisura = 'pz' | 'kg' | 'mt' | 'mq' | 'mc' | 'lt';

export interface Materiale {
  id?: number;
  nome: string;
  codice?: string;
  descrizione?: string;
  unita_misura: UnitaMisura;
  prezzo_unitario?: number;
  quantita_giacenza?: number;
  soglia_minima?: number;
  fornitore_id?: number;
  categoria?: string;
  note?: string;
  is_attivo: boolean;
  created_at?: string;
  updated_at?: string;
}

export type MaterialeInsert = Omit<Materiale, 'id' | 'created_at' | 'updated_at'>;
export type MaterialeUpdate = Partial<MaterialeInsert>;
