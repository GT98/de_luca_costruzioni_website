import { Component, OnInit, ViewEncapsulation, OnDestroy } from '@angular/core';
import Swiper from 'swiper';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

interface Certification {
  id: number;
  name: string;
  description: string;
  logo: string;
  standard: string;
}

@Component({
  selector: 'app-certifications',
  templateUrl: './certifications.html',
  styleUrls: ['./certifications.scss'],
  encapsulation: ViewEncapsulation.None
})
export class Certifications implements OnInit, OnDestroy {
  certifications: Certification[] = [
    {
      id: 1,
      name: 'ISO 9001:2015',
      description: 'Sistema di gestione per la qualità',
      logo: 'assets/certifications/iso-1.png',
      standard: '9001:2015'
    },
    {
      id: 2,
      name: 'ISO 14001:2015',
      description: 'Sistema di gestione ambientale',
      logo: 'assets/certifications/iso-2.png',
      standard: '14001:2015'
    },
    {
      id: 3,
      name: 'ISO 45001:2018',
      description: 'Sistema di gestione della salute e sicurezza',
      logo: 'assets/certifications/iso-3.png',
      standard: '45001:2018'
    },
    {
      id: 4,
      name: 'ISO 9001:2015',
      description: 'Sistema di gestione per la qualità',
      logo: 'assets/certifications/iso-1.png',
      standard: '9001:2015'
    },
    {
      id: 5,
      name: 'ISO 14001:2015',
      description: 'Sistema di gestione ambientale',
      logo: 'assets/certifications/iso-2.png',
      standard: '14001:2015'
    },
    {
      id: 6,
      name: 'ISO 45001:2018',
      description: 'Sistema di gestione della salute e sicurezza',
      logo: 'assets/certifications/iso-3.png',
      standard: '45001:2018'
    }
  ];

  private swiper?: Swiper;

  ngOnInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 100);
  }

  initSwiper(): void {
    this.swiper = new Swiper('.certifications-swiper', {
      modules: [Navigation, Pagination, Autoplay],
      slidesPerView: 1,
      spaceBetween: 30,
      loop: true,
      autoplay: {
        delay: 5000,
        disableOnInteraction: false,
      },
      pagination: {
        el: '.swiper-pagination',
        clickable: true,
      },
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 40,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 50,
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