import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { FollowOn } from "../../components/follow-on/follow-on";
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { RistrutturazioniService } from '../../services/ristrutturazioni';

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

  goToDetail(project: any): void {
    // Passa l'intero oggetto progetto nello state della navigazione
    this.route.navigate(['portfolio', project.id], { state: { project } });
  }

}
