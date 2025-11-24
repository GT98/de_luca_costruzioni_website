import { Component, OnInit, OnDestroy, ViewEncapsulation } from '@angular/core';
import { CommonModule } from '@angular/common';
import Swiper from 'swiper';
import { Pagination } from 'swiper/modules';

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
  imports: [CommonModule],
  templateUrl: './portfolio-list.html',
  styleUrls: ['./portfolio-list.scss'],
  encapsulation: ViewEncapsulation.None
})
export class PortfolioList implements OnInit, OnDestroy {
  private swiper?: Swiper;
  
  projects: Project[] = [
    {
      id: 1,
      title: 'Villa Moderna',
      location: 'MILANO',
      image: 'assets/images/lavori/carlo_de_marco.jpeg',
      description: 'Ristrutturazione completa villa con piscina'
    },
    {
      id: 2,
      title: 'Residenza Luxury',
      location: 'ROMA',
      image: 'assets/images/lavori/soggiorno_mock.png',
      description: 'Design interni e esterni di alto livello'
    },
    {
      id: 3,
      title: 'Casa Contemporanea',
      location: 'FIRENZE',
      image: 'assets/images/lavori/carlo_de_marco.jpeg',
      description: 'Progetto architettonico minimalista'
    },
    {
      id: 4,
      title: 'Appartamento Centro',
      location: 'TORINO',
      image: 'assets/images/lavori/soggiorno_mock.png',
      description: 'Restyling completo appartamento di lusso'
    }
  ];

  ngOnInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 100);
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
      },
    });
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}