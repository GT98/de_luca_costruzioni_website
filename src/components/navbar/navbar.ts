import { Component, computed, HostListener, signal } from '@angular/core';
import { Button } from "../button/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.html',
  styleUrls: ['./navbar.scss'],
  imports: [Button,RouterLink],
})
export class Navbar {
  isScrolled = signal(false);
  logoImage = computed(() => this.isScrolled() ? 'assets/images/logo_blue.svg' : 'assets/images/logo_transparent.svg');

  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 250);
  }


}
