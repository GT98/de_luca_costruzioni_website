import { Component, inject, signal } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { FollowOn } from "../../components/follow-on/follow-on";
import { Supabase } from '../../services/supabase';
import { Router } from '@angular/router';
import { RistrutturazioniService } from '../../services/ristrutturazioni';
import { JsonPipe } from '@angular/common';

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
  ristrutturazioniService = inject(RistrutturazioniService);
  ristrutturazioni = this.ristrutturazioniService.ristrutturazioni;

  categories = this.ristrutturazioniService.categories;

  // Categoria attualmente selezionata (tutte)
  selectedCategory: number | null = 0;


  async ngOnInit(): Promise<void> {
    this.ristrutturazioniService.getCategories();
    this.ristrutturazioniService.getRistrutturazioni();
  }

  // Metodo per filtrare i progetti
  filterProjects(categoryId: number): void {
    this.selectedCategory = categoryId;
    this.ristrutturazioniService.getRistrutturazioni(categoryId === 0 ? 0 : categoryId);
  }

  // Questo getter restituirà i progetti filtrati per la visualizzazione
  get filteredProjects() {
    if (this.selectedCategory === 0) {
      return this.ristrutturazioni;
    }
    return this.ristrutturazioni;
  }

  goToDetail(project: any): void {
    // Passa l'intero oggetto progetto nello state della navigazione
    this.route.navigate(['portfolio', project.id], { state: { project } });
  }

}
