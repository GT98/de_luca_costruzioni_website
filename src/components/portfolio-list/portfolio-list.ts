import { Component, OnInit, OnDestroy, ViewEncapsulation, input, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';
import { RouterLink } from "@angular/router";
import { Ristrutturazione } from '../../models/ristrutturazione';
import { RistrutturazioniService } from '../../services/ristrutturazioni';

interface Project {
  id: number;
  title: string;
  location: string;
  image: string;
  description?: string;
}

@Component({
  selector: 'app-portfolio-list',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './portfolio-list.html',
  styleUrls: ['./portfolio-list.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioList implements OnInit, OnDestroy {
  ristrutturazioniService = inject(RistrutturazioniService);
  private swiper?: Swiper;
  showSectionLabel = input<boolean>(true);
  showDescriptions = input<boolean>(false);
  ristrutturazioni = this.ristrutturazioniService.ristrutturazioni;

  ngOnInit(): void {
    this.ristrutturazioniService.getRistrutturazioni();
    setTimeout(() => {
      this.initSwiper();
    }, 200);
  }

  initSwiper(): void {
    this.swiper = new Swiper('.portfolio-swiper', {
      modules: [Pagination],
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: false,
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
        dynamicBullets: false,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1440: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}