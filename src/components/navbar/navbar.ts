import { Component, HostListener, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Button } from "../button/button";
import { Router, RouterLink } from '@angular/router';

interface MenuItem {
  label: string;
  link: string;
}

interface SocialLink {
  icon: string;
  url: string;
  name: string;
}

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Button, Button, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export default class Navbar {
  router = inject(Router);
  viewportScroller = inject(ViewportScroller);
  isMenuOpened = signal(false);
  isScrolled = signal(false);
  isMobile = signal(false);


  @HostListener('window:scroll', [])
  onWindowScroll() {
    //se è mobile aggiungo la classe scrolled altrimenti no
    if (window.innerWidth <= 768) {
      this.isScrolled.set(window.scrollY > 50);
      this.isMobile.set(true);
    } else {
      this.isMobile.set(false);
    }
  }

  logoUrl = 'assets/images/logo_primary.svg';

  menuItems: MenuItem[] = [
    { label: 'Homepage', link: '/homepage' },
    { label: 'Azienda', link: '/agency' },
    { label: 'Servizi', link: '/services' },
    { label: 'Portfolio', link: '/portfolio' },
    { label: 'Contatti', link: '/contact' }
  ];

  companyInfo = {
    name: 'DE LUCA COSTRUZIONI S.R.L.',
    address: 'Via del Parco Magnolie, 61',
    city: '80013 Casalnuovo di Napoli (NA)',
    phone1: '+39 331 969 14 15',
    phone2: '+39 351 159 29 74',
    email: 'delucacostruzioni2019@gmail.com'
  };

  socialLinks: SocialLink[] = [
    { icon: 'instagram', url: 'https://instagram.com', name: 'Instagram' },
    { icon: 'facebook', url: 'https://facebook.com', name: 'Facebook' },
    { icon: 'linkedin', url: 'https://linkedin.com', name: 'LinkedIn' },
    { icon: 'tiktok', url: 'https://tiktok.com', name: 'TikTok' }
  ];

  onClose(): void {
    this.isMenuOpened.update((oldValue) => !oldValue);
  }

  toggleMenu(link: string | null = null): void {
    // Naviga alla pagina
    if (link) {
      this.router.navigate([link]);
      this.isMenuOpened.update((oldValue) => !oldValue);
    } else {
      this.isMenuOpened.update((oldValue) => !oldValue);
    }
  }

  onCtaClick(): void {
    // Azione per il pulsante CTA
    console.log('Preventivo gratuito clicked');
    this.isMenuOpened.update((oldValue) => !oldValue);
  }

}
