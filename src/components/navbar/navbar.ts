import { Component, HostListener, inject, signal } from '@angular/core';
import { ViewportScroller } from '@angular/common';
import { Button } from "../button/button";
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [Button, Button, RouterLink],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss'
})
export default class Navbar {
  viewportScroller = inject(ViewportScroller);
  isMenuOpened = signal(false);
  isScrolled = signal(false);


  @HostListener('window:scroll', [])
  onWindowScroll() {
    this.isScrolled.set(window.scrollY > 50);
  }

  toggleMenu(el: any) {
    el.classList.toggle("change");
    this.isMenuOpened.update((oldValue) => !oldValue);
    document.getElementById('menuMobile')?.classList.toggle('open');
  }

}
