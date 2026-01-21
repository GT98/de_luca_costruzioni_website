import { Component, OnInit } from '@angular/core';

interface StatItem {
  id: number;
  value: string;
  title: string;
  description: string;
  hasUnderline?: boolean;
}

@Component({
  selector: 'app-company-stats',
  templateUrl: './company-stats.html',
  styleUrls: ['./company-stats.scss']
})
export class CompanyStatsComponent implements OnInit {
  stats: StatItem[] = [
    {
      id: 1,
      value: '+80',
      title: 'Progetti Completati',
      description: 'Ristrutturazioni e costruzioni realizzate con successo sul territorio.'
    },
    {
      id: 2,
      value: '20K',
      title: 'Clienti Soddisfatti',
      description: 'La fiducia dei nostri clienti è il nostro miglior risultato.',
      hasUnderline: true
    },
    {
      id: 3,
      value: '20%',
      title: 'Crescita Annuale',
      description: 'Un trend positivo che testimonia la qualità del nostro lavoro.'
    },
    {
      id: 4,
      value: '+15',
      title: 'Anni di Esperienza',
      description: 'Esperienza consolidata nel settore delle costruzioni e ristrutturazioni.'
    }
  ];

  ngOnInit(): void {
    // Inizializza animazioni quando la sezione diventa visibile
    this.setupIntersectionObserver();
  }

  private setupIntersectionObserver(): void {
    const options = {
      threshold: 0.2
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, options);

    // Osserva tutti gli elementi stat-item
    setTimeout(() => {
      const items = document.querySelectorAll('.stat-item');
      items.forEach(item => observer.observe(item));
    }, 100);
  }
}