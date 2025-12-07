import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Footer } from "./components/footer/footer";
import Navbar from './components/navbar/navbar';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Footer, Navbar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {

  private router = inject(Router);

  // 🟢 Il Signal che gestisce lo stato di visualizzazione
  public hideComponent = signal<boolean>(false);
  // Prefisso da nascondere
  private readonly adminPrefix = '/admin';

  constructor() {
    // 👂 Sottoscrizione una tantum all'Observable del router
    this.router.events.pipe(
      filter((event): event is NavigationEnd => event instanceof NavigationEnd)
    ).subscribe(event => {
      const url = event.urlAfterRedirects;

      const shouldHide = url.startsWith(this.adminPrefix);

      // 🎯 Aggiorna il Signal con il nuovo valore
      this.hideComponent.set(shouldHide);
    });
  }

  ngOnInit() {
    this.router.events
      .pipe(
        filter(event => event instanceof NavigationEnd)
      )
      .subscribe(() => {
        window.scrollTo({
          top: 0,
          behavior: 'smooth',
        });
      });
  }
}
