import { Component, inject } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { FollowOn } from "../../components/follow-on/follow-on";
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';

interface Project {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  categories: string[]; // Es: ['Soggiorno', 'Marmo Vero']
}

@Component({
  selector: 'app-portfolio',
  standalone: true,
  templateUrl: './portfolio.html',
  styleUrl: './portfolio.scss',
  imports: [HeroBanner, FollowOn],
})
export default class Portfolio {
  
  route = inject(Router);
  projects: any[] = [];

  categories: string[] = ['SOGGIORNO', 'RINNOVO', 'MARMO VERO', 'CUCINA', 'ISOLAMENTO TERMICO', 'BAGNO'];
  
  // Categoria attualmente selezionata
  selectedCategory: string = 'MARMO VERO';

  constructor(private supabase: Supabase) { }

  async ngOnInit(): Promise<void> {
    // Query con join: recupera ristrutturazioni + immagini collegate
    const { data, error } = await this.supabase
      .from('ristrutturazioni')
      .select(`
        id,
        title,
        description,
        createdAt,
        immagini (
          id,
          url,
          ristrutturazione_id,
          created_at
        )
      `);

    if (error) {
      console.error('Supabase query error:', error);
      return;
    }

    // Trasforma i percorsi in URL pubblici
    this.projects = (data ?? []).map(ristrutturazione => ({
      ...ristrutturazione,
      immagini: (ristrutturazione.immagini ?? []),
      cover_img : ristrutturazione.immagini[0]?.url
    }));
  }

  // Metodo per filtrare i progetti
  filterProjects(category: string): void {
    this.selectedCategory = category;
    // In un'app reale, qui faresti una nuova query a Supabase
    // O filtreresti l'array 'projects' se li hai caricati tutti in memoria
  }

  // Questo getter restituirà i progetti filtrati per la visualizzazione
  get filteredProjects() {
    if (this.selectedCategory === '') {
      return this.projects;
    }
    return this.projects;
  }

  goToDetail(project: any): void {
    // Passa l'intero oggetto progetto nello state della navigazione
    this.route.navigate(['portfolio', project.id], { state: { project } });
  }

}
