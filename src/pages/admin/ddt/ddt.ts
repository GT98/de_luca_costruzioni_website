import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DdtService } from '../../../services/ddt.service';
import { DDT } from '../../../models/ddt';

@Component({
  selector: 'app-ddt',
  imports: [CommonModule],
  templateUrl: './ddt.html',
  styleUrl: './ddt.scss',
})
export default class Ddt implements OnInit {
  private ddtService = inject(DdtService);
  private router = inject(Router);

  ddtList = signal<DDT[]>([]);
  loading = signal(false);
  error = signal<string | null>(null);

  async ngOnInit(): Promise<void> {
    await this.loadDdts();
  }

  async loadDdts(): Promise<void> {
    try {
      this.loading.set(true);
      this.error.set(null);
      const data = await this.ddtService.getDdts();
      this.ddtList.set(data);
    } catch (err) {
      this.error.set('Errore nel caricamento dei DDT');
      console.error(err);
    } finally {
      this.loading.set(false);
    }
  }

  openCreatePage(): void {
    this.router.navigate(['/admin/ddt/create']);
  }

  openEditPage(ddt: DDT): void {
    if (ddt.id) {
      this.router.navigate(['/admin/ddt/edit', ddt.id]);
    }
  }

  async deleteDdt(id: number): Promise<void> {
    if (confirm('Sei sicuro di voler eliminare questo DDT?')) {
      try {
        await this.ddtService.deleteDdt(id);
        await this.loadDdts();
      } catch (err) {
        console.error("Errore nell'eliminazione del DDT:", err);
        alert("Errore nell'eliminazione del DDT");
      }
    }
  }

  downloadDocumento(url: string): void {
    window.open(url, '_blank');
  }

  getTipoBadgeClass(tipo: string): string {
    switch (tipo) {
      case 'carico':
        return 'badge-success';
      case 'scarico':
        return 'badge-warning';
      case 'reso':
        return 'badge-danger';
      default:
        return 'badge-secondary';
    }
  }

  getTipoLabel(tipo: string): string {
    switch (tipo) {
      case 'carico':
        return 'Carico';
      case 'scarico':
        return 'Scarico';
      case 'reso':
        return 'Reso';
      default:
        return tipo;
    }
  }
}
