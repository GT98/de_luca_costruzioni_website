import { Injectable, inject } from '@angular/core';
import { Supabase } from './supabase';
import { DDT, DDTInsert, DDTUpdate } from '../models/ddt';
import { DDTMateriale, DDTMaterialeInsert } from '../models/ddt-materiale';
import { Fornitore, FornitoreInsert, FornitoreUpdate } from '../models/fornitore';
import { Cantiere, CantiereInsert, CantiereUpdate } from '../models/cantiere';
import { Materiale, MaterialeInsert, MaterialeUpdate } from '../models/materiale';
import { VariazionePrezzo, StoricoPrezziInsert } from '../models/storico-prezzi';

@Injectable({
  providedIn: 'root'
})
export class DdtService {
  private supabase = inject(Supabase);

  // ==================== FORNITORI ====================
  async getFornitori(): Promise<Fornitore[]> {
    const { data, error } = await this.supabase
      .from('fornitori')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async createFornitore(fornitore: FornitoreInsert): Promise<Fornitore> {
    const { data, error } = await this.supabase
      .from('fornitori')
      .insert(fornitore)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateFornitore(id: number, fornitore: FornitoreUpdate): Promise<Fornitore> {
    const { data, error } = await this.supabase
      .from('fornitori')
      .update(fornitore)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteFornitore(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('fornitori')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ==================== CANTIERI ====================
  async getCantieri(): Promise<Cantiere[]> {
    const { data, error } = await this.supabase
      .from('cantieri')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data ?? [];
  }

  async getCantiereById(id: number): Promise<Cantiere | null> {
    const { data, error } = await this.supabase
      .from('cantieri')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') { // No rows found
        return null;
      }
      throw error;
    }
    return data;
  }

  async createCantiere(cantiere: CantiereInsert): Promise<Cantiere> {
    const { data, error } = await this.supabase
      .from('cantieri')
      .insert(cantiere)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateCantiere(id: number, cantiere: CantiereUpdate): Promise<Cantiere> {
    const { data, error } = await this.supabase
      .from('cantieri')
      .update(cantiere)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteCantiere(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('cantieri')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ==================== MATERIALI ====================
  async getMateriali(): Promise<Materiale[]> {
    const { data, error } = await this.supabase
      .from('materiali')
      .select('*')
      .order('nome', { ascending: true });

    if (error) throw error;
    return data ?? [];
  }

  async getMateriale(id: number): Promise<Materiale> {
    const { data, error } = await this.supabase
      .from('materiali')
      .select('*')
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createMateriale(materiale: MaterialeInsert): Promise<Materiale> {
    const { data, error } = await this.supabase
      .from('materiali')
      .insert(materiale)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async updateMateriale(id: number, materiale: MaterialeUpdate): Promise<Materiale> {
    const { data, error } = await this.supabase
      .from('materiali')
      .update(materiale)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteMateriale(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('materiali')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ==================== DDT ====================
  async getDdts(filters?: { fornitore_id?: number; cantiere_id?: number; data_da?: string; data_a?: string }): Promise<DDT[]> {
    let query = this.supabase
      .from('ddt')
      .select(`
        *,
        fornitore:fornitori(*),
        cantiere:cantieri(*),
        ddt_materiali(
          *,
          materiale:materiali(*)
        )
      `)
      .order('data_ddt', { ascending: false });

    if (filters?.fornitore_id) {
      query = query.eq('fornitore_id', filters.fornitore_id);
    }
    if (filters?.cantiere_id) {
      query = query.eq('cantiere_id', filters.cantiere_id);
    }
    if (filters?.data_da) {
      query = query.gte('data_ddt', filters.data_da);
    }
    if (filters?.data_a) {
      query = query.lte('data_ddt', filters.data_a);
    }

    const { data, error } = await query;

    if (error) throw error;
    return data ?? [];
  }

  async getDdtById(id: number): Promise<DDT> {
    const { data, error } = await this.supabase
      .from('ddt')
      .select(`
        *,
        fornitore:fornitori(*),
        cantiere:cantieri(*),
        ddt_materiali(
          *,
          materiale:materiali(*)
        )
      `)
      .eq('id', id)
      .single();

    if (error) throw error;
    return data;
  }

  async createDdt(ddt: DDTInsert, materiali: DDTMaterialeInsert[]): Promise<DDT> {
    // 1. Crea il DDT principale
    const { data: newDdt, error: ddtError } = await this.supabase
      .from('ddt')
      .insert(ddt)
      .select()
      .single();

    if (ddtError) throw ddtError;

    // 2. Inserisci i materiali del DDT
    const materialiWithDdtId = materiali.map(m => ({
      ...m,
      ddt_id: newDdt.id
    }));

    const { error: materialiError } = await this.supabase
      .from('ddt_materiali')
      .insert(materialiWithDdtId);

    if (materialiError) throw materialiError;

    // 3. Aggiorna lo storico prezzi per ogni materiale se presente prezzo_unitario
    for (const materiale of materiali) {
      if (materiale.prezzo_unitario && ddt.fornitore_id) {
        await this.aggiornaStoricoPrezzi(
          materiale.materiale_id,
          ddt.fornitore_id,
          materiale.prezzo_unitario,
          ddt.data_ddt
        );
      }
    }

    return this.getDdtById(newDdt.id);
  }

  async updateDdt(id: number, ddt: DDTUpdate): Promise<DDT> {
    const { data, error } = await this.supabase
      .from('ddt')
      .update(ddt)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  }

  async deleteDdt(id: number): Promise<void> {
    const { error } = await this.supabase
      .from('ddt')
      .delete()
      .eq('id', id);

    if (error) throw error;
  }

  // ==================== STORICO PREZZI & ANALYTICS ====================

  /**
   * Aggiorna lo storico prezzi per un materiale/fornitore
   */
  private async aggiornaStoricoPrezzi(
    materiale_id: number,
    fornitore_id: number,
    prezzo_unitario: number,
    data_validita_inizio: string
  ): Promise<void> {
    const storicoprezzo: StoricoPrezziInsert = {
      materiale_id,
      fornitore_id,
      prezzo_unitario,
      data_validita_inizio
    };

    const { error } = await this.supabase
      .from('storico_prezzi')
      .insert(storicoprezzo);

    if (error) throw error;
  }

  /**
   * Rileva variazioni di prezzo rispetto all'ultimo acquisto
   */
  async detectVariazioniPrezzi(fornitore_id: number, materiali: DDTMaterialeInsert[]): Promise<VariazionePrezzo[]> {
    const variazioni: VariazionePrezzo[] = [];

    for (const materiale of materiali) {
      if (!materiale.prezzo_unitario) continue;

      // Recupera l'ultimo prezzo registrato per questo materiale/fornitore
      const { data: ultimoPrezzo, error } = await this.supabase
        .from('storico_prezzi')
        .select(`
          prezzo_unitario,
          data_validita_inizio,
          materiale:materiali(nome),
          fornitore:fornitori(nome)
        `)
        .eq('materiale_id', materiale.materiale_id)
        .eq('fornitore_id', fornitore_id)
        .order('data_validita_inizio', { ascending: false })
        .limit(1)
        .maybeSingle();

      if (error) throw error;

      // Se esiste un prezzo precedente e è diverso da quello attuale
      if (ultimoPrezzo && ultimoPrezzo.prezzo_unitario !== materiale.prezzo_unitario) {
        const variazione_percentuale = ((materiale.prezzo_unitario - ultimoPrezzo.prezzo_unitario) / ultimoPrezzo.prezzo_unitario) * 100;

        variazioni.push({
          materiale_id: materiale.materiale_id,
          materiale_nome: (ultimoPrezzo.materiale as any).nome,
          fornitore_id: fornitore_id,
          fornitore_nome: (ultimoPrezzo.fornitore as any).nome,
          prezzo_precedente: ultimoPrezzo.prezzo_unitario,
          prezzo_nuovo: materiale.prezzo_unitario,
          variazione_percentuale: Number(variazione_percentuale.toFixed(2)),
          data_validita_inizio: ultimoPrezzo.data_validita_inizio
        });
      }
    }

    return variazioni;
  }

  /**
   * Ottieni statistiche fornitori (totale speso, numero ordini, etc.)
   */
  async getStatisticheFornitore(fornitore_id: number, anno?: number): Promise<{
    totale_speso: number;
    numero_ddt: number;
    materiali_acquistati: { materiale: string; quantita_totale: number; spesa_totale: number }[];
  }> {
    let query = this.supabase
      .from('ddt')
      .select('*, ddt_materiali(*, materiale:materiali(nome))')
      .eq('fornitore_id', fornitore_id);

    if (anno) {
      query = query.gte('data_ddt', `${anno}-01-01`).lte('data_ddt', `${anno}-12-31`);
    }

    const { data, error } = await query;

    if (error) throw error;

    const totale_speso = data?.reduce((sum, ddt) => sum + (ddt.importo_totale ?? 0), 0) ?? 0;
    const numero_ddt = data?.length ?? 0;

    // Aggrega materiali
    const materialiMap = new Map<string, { quantita: number; spesa: number }>();

    data?.forEach(ddt => {
      ddt.ddt_materiali?.forEach((dm: any) => {
        const nome = dm.materiale.nome;
        const existing = materialiMap.get(nome) || { quantita: 0, spesa: 0 };
        materialiMap.set(nome, {
          quantita: existing.quantita + dm.quantita,
          spesa: existing.spesa + (dm.subtotale ?? 0)
        });
      });
    });

    const materiali_acquistati = Array.from(materialiMap.entries()).map(([nome, stats]) => ({
      materiale: nome,
      quantita_totale: stats.quantita,
      spesa_totale: stats.spesa
    }));

    return {
      totale_speso,
      numero_ddt,
      materiali_acquistati
    };
  }

  /**
   * Ottieni report consumo materiali per cantiere
   */
  async getConsumoMaterialiCantiere(cantiere_id: number): Promise<{
    materiale: string;
    quantita_totale: number;
    spesa_totale: number;
    unita_misura: string;
  }[]> {
    const { data, error } = await this.supabase
      .from('ddt')
      .select('ddt_materiali(*, materiale:materiali(*))')
      .eq('cantiere_id', cantiere_id);

    if (error) throw error;

    const materialiMap = new Map<number, { nome: string; quantita: number; spesa: number; unita: string }>();

    data?.forEach(ddt => {
      ddt.ddt_materiali?.forEach((dm: any) => {
        const existing = materialiMap.get(dm.materiale_id) || {
          nome: dm.materiale.nome,
          quantita: 0,
          spesa: 0,
          unita: dm.materiale.unita_misura
        };
        materialiMap.set(dm.materiale_id, {
          ...existing,
          quantita: existing.quantita + dm.quantita,
          spesa: existing.spesa + (dm.subtotale ?? 0)
        });
      });
    });

    return Array.from(materialiMap.values()).map(m => ({
      materiale: m.nome,
      quantita_totale: m.quantita,
      spesa_totale: m.spesa,
      unita_misura: m.unita
    }));
  }

  /**
   * Ottieni spesa mensile per fornitori
   */
  async getSpesaMensilePerFornitore(anno: number): Promise<{
    fornitore: string;
    mesi: { mese: number; totale: number }[];
  }[]> {
    const { data, error } = await this.supabase
      .from('ddt')
      .select('data_ddt, importo_totale, fornitore:fornitori(nome)')
      .gte('data_ddt', `${anno}-01-01`)
      .lte('data_ddt', `${anno}-12-31`);

    if (error) throw error;

    const fornitoriMap = new Map<string, Map<number, number>>();

    data?.forEach((ddt: any) => {
      const fornitoreNome = ddt.fornitore.nome;
      const mese = new Date(ddt.data_ddt).getMonth() + 1;
      const totale = ddt.importo_totale ?? 0;

      if (!fornitoriMap.has(fornitoreNome)) {
        fornitoriMap.set(fornitoreNome, new Map());
      }

      const mesiMap = fornitoriMap.get(fornitoreNome)!;
      mesiMap.set(mese, (mesiMap.get(mese) ?? 0) + totale);
    });

    return Array.from(fornitoriMap.entries()).map(([fornitore, mesiMap]) => ({
      fornitore,
      mesi: Array.from(mesiMap.entries()).map(([mese, totale]) => ({ mese, totale }))
    }));
  }
}
