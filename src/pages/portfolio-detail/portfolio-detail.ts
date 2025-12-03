import { Component, OnInit, inject, signal, OnDestroy } from '@angular/core';
import { HeroBanner } from "../../components/hero-banner/hero-banner";
import { FollowOn } from "../../components/follow-on/follow-on";
import { Router, ActivatedRoute } from '@angular/router';
import { Supabase } from '../../services/supabase';
import Swiper from 'swiper';
import { Pagination, Navigation, Thumbs } from 'swiper/modules';
import { Subscription } from 'rxjs';
import { PortfolioList } from "../../components/portfolio-list/portfolio-list";

@Component({
  selector: 'app-portfolio-detail',
  standalone: true,
  imports: [HeroBanner, FollowOn, PortfolioList],
  templateUrl: './portfolio-detail.html',
  styleUrl: './portfolio-detail.scss',
})
export default class PortfolioDetail implements OnInit, OnDestroy {
  private router = inject(Router);
  private route = inject(ActivatedRoute);
  private supabase = inject(Supabase);
  private swiper?: Swiper;
  private fullscreenSwiper?: Swiper;
  private thumbsSwiper?: Swiper;
  fullscreenOpen = false;
  private _prevBodyOverflow?: string;
  private _prevBodyPosition?: string;
  private _prevBodyTop?: string;
  private _prevBodyLeft?: string;
  private _scrollY = 0;
  private _navbarEl?: HTMLElement;
  private _prevNavbarDisplay?: string;
  // keydown handler reference for add/removeEventListener
  private _onKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.fullscreenOpen) {
      this.closeFullscreen();
    }
  };

  project = signal<any | null>(null);
  loading = signal(false);
  private _routeSub?: Subscription;

  async ngOnInit(): Promise<void> {
    // Subscribe to route param changes so the same component instance
    // refreshes when navigating between projects without a full reload.
    this._routeSub = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.loadProjectById(id);
      }
    });

    // aggiungi listener per ESC
    window.addEventListener('keydown', this._onKeyDown);
  }

  private async loadProjectById(id: string): Promise<void> {
    this.loading.set(true);
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
      `).eq('id', id).single();

    this.loading.set(false);
    if (error) {
      console.error('Errore nel recupero dettaglio:', error);
      return;
    }

    this.project.set(data);

    // ensure swipers are re-initialized for the new content
    setTimeout(() => {
      // destroy previous instances to avoid duplicates
      try { this.swiper?.destroy(); } catch {}
      try { this.thumbsSwiper?.destroy(); } catch {}
      try { this.fullscreenSwiper?.destroy(); } catch {}

      this.initSwiper();
      this.initFullscreenSwipers();
      // preload images for immediate display
      this.preloadImages();
    }, 100);
  }

  initSwiper(): void {
    this.swiper = new Swiper('.portfolio-detail-swiper', {
      modules: [Pagination],
      slidesPerView: 1.1,
      spaceBetween: 20,
      centeredSlides: false,
      pagination: {
        el: '.portfolio-detail-swiper .portfolio-detail-pagination',
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

  initFullscreenSwipers(): void {
    // distruggi se già inizializzati
    try {
      this.thumbsSwiper?.destroy();
    } catch { }
    try {
      this.fullscreenSwiper?.destroy();
    } catch { }

    // inizializza thumbs first
    this.thumbsSwiper = new Swiper('.portfolio-fullscreen-thumbs', {
      slidesPerView: 6,
      spaceBetween: 4,
      watchSlidesProgress: true,
      freeMode: true,
      breakpoints: {
        480: { slidesPerView: 4, spaceBetween: 4 },
        768: { slidesPerView: 8, spaceBetween: 4 },
      },
    });

    // main fullscreen swiper
    this.fullscreenSwiper = new Swiper('.portfolio-fullscreen-swiper', {
      modules: [Navigation, Pagination, Thumbs],
      loop: false,
      spaceBetween: 20,
      navigation: {
        nextEl: '.portfolio-fullscreen-button-next',
        prevEl: '.portfolio-fullscreen-button-prev',
      },
      pagination: {
        el: '.portfolio-fullscreen-pagination',
        clickable: true,
      },
      thumbs: {
        swiper: this.thumbsSwiper as any,
      },
    });

    // click thumb -> go
    // (Swiper handles this automatically when thumbs.swiper is provided)
  }

  openFullscreenByUrl(url: string): void {
    if (!this.project()?.immagini) return;
    const idx = (this.project()?.immagini as any[]).findIndex(i => i.url === url);
    this.fullscreenOpen = true;
    // blocca lo scroll del body e mantiene la posizione corrente
    try {
      this._prevBodyOverflow = document.body.style.overflow;
      this._prevBodyPosition = document.body.style.position;
      this._prevBodyTop = document.body.style.top;
      this._prevBodyLeft = document.body.style.left;
      this._scrollY = window.scrollY || window.pageYOffset || 0;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${this._scrollY}px`;
      document.body.style.left = '0';
      document.body.style.overflow = 'hidden';
      // nascondi la navbar direttamente via DOM
      this._navbarEl = document.querySelector('.navbar') as HTMLElement;
      if (this._navbarEl) {
        this._prevNavbarDisplay = this._navbarEl.style.display;
        this._navbarEl.style.display = 'none';
      }
    } catch (e) {
      // ignore in environments without DOM
    }

    // attendi che il DOM mostri l'overlay e gli swiper siano pronti
    setTimeout(() => {
      if (!this.fullscreenSwiper || !this.thumbsSwiper) {
        this.initFullscreenSwipers();
      }
      const targetIndex = idx >= 0 ? idx : 0;
      // slideTo usa indice dello slide (non loop), usiamo 0-based
      this.fullscreenSwiper?.slideTo(targetIndex, 0);
    }, 50);
  }

  onOverlayClick(event: Event): void {
    // chiudi solo se si clicca sullo sfondo dell'overlay (non sulle immagini/thumbs)
    const target = event.target as HTMLElement;
    if (target && target.classList.contains('portfolio-fullscreen-overlay')) {
      this.closeFullscreen();
    }
  }

  closeFullscreen(): void {
    this.fullscreenOpen = false;
    // ripristina lo scroll del body e la posizione salvata
    try {
      document.body.style.overflow = this._prevBodyOverflow ?? '';
      document.body.style.position = this._prevBodyPosition ?? '';
      document.body.style.top = this._prevBodyTop ?? '';
      document.body.style.left = this._prevBodyLeft ?? '';
      // riposiziona la pagina dove era prima di aprire il fullscreen
      if (this._scrollY) {
        window.scrollTo(0, this._scrollY);
      }
      // ripristina la navbar
      if (this._navbarEl) {
        this._navbarEl.style.display = this._prevNavbarDisplay ?? '';
      }
    } catch (e) {
      // ignore
    }
  }

  ngOnDestroy(): void {
    if (this.swiper) {
      this.swiper.destroy();
    }
    if (this.fullscreenSwiper) {
      this.fullscreenSwiper.destroy();
    }
    if (this.thumbsSwiper) {
      this.thumbsSwiper.destroy();
    }
    window.removeEventListener('keydown', this._onKeyDown);
    this._routeSub?.unsubscribe();
    // ripristina body se qualcosa è rimasto
    try {
      document.body.style.overflow = this._prevBodyOverflow ?? '';
      document.body.style.position = this._prevBodyPosition ?? '';
      document.body.style.top = this._prevBodyTop ?? '';
      document.body.style.left = this._prevBodyLeft ?? '';
      if (this._scrollY) window.scrollTo(0, this._scrollY);
      if (this._navbarEl) {
        this._navbarEl.style.display = this._prevNavbarDisplay ?? '';
      }
    } catch (e) { }
  }

  /** Preload immagini per migliorare percezione di caricamento */
  preloadImages(): void {
    try {
      const imgs = (this.project()?.immagini ?? []) as Array<any>;
      const limit = Math.min(20, imgs.length);
      for (let i = 0; i < limit; i++) {
        const url = imgs[i]?.url;
        if (url) {
          const img = new Image();
          img.src = url;
        }
      }
      const cover = this.project()?.cover_img;
      if (cover) {
        const c = new Image();
        c.src = cover;
      }
    } catch (e) {
      // ignore
    }
  }
}
