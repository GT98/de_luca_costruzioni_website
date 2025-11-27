import { CommonModule } from '@angular/common';
import { Component, CUSTOM_ELEMENTS_SCHEMA, OnInit, ViewEncapsulation } from '@angular/core';
import Swiper from 'swiper';
import { Autoplay, Pagination } from 'swiper/modules';

interface Review {
  id: number;
  author: string;
  date: string;
  rating: number;
  text: string;
  avatar?: string;
  initials: string;
}

@Component({
  selector: 'app-google-reviews',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './google-reviews.html',
  styleUrls: ['./google-reviews.scss'],
  encapsulation: ViewEncapsulation.None
})
export class GoogleReviews implements OnInit {
  totalReviews = 38;
  averageRating = 5.0;

  reviews: Review[] = [
    {
      id: 1,
      author: 'Daniele Pingue',
      date: '6 Agosto 2025',
      rating: 5,
      text: 'Professionalità e disponibilità sono gli aggettivi per definire al meglio questa esperienza. Eccellenti in tutto, soprattutto nel rispetto dei tempi previsti che non è mai semplice in fase ...',
      initials: 'D'
    },
    {
      id: 2,
      author: 'Marco Rossi',
      date: '15 Luglio 2025',
      rating: 5,
      text: 'Servizio impeccabile, personale competente e sempre disponibile. Hanno superato le mie aspettative in ogni aspetto del progetto.',
      initials: 'M'
    },
    {
      id: 3,
      author: 'Laura Bianchi',
      date: '3 Luglio 2025',
      rating: 5,
      text: 'Esperienza fantastica! Consiglio vivamente questa azienda a chiunque cerchi professionalità e qualità nel servizio.',
      initials: 'L'
    },
    {
      id: 4,
      author: 'Giuseppe Verdi',
      date: '20 Giugno 2025',
      rating: 5,
      text: 'Collaborazione eccellente dall\'inizio alla fine. Sono rimasto molto soddisfatto del risultato finale e della comunicazione costante.',
      initials: 'G'
    },
    {
      id: 5,
      author: 'Giuseppe Verdi',
      date: '20 Giugno 2025',
      rating: 5,
      text: 'Collaborazione eccellente dall\'inizio alla fine. Sono rimasto molto soddisfatto del risultato finale e della comunicazione costante.',
      initials: 'G'
    },
    {
      id: 6,
      author: 'Giuseppe Verdi',
      date: '20 Giugno 2025',
      rating: 5,
      text: 'Collaborazione eccellente dall\'inizio alla fine. Sono rimasto molto soddisfatto del risultato finale e della comunicazione costante.',
      initials: 'G'
    }
  ];

  private swiper?: Swiper;
  expandedReviews: Set<number> = new Set();

  ngOnInit(): void {
    setTimeout(() => {
      this.initSwiper();
    }, 100);
  }

  initSwiper(): void {
    this.swiper = new Swiper('.reviews-swiper', {
      modules: [Autoplay],
      slidesPerView: 1.2,
      spaceBetween: 30,
      loop: false,
      autoplay: {
        delay: 6000,
        disableOnInteraction: false,
      },
      breakpoints: {
        768: {
          slidesPerView: 2,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
      },
    });
  }

  getStarsArray(rating: number): number[] {
    return Array(rating).fill(0);
  }

  toggleReview(reviewId: number, event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.expandedReviews.has(reviewId)) {
      this.expandedReviews.delete(reviewId);
    } else {
      this.expandedReviews.add(reviewId);
    }

    // Aggiorna Swiper dopo l'espansione
    setTimeout(() => {
      if (this.swiper) {
        this.swiper.update();
      }
    }, 50);
  }

  isExpanded(reviewId: number): boolean {
    return this.expandedReviews.has(reviewId);
  }

  shouldShowReadMore(text: string): boolean {
    return text.length > 150;
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
  }
}