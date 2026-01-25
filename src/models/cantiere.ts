export type StatoCantiere = 'pianificato' | 'in_corso' | 'sospeso' | 'completato' | 'annullato';

export interface Cantiere {
  id?: number;
  nome: string;
  ristrutturazione_id?: string;
  indirizzo: string;
  citta: string;
  cap?: string;
  provincia?: string;
  cliente_nome?: string;
  cliente_cognome?: string;
  cliente_telefono?: string;
  cliente_email?: string;
  data_inizio?: string;
  data_fine_prevista?: string;
  data_fine_effettiva?: string;
  stato: StatoCantiere;
  budget?: number;
  costo_effettivo?: number;
  note?: string;
  is_attivo: boolean;
  created_at?: string;
  updated_at?: string;
}

export type CantiereInsert = Omit<Cantiere, 'id' | 'created_at' | 'updated_at'>;
export type CantiereUpdate = Partial<CantiereInsert>;
