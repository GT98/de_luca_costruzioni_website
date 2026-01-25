export interface Fornitore {
  id?: number;
  nome: string;
  ragione_sociale?: string;
  partita_iva?: string;
  codice_fiscale?: string;
  email?: string;
  telefono?: string;
  indirizzo?: string;
  citta?: string;
  cap?: string;
  provincia?: string;
  pec?: string;
  note?: string;
  categoria_principale?: string;
  is_attivo: boolean;
  created_at?: string;
  updated_at?: string;
}

export type FornitoreInsert = Omit<Fornitore, 'id' | 'created_at' | 'updated_at'>;
export type FornitoreUpdate = Partial<FornitoreInsert>;
